"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button-styles";
import { writeConsent } from "@/lib/consent";
import { ANY_TRACKING_CONFIGURED, TRACKING } from "@/lib/tracking-config";
import { useConsent } from "@/lib/use-consent";

/** Shown only when a tracking tool is configured, consent is required and no choice was made yet. */
export function ConsentBanner() {
  const consent = useConsent();
  const visible = ANY_TRACKING_CONFIGURED && TRACKING.requireConsent && consent === null;

  if (!visible) return null;

  const choose = (state: "granted" | "denied") => {
    writeConsent(state);
  };

  return (
    <section
      aria-label="Cookie and analytics choices"
      className="fixed inset-x-0 z-40 border-t border-line bg-white p-4 shadow-card bottom-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom,0px))] lg:bottom-0"
    >
      <div className="container-page flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink-2">
          We would like to use analytics and advertising cookies to understand how the site is used. Nothing is loaded unless you accept.{" "}
          <Link href="/privacy-policy" className="text-link">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-3">
          <button type="button" className={buttonClasses("secondary", "md", "flex-1 md:flex-none")} onClick={() => choose("denied")}>
            Decline
          </button>
          <button type="button" className={buttonClasses("primary", "md", "flex-1 md:flex-none")} onClick={() => choose("granted")}>
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
