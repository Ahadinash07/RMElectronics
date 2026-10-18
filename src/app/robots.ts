import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * /api is blocked. /thank-you and /lp/* are NOT blocked here on purpose: they carry a
 * noindex meta tag, and crawlers can only obey it if they are allowed to fetch the page.
 * CSS, JS and images stay crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
