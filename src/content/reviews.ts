/**
 * REAL customer reviews only.
 *
 * This list is intentionally EMPTY. Never invent, paraphrase-for-effect, or copy reviews
 * that you do not have permission to use. How to add one:
 *   1. A real customer sends feedback (website review form -> your inbox, Google, Facebook,
 *      WhatsApp or in person).
 *   2. You confirm they were a real customer and that they allow publication.
 *   3. Copy their words exactly (fix only obvious typos, never change the meaning), then add:
 *
 *   {
 *     id: "r1",
 *     name: "Ravi K.",            // first name + initial is enough
 *     area: "Nagole",             // optional
 *     brand: "Samsung",           // optional: LG | Samsung | Sony | OnePlus | Vu | Other
 *     rating: 5,                  // optional, 1-5, only if the customer gave a rating
 *     text: "Their exact words.",
 *     date: "2026-11-02",         // optional, ISO date
 *     source: "Google",           // "Google" | "Facebook" | "WhatsApp" | "Direct"
 *     sourceUrl: "https://...",   // optional link to the original, if public
 *     permission: true,           // must be true
 *   }
 *
 * Do not add review/aggregateRating structured data for these: Google does not allow
 * self-published reviews of your own business in rich results.
 */

export type ReviewSource = "Google" | "Facebook" | "WhatsApp" | "Direct";

export type Review = {
  id: string;
  name: string;
  area?: string;
  brand?: "LG" | "Samsung" | "Sony" | "OnePlus" | "Vu" | "Other";
  rating?: 1 | 2 | 3 | 4 | 5;
  text: string;
  date?: string;
  source: ReviewSource;
  sourceUrl?: string;
  permission: true;
};

export const REVIEWS: Review[] = [];

/** Public review links. The Google link only appears if the owner sets NEXT_PUBLIC_GOOGLE_REVIEWS_URL. */
export const GOOGLE_REVIEWS_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const ok = url.protocol === "https:" && /(^|\.)((google\.[a-z.]+)|g\.page|goo\.gl|maps\.app\.goo\.gl)$/i.test(url.hostname);
    return ok ? url.toString() : "";
  } catch {
    return "";
  }
})();
