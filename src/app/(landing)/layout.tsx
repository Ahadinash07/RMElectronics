import Link from "next/link";
import { CallLink } from "@/components/analytics/ContactLinks";
import { Logo } from "@/components/ui/Logo";
import { BUSINESS, DOORSTEP, INDEPENDENT_DISCLAIMER } from "@/content/site";

/**
 * Minimal layout for paid-traffic landing pages: business identity, a call button,
 * and a footer with address, privacy link and the independent-service disclaimer.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header data-dark className="sticky top-0 z-30 border-b border-white/10 bg-brand-gradient">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Logo />
          <CallLink placement="lp_header" asButton variant="secondary" />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <footer data-dark className="bg-brand-gradient">
        <div className="container-page space-y-1.5 py-6 text-sm text-lavender-200">
          <p className="font-semibold text-white">{BUSINESS.name}</p>
          <p>{DOORSTEP.headline}. Base: {BUSINESS.address.full}</p>
          <p>{INDEPENDENT_DISCLAIMER}</p>
          <p>
            <Link href="/privacy-policy" className="text-link inline-flex min-h-11 items-center">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
