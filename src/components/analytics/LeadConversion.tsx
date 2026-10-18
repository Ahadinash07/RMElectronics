"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";

/**
 * Fires the single lead conversion. It is only rendered by /thank-you, which the
 * server only renders after it has accepted an enquiry (it checks the HttpOnly
 * cookie set by the API). The reference id guards against refresh double-counting.
 * No personal data is sent: only the form id, page path and campaign labels.
 */
export function LeadConversion({ reference }: { reference: string }) {
  useEffect(() => {
    const key = `rm_lead_tracked_${reference}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // If storage is blocked we still fire once per page load.
    }
    const { utm_source, utm_medium, utm_campaign } = readAttribution();
    trackEvent("generate_lead", { form_id: "repair_enquiry", utm_source, utm_medium, utm_campaign });
  }, [reference]);

  return null;
}
