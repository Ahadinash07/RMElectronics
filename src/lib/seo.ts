import type { Metadata } from "next";
import { BUSINESS, SITE_URL } from "@/content/site";

export const DEFAULT_OG_IMAGE = {
  url: "/images/rm-electronics-og.png",
  width: 1200,
  height: 630,
  alt: "RM Electronics - TV service and repair, Nagole, Hyderabad",
};

type MetaInput = {
  /** Full <title>. Written out per page; the root layout does not append a suffix. */
  title: string;
  description: string;
  /** Path starting with "/" - used for the canonical URL. */
  path: string;
  noindex?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
};

export function buildMetadata({ title, description, path, noindex = false, image = DEFAULT_OG_IMAGE }: MetaInput): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: BUSINESS.name,
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** LocalBusiness data limited to verified facts. No hours, ratings, prices, coordinates or service area. */
export function localBusinessJsonLd() {
  const hours = BUSINESS.hours;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.phone.e164,
    email: BUSINESS.email,
    image: absoluteUrl("/images/rm-electronics-workshop-bench-nagole.webp"),
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: { "@type": "City", name: "Hyderabad" },
    sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
    ...(hours
      ? {
          openingHours: hours.map((h) => h.schema),
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS.name,
    url: SITE_URL,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
