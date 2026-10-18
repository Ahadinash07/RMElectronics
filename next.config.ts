import type { NextConfig } from "next";

/**
 * Brand pages live at /tv-repair/[brand] (per the master specification).
 * These redirects keep the shorter /services/<brand> URLs working too,
 * so no link or ad URL using that pattern ends in a 404.
 */
const brandSlugs = ["lg-oled", "samsung", "sony", "oneplus", "vu"] as const;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return brandSlugs.map((slug) => ({
      source: `/services/${slug}`,
      destination: `/tv-repair/${slug}`,
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
