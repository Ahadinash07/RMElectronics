import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentState } from "./consent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Returns the stored choice, null if none yet, or "server" while rendering on the server. */
export function useConsent(): ConsentState | null | "server" {
  return useSyncExternalStore<ConsentState | null | "server">(subscribe, readConsent, () => "server");
}
