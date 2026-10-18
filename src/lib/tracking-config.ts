/**
 * Tracking configuration. NEXT_PUBLIC_ variables must be referenced literally
 * (process.env.NEXT_PUBLIC_X) so Next.js can inline them into the client bundle.
 * Everything is optional: when an ID is empty the matching tool never loads.
 */

const clean = (value: string | undefined) => value?.trim() || "";

export const TRACKING = {
  gaId: clean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  adsId: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  adsLeadLabel: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
  metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  requireConsent: process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT !== "false",
} as const;

export const ANY_TRACKING_CONFIGURED = Boolean(TRACKING.gaId || TRACKING.adsId || TRACKING.metaPixelId);
