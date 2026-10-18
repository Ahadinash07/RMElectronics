import type { MetadataRoute } from "next";
import { PUBLISHED_BRANDS } from "@/content/brands";
import { SITE_URL } from "@/content/site";

/**
 * Only canonical, indexable, useful pages. /thank-you, /api and /lp/* are left out.
 * lastModified is intentionally omitted rather than invented.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/services",
    "/gallery",
    "/contact",
    ...PUBLISHED_BRANDS.map((b) => `/tv-repair/${b.slug}`),
    "/privacy-policy",
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
