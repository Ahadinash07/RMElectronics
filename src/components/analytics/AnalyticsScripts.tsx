"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { TRACKING } from "@/lib/tracking-config";
import { useConsent } from "@/lib/use-consent";

/**
 * Loads GA4 / Google Ads / Meta Pixel ONLY when:
 *   1. the matching ID is configured, and
 *   2. consent has been granted (unless NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=false).
 * With no IDs configured this component renders nothing and loads nothing.
 */
export function AnalyticsScripts() {
  const consent = useConsent();
  const allowed = !TRACKING.requireConsent || consent === "granted";

  useEffect(() => {
    captureAttribution();
  }, []);

  if (!allowed) return null;

  const googleId = TRACKING.gaId || TRACKING.adsId;

  return (
    <>
      {googleId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${
              TRACKING.gaId ? `gtag('config',${JSON.stringify(TRACKING.gaId)},{allow_google_signals:false,allow_ad_personalization_signals:false});` : ""
            }${TRACKING.adsId ? `gtag('config',${JSON.stringify(TRACKING.adsId)});` : ""}`}
          </Script>
        </>
      ) : null}
      {TRACKING.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(TRACKING.metaPixelId)});fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
