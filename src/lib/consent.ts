/** Minimal consent store for optional tracking scripts (browser only). */

export type ConsentState = "granted" | "denied";

const KEY = "rm_consent_v1";
export const CONSENT_EVENT = "rm-consent-change";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(KEY, state);
  } catch {
    // Storage may be blocked; the choice then lasts for this page view only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}
