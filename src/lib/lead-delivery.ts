/**
 * Real lead delivery. Two providers are supported, chosen with
 * LEAD_DELIVERY_PROVIDER:
 *   - "resend"  : sends an email through the Resend REST API
 *   - "webhook" : POSTs JSON to a URL (CRM, Zapier, Make, Apps Script, ...)
 *
 * There is deliberately NO "fake" or "log only" mode. If nothing is
 * configured, readDeliveryConfig() returns null and the API answers with an
 * error, so a customer is never told an enquiry was delivered when it was not.
 *
 * This file is server-only. It must never be imported from a Client Component.
 */

import type { ValidEnquiry } from "./validation";

export type DeliveryConfig =
  | { provider: "resend"; apiKey: string; to: string; from: string }
  | { provider: "webhook"; url: string; secret?: string };

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "provider_rejected" | "network" | "timeout"; status?: number };

type Env = Record<string, string | undefined>;

const EMAIL_PATTERN = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+$/;
const FROM_PATTERN = /^(?:[^<>\r\n]{1,80}\s)?<[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+>$/;

function isLocalhost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function readDeliveryConfig(env: Env): DeliveryConfig | null {
  const provider = env.LEAD_DELIVERY_PROVIDER?.trim().toLowerCase();

  if (provider === "resend") {
    const apiKey = env.RESEND_API_KEY?.trim();
    const to = env.LEAD_TO_EMAIL?.trim();
    const from = env.LEAD_FROM_EMAIL?.trim();
    if (!apiKey || !to || !from) return null;
    if (!EMAIL_PATTERN.test(to)) return null;
    if (!EMAIL_PATTERN.test(from) && !FROM_PATTERN.test(from)) return null;
    return { provider: "resend", apiKey, to, from };
  }

  if (provider === "webhook") {
    const raw = env.LEAD_WEBHOOK_URL?.trim();
    if (!raw) return null;
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocalhost(url.hostname))) return null;
      const secret = env.LEAD_WEBHOOK_SECRET?.trim();
      return { provider: "webhook", url: url.toString(), ...(secret ? { secret } : {}) };
    } catch {
      return null;
    }
  }

  return null;
}

export function formatLeadSubject(lead: ValidEnquiry, reference: string): string {
  // Only enum values go into the subject, never free text (prevents header tricks).
  return `New TV repair enquiry [${reference}] - ${lead.brand}`;
}

export function formatLeadText(lead: ValidEnquiry, reference: string, receivedAtIso: string): string {
  const lines = [
    "New repair enquiry from the RM Electronics website",
    "",
    `Reference: ${reference}`,
    `Received: ${receivedAtIso}`,
    "",
    `Name: ${lead.name}`,
    `Mobile: ${lead.phone}`,
    `TV brand: ${lead.brand}`,
    `Model: ${lead.model || "Not provided"}`,
    `Problem: ${lead.problem}`,
    `Area: ${lead.locality}`,
    `Preferred contact: ${lead.contactMethod || "Not specified"}`,
    "",
    "Additional details:",
    lead.details || "Not provided",
    "",
    `Consent: given (policy version ${lead.consentVersion})`,
  ];
  const a = lead.attribution;
  if (a.utm_source || a.utm_medium || a.utm_campaign || a.landing_path) {
    lines.push(
      "",
      "Source:",
      `utm_source=${a.utm_source ?? "-"}  utm_medium=${a.utm_medium ?? "-"}  utm_campaign=${a.utm_campaign ?? "-"}`,
      `Landing page: ${a.landing_path ?? "-"}`,
    );
  }
  lines.push("", "Reply by phone or WhatsApp to the number above. This message was generated automatically.");
  return lines.join("\n");
}

type FetchLike = typeof fetch;

async function postJson(
  fetchFn: FetchLike,
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs: number,
): Promise<DeliveryResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.ok) return { ok: true };
    return { ok: false, reason: "provider_rejected", status: response.status };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

export type OutgoingMessage = {
  /** Used for the email subject and as the idempotency key. Only trusted/enum text. */
  subject: string;
  reference: string;
  /** Plain-text body for email delivery. */
  text: string;
  /** Structured body for webhook delivery. */
  payload: Record<string, unknown>;
};

type DeliverOptions = { fetchFn?: FetchLike; now?: () => Date; timeoutMs?: number };

/** Sends any prepared message through the configured provider. */
export async function deliverMessage(
  message: OutgoingMessage,
  config: DeliveryConfig,
  options: DeliverOptions = {},
): Promise<DeliveryResult> {
  const { fetchFn = fetch, timeoutMs = 10_000 } = options;

  if (config.provider === "resend") {
    return postJson(
      fetchFn,
      "https://api.resend.com/emails",
      { Authorization: `Bearer ${config.apiKey}`, "Idempotency-Key": `rm-${message.reference}` },
      { from: config.from, to: [config.to], subject: message.subject, text: message.text },
      timeoutMs,
    );
  }

  return postJson(
    fetchFn,
    config.url,
    config.secret ? { Authorization: `Bearer ${config.secret}` } : {},
    message.payload,
    timeoutMs,
  );
}

export async function deliverLead(
  lead: ValidEnquiry,
  reference: string,
  config: DeliveryConfig,
  options: DeliverOptions = {},
): Promise<DeliveryResult> {
  const { now = () => new Date() } = options;
  const receivedAt = now().toISOString();
  return deliverMessage(
    {
      subject: formatLeadSubject(lead, reference),
      reference: `lead-${reference}`,
      text: formatLeadText(lead, reference, receivedAt),
      payload: {
        source: "rm-electronics-website",
        kind: "enquiry",
        reference,
        receivedAt,
        name: lead.name,
        phone: lead.phone,
        brand: lead.brand,
        model: lead.model,
        problem: lead.problem,
        locality: lead.locality,
        contactMethod: lead.contactMethod,
        details: lead.details,
        consentVersion: lead.consentVersion,
        attribution: lead.attribution,
      },
    },
    config,
    options,
  );
}
