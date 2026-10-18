import { BRANDS, type Brand, type BrandSymptom } from "./brands";
import type { Faq } from "./faqs";
import { GENERAL_FAQS } from "./faqs";
import { IMAGES, type SiteImage } from "./images";
import { PROBLEMS } from "./services";

/**
 * Campaign landing pages for Google Ads / Meta Ads: /lp/[campaign].
 *
 * One conversion goal per page, minimal navigation, headline matched to the ad.
 * These pages are noindex by default (see page metadata) so they never compete
 * with, or duplicate, the organic pages. To add a campaign, add an entry here -
 * the route, metadata and sitemap exclusion are handled for you.
 */

export type Campaign = {
  slug: string;
  /** Brand page this campaign relates to, for the "full details" link. */
  brandSlug?: Brand["slug"];
  metaTitle: string;
  h1: string;
  sub: string;
  symptomsHeading: string;
  symptoms: BrandSymptom[];
  image: SiteImage;
  faqs: Faq[];
};

function brandCampaign(brandSlug: Brand["slug"], h1: string, sub: string): Campaign {
  const brand = BRANDS.find((b) => b.slug === brandSlug);
  if (!brand) throw new Error(`Unknown brand for campaign: ${brandSlug}`);
  return {
    slug: brandSlug,
    brandSlug,
    metaTitle: `${h1} | RM Electronics`,
    h1,
    sub,
    symptomsHeading: `Common ${brand.name} symptoms`,
    symptoms: brand.symptoms.slice(0, 4),
    image: brand.image,
    faqs: brand.faqs.slice(0, 2),
  };
}

export const CAMPAIGNS: Campaign[] = [
  {
    slug: "tv-repair-nagole",
    metaTitle: "Doorstep TV Repair in Hyderabad | RM Electronics",
    h1: "Doorstep TV Repair in Hyderabad",
    sub: "A technician at your home for LED, LCD and Smart TV problems. Tell RM Electronics the brand, model and what you see, and book a visit.",
    symptomsHeading: "What is your TV doing?",
    symptoms: PROBLEMS.slice(0, 4).map((p) => ({ title: p.title, text: p.text })),
    image: IMAGES.bench,
    faqs: [GENERAL_FAQS[1]!, GENERAL_FAQS[8]!],
  },
  brandCampaign(
    "lg-oled",
    "LG OLED TV Repair at Your Doorstep in Hyderabad",
    "Book a technician visit for your LG OLED. Repairability depends on the fault and model, and a diagnosis is needed to confirm the cause.",
  ),
  brandCampaign(
    "samsung",
    "Samsung TV Repair at Your Doorstep in Hyderabad",
    "Power, picture, sound or Smart TV problem on your Samsung? Describe it and book a doorstep visit.",
  ),
  brandCampaign(
    "sony",
    "Sony TV Repair at Your Doorstep in Hyderabad",
    "Book RM Electronics with your Sony TV model and symptoms. Scope depends on the model, fault and parts availability.",
  ),
  brandCampaign(
    "oneplus",
    "OnePlus TV Repair at Your Doorstep in Hyderabad",
    "Share your OnePlus TV model and issue to discuss repair options. RM Electronics is an independent service, not an official OnePlus centre.",
  ),
  brandCampaign(
    "vu",
    "Vu TV Repair at Your Doorstep in Hyderabad",
    "Tell RM Electronics your Vu TV model and symptoms, book a visit, and ask about parts availability and repair scope.",
  ),
];

export function getCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}
