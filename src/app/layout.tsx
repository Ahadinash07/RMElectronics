import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { EnquiryProvider } from "@/components/forms/EnquiryProvider";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { BUSINESS, SITE_URL } from "@/content/site";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

// Inter via next/font: self-hosted at build time, only the weights we use.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TV Repair in Nagole, Hyderabad | RM Electronics",
    template: "%s",
  },
  description:
    "Contact RM Electronics for LCD, LED and Smart TV repair enquiries in Nagole, Hyderabad. Call with your TV brand, model and issue.",
  applicationName: BUSINESS.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: BUSINESS.name,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-control focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand focus:shadow-card"
        >
          Skip to main content
        </a>
        <EnquiryProvider>
          {children}
          <MobileActionBar />
        </EnquiryProvider>
        <ConsentBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
