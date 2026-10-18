import type { Metadata } from "next";
import Link from "next/link";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonClasses } from "@/components/ui/button-styles";

export const metadata: Metadata = {
  title: { absolute: "Page not found | RM Electronics" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="section">
          <div className="container-page max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-link">Error 404</p>
            <h1 className="heading-1 mt-2">We could not find that page</h1>
            <p className="lead mt-4">The link may be old or mistyped. These pages should help.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className={buttonClasses("primary", "lg")}>
                Go to Home
              </Link>
              <Link href="/services" className={buttonClasses("secondary", "lg")}>
                View services
              </Link>
              <Link href="/contact" className={buttonClasses("secondary", "lg")}>
                Contact us
              </Link>
            </div>
            <p className="mt-6">
              <CallLink placement="not_found" className="text-link font-semibold" />
              <WhatsAppLink placement="not_found" className="ml-4 text-link font-semibold" />
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
