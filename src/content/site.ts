/**
 * Single source of truth for business details.
 * Everything public-facing (header, footer, contact page, JSON-LD, CTAs)
 * reads from here. Do not hard-code the phone, email or address elsewhere.
 *
 * Facts below come from the owner's signboard and the client's message.
 * Do NOT add opening hours, prices, warranty, ratings, years in business,
 * authorised-service status, home visits or pickup unless the owner confirms.
 */

function resolveSiteUrl(raw: string | undefined): string {
  const candidate = raw?.trim() || "http://localhost:3000";
  try {
    return new URL(candidate).origin;
  } catch {
    return "http://localhost:3000";
  }
}

/** Origin only (no path, no trailing slash). Falls back to localhost if the env var is empty or malformed. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const WHATSAPP_VERIFIED = process.env.NEXT_PUBLIC_WHATSAPP_VERIFIED === "true";

export type BusinessHours = {
  /** e.g. "Mon-Sat" */
  days: string;
  /** e.g. "10:00 am - 8:00 pm" */
  time: string;
  /** schema.org format, e.g. "Mo-Sa 10:00-20:00" */
  schema: string;
}[];

export const BUSINESS = {
  name: "RM Electronics",
  tagline: "TV Service and Repair",
  category: "Doorstep LCD, LED and Smart TV repair and service in Hyderabad",
  description:
    "RM Electronics provides doorstep LCD, LED and Smart TV repair across Hyderabad, from its base in Nagole.",
  phone: {
    display: "78934 57190",
    e164: "+917893457190",
    href: "tel:+917893457190",
    /** Digits only, international format, used for wa.me links. */
    waDigits: "917893457190",
  },
  email: "rmelectronics1995@gmail.com",
  address: {
    streetAddress: "Plot No. 5, Road No. 2, near Vishal Mega Mart, Shrungeri Colony, Nagole",
    locality: "Hyderabad",
    area: "Nagole",
    region: "Telangana",
    postalCode: "500035",
    country: "IN",
    /** One-line version exactly as it should be displayed. */
    full: "Plot No. 5, Road No. 2, near Vishal Mega Mart, Shrungeri Colony, Nagole, Hyderabad, Telangana 500035",
  },
  social: {
    facebook: "https://www.facebook.com/p/RM-Electronics-61586263764631/",
    instagram: "https://www.instagram.com/rm_electronics.hyd/",
  },
  /**
   * Opening hours are NOT confirmed. Keep null so no hours are shown or
   * published in structured data. When the owner supplies them, fill in e.g.
   *   [{ days: "Mon-Sat", time: "10:00 am - 8:00 pm", schema: "Mo-Sa 10:00-20:00" }]
   */
  hours: null as BusinessHours | null,
  whatsappVerified: WHATSAPP_VERIFIED,
} as const;

/**
 * Doorstep service facts. The owner confirmed this is a doorstep service. The visiting charge,
 * experience and area list come from the business's own Facebook/Instagram posts as supplied by
 * the owner; re-confirm them before launch and edit here if anything changes.
 *
 * NOT included (not confirmed by the owner, only seen in an unsourced AI summary):
 * opening hours, warranty period, "10,000+ TVs repaired". Add them only when the owner confirms.
 */
export const DOORSTEP = {
  headline: "Doorstep TV repair across Hyderabad",
  short: "Doorstep TV repair in Hyderabad",
  visitingCharge: "\u20b9199",
  visitingChargeText: "Visiting charges start at \u20b9199. The repair cost depends on the TV and the fault, and is discussed after diagnosis.",
  experience: "20+ years",
  experienceText: "Technicians with 20+ years of industry experience.",
  areas: ["Nagole", "Saidabad", "Boduppal", "Tarnaka", "Badangpet", "Kukatpally", "Vanasthalipuram"],
  areasNote:
    "Technicians visit homes across Hyderabad, including Nagole, Saidabad, Boduppal, Tarnaka, Badangpet, Kukatpally and Vanasthalipuram. Call to confirm your area.",
} as const;

/** Second number published by the business for spare-parts and PCB enquiries. */
export const SPARE_PARTS_PHONE = {
  display: "90598 88821",
  href: "tel:+919059888821",
  label: "Spare parts and PCB enquiries",
} as const;

export const INDEPENDENT_DISCLAIMER =
  "RM Electronics is an independent TV repair service. It is not presented as an authorised service centre for any brand. Brand names are used only to describe the TVs you can ask about.";

/** Google Maps links built from the written address. No coordinates are guessed. */
export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address.full}`,
)}`;

export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  BUSINESS.address.full,
)}`;

/** Builds a wa.me link. Only call this when BUSINESS.whatsappVerified is true. */
export function buildWhatsAppUrl(message?: string): string {
  const text =
    message ?? "Hi RM Electronics, I need help with my TV. Please let me know the next step.";
  return `https://wa.me/${BUSINESS.phone.waDigits}?text=${encodeURIComponent(text)}`;
}

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRIVACY_EFFECTIVE_DATE = "17 October 2026";
