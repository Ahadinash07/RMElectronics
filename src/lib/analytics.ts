/**
 * Privacy-safe analytics layer (browser only).
 *
 * - Does nothing unless a tracking tool has actually been loaded
 *   (see AnalyticsScripts) - so it is inert when unconfigured or when consent
 *   has not been given.
 * - Only allow-listed parameter names are ever sent, and values that look like
 *   a phone number or email are dropped. Names, phone numbers, problem text and
 *   WhatsApp message text are NEVER passed to analytics.
 * - A tracking failure can never break a call, form or navigation.
 */

import { TRACKING } from "./tracking-config";

export type AnalyticsEventName =
  | "phone_click"
  | "whatsapp_click"
  | "repair_form_open"
  | "repair_form_start"
  | "generate_lead"
  | "form_error"
  | "directions_click"
  | "review_open"
  | "review_submit"
  | "gallery_open";

export const ALLOWED_PARAMS = [
  "placement",
  "page_path",
  "form_id",
  "error_category",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

type AllowedParam = (typeof ALLOWED_PARAMS)[number];
export type AnalyticsParams = Partial<Record<AllowedParam, string>>;

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    dataLayer?: unknown[];
  }
}

const MAX_VALUE_LENGTH = 100;

const INDIAN_MOBILE_LIKE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/;

/** True for values that look like an email address or an Indian mobile number. */
export function looksLikePersonalData(value: string): boolean {
  return value.includes("@") || INDIAN_MOBILE_LIKE.test(value);
}

/** Keeps only allow-listed keys with short, non-personal string values. */
export function sanitizeParams(params: Record<string, unknown> | undefined): AnalyticsParams {
  const out: AnalyticsParams = {};
  if (!params) return out;
  for (const key of ALLOWED_PARAMS) {
    const value = params[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
    if (!trimmed || looksLikePersonalData(trimmed)) continue;
    out[key] = trimmed;
  }
  return out;
}

const META_STANDARD: Partial<Record<AnalyticsEventName, string>> = {
  generate_lead: "Lead",
};

export function trackEvent(name: AnalyticsEventName, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const safe = sanitizeParams({ page_path: window.location.pathname, ...params });

    if (typeof window.gtag === "function") {
      window.gtag("event", name, safe);
      if (name === "generate_lead" && TRACKING.adsId && TRACKING.adsLeadLabel) {
        window.gtag("event", "conversion", { send_to: `${TRACKING.adsId}/${TRACKING.adsLeadLabel}` });
      }
    }

    if (typeof window.fbq === "function") {
      const standard = META_STANDARD[name];
      if (standard) window.fbq("track", standard);
      else window.fbq("trackCustom", name, safe);
    }
  } catch {
    // Tracking must never break the site.
  }
}
