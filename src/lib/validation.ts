/**
 * Enquiry validation. Pure functions, no framework imports, so the exact same
 * code runs in the browser (instant feedback) and on the server (the check
 * that actually matters). Never trust the client-side result.
 */

export const BRAND_OPTIONS = ["LG", "Samsung", "Sony", "OnePlus", "Vu", "Mi", "Panasonic", "Micromax", "Other"] as const;
export type BrandOption = (typeof BRAND_OPTIONS)[number];

export const PROBLEM_OPTIONS = [
  "TV not turning on",
  "Sound but no picture",
  "Lines or colour distortion on screen",
  "Backlight or brightness issue",
  "No sound or distorted sound",
  "Smart TV, Wi-Fi or app issue",
  "Other",
] as const;
export type ProblemOption = (typeof PROBLEM_OPTIONS)[number];

export const CONTACT_METHODS = ["Call", "WhatsApp"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  localityMin: 2,
  localityMax: 80,
  modelMax: 60,
  detailsMax: 500,
  attributionMax: 100,
} as const;

export const CONSENT_VERSION = "2026-10-17";

export type EnquiryFormValues = {
  name: string;
  phone: string;
  brand: string;
  problem: string;
  locality: string;
  model: string;
  contactMethod: string;
  details: string;
  consent: boolean;
};

export type FieldName = keyof EnquiryFormValues;
export type FieldErrors = Partial<Record<FieldName, string>>;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_path?: string;
};

export type ValidEnquiry = {
  name: string;
  /** Normalised to +91XXXXXXXXXX */
  phone: string;
  brand: BrandOption;
  problem: ProblemOption;
  locality: string;
  model: string;
  contactMethod: ContactMethod | "";
  details: string;
  consent: true;
  consentVersion: string;
  attribution: Attribution;
};

export const EMPTY_VALUES: EnquiryFormValues = {
  name: "",
  phone: "",
  brand: "",
  problem: "",
  locality: "",
  model: "",
  contactMethod: "",
  details: "",
  consent: false,
};

/** Removes control characters, collapses whitespace, trims. */
export function cleanText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  const withoutControls = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return withoutControls.replace(/\s+/g, " ").trim().slice(0, maxLength + 1);
}

/** Multi-line version that keeps single newlines (for the details box). */
export function cleanMultiline(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  const withoutControls = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return withoutControls
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength + 1);
}

/**
 * Accepts common ways of writing an Indian mobile number:
 * 9876543210, 98765 43210, 09876543210, 919876543210, +91 98765-43210, (+91) 9876543210.
 * Returns +91XXXXXXXXXX, or null if it is not a valid 10-digit mobile starting 6-9.
 */
export function normalizeIndianMobile(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 25) return null;
  if (!/^[+()\d\s-]+$/.test(trimmed)) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return `+91${digits}`;
}

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const LOCALITY_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s.,'’/&()-]*$/u;
const ATTRIBUTION_PATTERN = /^[\w\-.~:/ %+]*$/;

export function sanitizeAttribution(input: unknown): Attribution {
  if (typeof input !== "object" || input === null) return {};
  const source = input as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "landing_path"] as const) {
    const value = cleanText(source[key], LIMITS.attributionMax);
    if (value && value.length <= LIMITS.attributionMax && ATTRIBUTION_PATTERN.test(value)) {
      out[key] = value;
    }
  }
  return out;
}

function isOneOf<T extends string>(options: readonly T[], value: string): value is T {
  return (options as readonly string[]).includes(value);
}

export type ValidationResult =
  | { ok: true; data: ValidEnquiry }
  | { ok: false; errors: FieldErrors };

/**
 * Validates untrusted input. `raw` is typed `unknown` on purpose:
 * the server passes parsed JSON straight in.
 */
export function validateEnquiry(raw: unknown): ValidationResult {
  const src = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = cleanText(src.name, LIMITS.nameMax);
  if (name.length < LIMITS.nameMin) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.nameMax) errors.name = `Name must be ${LIMITS.nameMax} characters or fewer.`;
  else if (!NAME_PATTERN.test(name)) errors.name = "Name can include letters, spaces, full stops, hyphens and apostrophes only.";

  const phoneRaw = typeof src.phone === "string" ? src.phone : "";
  const phone = normalizeIndianMobile(phoneRaw);
  if (!phoneRaw.trim()) errors.phone = "Please enter your mobile number.";
  else if (!phone) errors.phone = "Enter a valid 10-digit Indian mobile number, for example 98765 43210.";

  const brand = cleanText(src.brand, 30);
  if (!brand) errors.brand = "Please choose your TV brand.";
  else if (!isOneOf(BRAND_OPTIONS, brand)) errors.brand = "Please choose a brand from the list.";

  const problem = cleanText(src.problem, 60);
  if (!problem) errors.problem = "Please choose the problem you are seeing.";
  else if (!isOneOf(PROBLEM_OPTIONS, problem)) errors.problem = "Please choose a problem from the list.";

  const locality = cleanText(src.locality, LIMITS.localityMax);
  if (locality && locality.length < LIMITS.localityMin) errors.locality = "Please enter at least two characters for your area.";
  else if (locality.length > LIMITS.localityMax) errors.locality = `Area must be ${LIMITS.localityMax} characters or fewer.`;
  else if (locality && !LOCALITY_PATTERN.test(locality)) errors.locality = "Area contains characters we cannot accept.";

  const model = cleanText(src.model, LIMITS.modelMax);
  if (model.length > LIMITS.modelMax) errors.model = `Model must be ${LIMITS.modelMax} characters or fewer.`;

  const contactMethod = cleanText(src.contactMethod, 20);
  if (contactMethod && !isOneOf(CONTACT_METHODS, contactMethod)) {
    errors.contactMethod = "Please choose a contact method from the list.";
  }

  const details = cleanMultiline(src.details, LIMITS.detailsMax);
  if (details.length > LIMITS.detailsMax) errors.details = `Details must be ${LIMITS.detailsMax} characters or fewer.`;

  if (src.consent !== true) errors.consent = "Please confirm that RM Electronics may use these details to reply to your enquiry.";

  if (Object.keys(errors).length > 0 || !phone) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      phone,
      brand: brand as BrandOption,
      problem: problem as ProblemOption,
      locality,
      model,
      contactMethod: contactMethod as ContactMethod | "",
      details,
      consent: true,
      consentVersion: CONSENT_VERSION,
      attribution: sanitizeAttribution(src.attribution),
    },
  };
}

/** Client helper: validate form values as typed (same rules as the server). */
export function validateFormValues(values: EnquiryFormValues): FieldErrors {
  const result = validateEnquiry(values);
  return result.ok ? {} : result.errors;
}

/** Order used to focus the first invalid field. */
export const FIELD_ORDER: FieldName[] = [
  "name",
  "phone",
  "brand",
  "problem",
  "locality",
  "model",
  "contactMethod",
  "details",
  "consent",
];

export function firstInvalidField(errors: FieldErrors): FieldName | null {
  return FIELD_ORDER.find((f) => errors[f]) ?? null;
}
