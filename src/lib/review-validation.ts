/**
 * Validation for customer review submissions. Pure functions (browser + server).
 * Submitted reviews are NEVER published automatically: they are delivered to the
 * owner, who decides whether to add them to src/content/reviews.ts.
 */

import { BRAND_OPTIONS, cleanMultiline, cleanText, type BrandOption } from "./validation";

export const REVIEW_LIMITS = { nameMin: 2, nameMax: 60, areaMax: 60, textMin: 20, textMax: 600 } as const;
export const REVIEW_CONSENT_VERSION = "2026-10-17-review";

export type ReviewFormValues = {
  name: string;
  area: string;
  brand: string;
  rating: string;
  text: string;
  permission: boolean;
};

export type ReviewFieldName = keyof ReviewFormValues;
export type ReviewFieldErrors = Partial<Record<ReviewFieldName, string>>;

export const EMPTY_REVIEW: ReviewFormValues = { name: "", area: "", brand: "", rating: "", text: "", permission: false };

export type ValidReview = {
  name: string;
  area: string;
  brand: BrandOption | "";
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  permission: true;
  consentVersion: string;
};

export type ReviewValidationResult = { ok: true; data: ValidReview } | { ok: false; errors: ReviewFieldErrors };

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const AREA_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s.,'’/&()-]*$/u;
const URL_OR_EMAIL = /(https?:\/\/|www\.|@[\w-]+\.)/i;

export function validateReview(raw: unknown): ReviewValidationResult {
  const src = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const errors: ReviewFieldErrors = {};

  const name = cleanText(src.name, REVIEW_LIMITS.nameMax);
  if (name.length < REVIEW_LIMITS.nameMin) errors.name = "Please enter your name (a first name is fine).";
  else if (name.length > REVIEW_LIMITS.nameMax) errors.name = `Name must be ${REVIEW_LIMITS.nameMax} characters or fewer.`;
  else if (!NAME_PATTERN.test(name)) errors.name = "Name can include letters, spaces, full stops, hyphens and apostrophes only.";

  const area = cleanText(src.area, REVIEW_LIMITS.areaMax);
  if (area.length > REVIEW_LIMITS.areaMax) errors.area = `Area must be ${REVIEW_LIMITS.areaMax} characters or fewer.`;
  else if (area && !AREA_PATTERN.test(area)) errors.area = "Area contains characters we cannot accept.";

  const brand = cleanText(src.brand, 30);
  if (brand && !(BRAND_OPTIONS as readonly string[]).includes(brand)) errors.brand = "Please choose a brand from the list.";

  const ratingRaw = typeof src.rating === "string" || typeof src.rating === "number" ? String(src.rating) : "";
  if (!ratingRaw) errors.rating = "Please choose a rating from 1 to 5.";
  else if (!/^[1-5]$/.test(ratingRaw)) errors.rating = "Rating must be between 1 and 5.";

  const text = cleanMultiline(src.text, REVIEW_LIMITS.textMax);
  if (text.length < REVIEW_LIMITS.textMin) errors.text = `Please write at least ${REVIEW_LIMITS.textMin} characters about your experience.`;
  else if (text.length > REVIEW_LIMITS.textMax) errors.text = `Review must be ${REVIEW_LIMITS.textMax} characters or fewer.`;
  else if (URL_OR_EMAIL.test(text)) errors.text = "Please do not include web links or email addresses in your review.";

  if (src.permission !== true) errors.permission = "Please confirm that RM Electronics may publish your review if it is approved.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      area,
      brand: brand as BrandOption | "",
      rating: Number(ratingRaw) as ValidReview["rating"],
      text,
      permission: true,
      consentVersion: REVIEW_CONSENT_VERSION,
    },
  };
}

export const REVIEW_FIELD_ORDER: ReviewFieldName[] = ["name", "area", "brand", "rating", "text", "permission"];

export function validateReviewValues(values: ReviewFormValues): ReviewFieldErrors {
  const r = validateReview(values);
  return r.ok ? {} : r.errors;
}
