/**
 * Captures campaign parameters (utm_*) from the landing URL and keeps them in
 * sessionStorage so they can be attached to an enquiry. These are campaign
 * labels, not personal data. Browser only.
 */

import { sanitizeAttribution, type Attribution } from "./validation";

const KEY = "rm_attribution_v1";

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const found = sanitizeAttribution({
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      landing_path: window.location.pathname,
    });
    window.sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Ignore storage problems.
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw)) : { landing_path: window.location.pathname };
  } catch {
    return {};
  }
}
