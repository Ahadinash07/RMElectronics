/**
 * Framework-independent handler for POST /api/repair-enquiry.
 * The Next.js route handler is a thin wrapper, which keeps this logic unit-testable.
 *
 * Contract (the client redirects to /thank-you ONLY on HTTP 200 with ok:true):
 *   200 { ok: true, reference }                       lead accepted by the provider
 *   400 { ok: false, code: "invalid", errors }        field validation failed
 *   400 { ok: false, code: "rejected" }               honeypot / timing check failed
 *   413 / 415                                         body too large / wrong content type
 *   429 { ok: false, code: "rate_limited" }           too many attempts
 *   502 { ok: false, code: "delivery_failed" }        provider rejected or unreachable
 *   503 { ok: false, code: "not_configured" }         no delivery provider configured
 */

import { deliverLead, readDeliveryConfig, type DeliveryResult } from "./lead-delivery";
import type { RateLimiter, SeenStore } from "./rate-limit";
import { validateEnquiry } from "./validation";

export type EnquiryResponseBody =
  | { ok: true; reference: string }
  | { ok: false; code: "invalid"; errors: Partial<Record<string, string>> }
  | { ok: false; code: "rejected" | "rate_limited" | "delivery_failed" | "not_configured" | "too_large" | "bad_request"; retryAfterSec?: number };

export type HandlerResult = {
  status: number;
  body: EnquiryResponseBody;
  headers?: Record<string, string>;
};

export type HandlerDeps = {
  env: Record<string, string | undefined>;
  rateLimiter: RateLimiter;
  seen: SeenStore<string>;
  inflight?: Map<string, Promise<DeliveryResult>>;
  fetchFn?: typeof fetch;
  generateReference?: () => string;
  log?: (message: string) => void;
};

export type HandlerInput = {
  contentType: string | null;
  contentLength: number | null;
  ip: string;
  readBody: () => Promise<string>;
};

export const MAX_BODY_BYTES = 12_000;
export const MIN_FILL_MS = 1_500;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function defaultReference(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function createEnquiryHandler(deps: HandlerDeps) {
  const {
    env,
    rateLimiter,
    seen,
    inflight = new Map<string, Promise<DeliveryResult>>(),
    fetchFn,
    generateReference = defaultReference,
    log = (m) => console.error(m),
  } = deps;

  return async function handle(input: HandlerInput): Promise<HandlerResult> {
    if (!input.contentType?.toLowerCase().startsWith("application/json")) {
      return { status: 415, body: { ok: false, code: "bad_request" } };
    }
    if (input.contentLength !== null && input.contentLength > MAX_BODY_BYTES) {
      return { status: 413, body: { ok: false, code: "too_large" } };
    }

    const limit = rateLimiter.check(input.ip);
    if (!limit.allowed) {
      return {
        status: 429,
        body: { ok: false, code: "rate_limited", retryAfterSec: limit.retryAfterSec },
        headers: { "Retry-After": String(limit.retryAfterSec) },
      };
    }

    let text: string;
    try {
      text = await input.readBody();
    } catch {
      return { status: 400, body: { ok: false, code: "bad_request" } };
    }
    if (text.length > MAX_BODY_BYTES) return { status: 413, body: { ok: false, code: "too_large" } };

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { status: 400, body: { ok: false, code: "bad_request" } };
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { status: 400, body: { ok: false, code: "bad_request" } };
    }
    const payload = parsed as Record<string, unknown>;

    // Bot checks. Real visitors never fill the hidden field and take longer than 1.5s.
    if (typeof payload.website === "string" && payload.website.trim() !== "") {
      return { status: 400, body: { ok: false, code: "rejected" } };
    }
    const elapsed = payload.elapsedMs;
    if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
      return { status: 400, body: { ok: false, code: "rejected" } };
    }

    const submissionId = payload.submissionId;
    if (typeof submissionId !== "string" || !UUID_PATTERN.test(submissionId)) {
      return { status: 400, body: { ok: false, code: "bad_request" } };
    }

    const validation = validateEnquiry(payload);
    if (!validation.ok) {
      return { status: 400, body: { ok: false, code: "invalid", errors: validation.errors } };
    }

    // A retry of an already-accepted submission must not create a second lead.
    const alreadyAccepted = seen.get(submissionId);
    if (alreadyAccepted) return { status: 200, body: { ok: true, reference: alreadyAccepted } };

    const config = readDeliveryConfig(env);
    if (!config) {
      log("[lead] Delivery is not configured (check LEAD_DELIVERY_PROVIDER and its credentials). Enquiry was NOT delivered.");
      return { status: 503, body: { ok: false, code: "not_configured" } };
    }

    const reference = generateReference();
    let pending = inflight.get(submissionId);
    if (!pending) {
      pending = deliverLead(validation.data, reference, config, fetchFn ? { fetchFn } : {}).finally(() => {
        inflight.delete(submissionId);
      });
      inflight.set(submissionId, pending);
    }
    const result = await pending;

    if (!result.ok) {
      // Log the failure category only. No names, numbers or message text.
      log(`[lead] Delivery failed via ${config.provider}: ${result.reason}${result.status ? ` (HTTP ${result.status})` : ""}`);
      return { status: 502, body: { ok: false, code: "delivery_failed" } };
    }

    const finalReference = seen.get(submissionId) ?? reference;
    seen.set(submissionId, finalReference);
    return { status: 200, body: { ok: true, reference: finalReference } };
  };
}
