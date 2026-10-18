/**
 * POST /api/review-submission. Same honesty rules as enquiries: success is returned only
 * after the provider accepted the message. A submitted review is sent to the owner for
 * approval; nothing is published automatically.
 */

import { deliverMessage, readDeliveryConfig, type DeliveryResult, type OutgoingMessage } from "./lead-delivery";
import type { RateLimiter, SeenStore } from "./rate-limit";
import { MAX_BODY_BYTES, MIN_FILL_MS, type HandlerInput, type HandlerResult } from "./enquiry-handler";
import { validateReview, type ValidReview } from "./review-validation";

export type ReviewHandlerDeps = {
  env: Record<string, string | undefined>;
  rateLimiter: RateLimiter;
  seen: SeenStore<string>;
  inflight?: Map<string, Promise<DeliveryResult>>;
  fetchFn?: typeof fetch;
  generateReference?: () => string;
  log?: (message: string) => void;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function defaultReference(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function buildReviewMessage(review: ValidReview, reference: string, receivedAt: string): OutgoingMessage {
  const stars = `${review.rating}/5`;
  const text = [
    "New customer review submitted on the RM Electronics website (NOT published yet)",
    "",
    `Reference: ${reference}`,
    `Received: ${receivedAt}`,
    "",
    `Name: ${review.name}`,
    `Area: ${review.area || "Not provided"}`,
    `TV brand: ${review.brand || "Not provided"}`,
    `Rating: ${stars}`,
    "",
    "Review:",
    review.text,
    "",
    "Customer gave permission to publish if approved.",
    "To publish: verify this is a real customer, then add it to src/content/reviews.ts. Do not edit the meaning of the review.",
  ].join("\n");
  return {
    subject: `New review to approve [${reference}] - ${stars}`,
    reference: `review-${reference}`,
    text,
    payload: {
      source: "rm-electronics-website",
      kind: "review",
      reference,
      receivedAt,
      name: review.name,
      area: review.area,
      brand: review.brand,
      rating: review.rating,
      text: review.text,
      permission: true,
      consentVersion: review.consentVersion,
    },
  };
}

export function createReviewHandler(deps: ReviewHandlerDeps) {
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
    if (!input.contentType?.toLowerCase().startsWith("application/json")) return { status: 415, body: { ok: false, code: "bad_request" } };
    if (input.contentLength !== null && input.contentLength > MAX_BODY_BYTES) return { status: 413, body: { ok: false, code: "too_large" } };

    const limit = rateLimiter.check(input.ip);
    if (!limit.allowed) {
      return { status: 429, body: { ok: false, code: "rate_limited", retryAfterSec: limit.retryAfterSec }, headers: { "Retry-After": String(limit.retryAfterSec) } };
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
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return { status: 400, body: { ok: false, code: "bad_request" } };
    const payload = parsed as Record<string, unknown>;

    if (typeof payload.website === "string" && payload.website.trim() !== "") return { status: 400, body: { ok: false, code: "rejected" } };
    const elapsed = payload.elapsedMs;
    if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return { status: 400, body: { ok: false, code: "rejected" } };

    const submissionId = payload.submissionId;
    if (typeof submissionId !== "string" || !UUID_PATTERN.test(submissionId)) return { status: 400, body: { ok: false, code: "bad_request" } };

    const validation = validateReview(payload);
    if (!validation.ok) return { status: 400, body: { ok: false, code: "invalid", errors: validation.errors } };

    const alreadyAccepted = seen.get(submissionId);
    if (alreadyAccepted) return { status: 200, body: { ok: true, reference: alreadyAccepted } };

    const config = readDeliveryConfig(env);
    if (!config) {
      log("[review] Delivery is not configured. Review was NOT delivered.");
      return { status: 503, body: { ok: false, code: "not_configured" } };
    }

    const reference = generateReference();
    let pending = inflight.get(submissionId);
    if (!pending) {
      const message = buildReviewMessage(validation.data, reference, new Date().toISOString());
      pending = deliverMessage(message, config, fetchFn ? { fetchFn } : {}).finally(() => inflight.delete(submissionId));
      inflight.set(submissionId, pending);
    }
    const result = await pending;
    if (!result.ok) {
      log(`[review] Delivery failed via ${config.provider}: ${result.reason}${result.status ? ` (HTTP ${result.status})` : ""}`);
      return { status: 502, body: { ok: false, code: "delivery_failed" } };
    }
    const finalReference = seen.get(submissionId) ?? reference;
    seen.set(submissionId, finalReference);
    return { status: 200, body: { ok: true, reference: finalReference } };
  };
}
