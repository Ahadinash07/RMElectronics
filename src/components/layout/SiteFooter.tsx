import Link from "next/link";
import { DirectionsLink } from "@/components/analytics/ContactLinks";
import { Icon } from "@/components/ui/Icon";
import { FullLogo } from "@/components/ui/Logo";
import { PUBLISHED_BRANDS } from "@/content/brands";
import { BUSINESS, DOORSTEP, INDEPENDENT_DISCLAIMER, NAV_LINKS } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const linkClass = "inline-flex min-h-11 items-center text-lavender-200 hover:text-white hover:underline";
  const social = "inline-flex h-12 w-12 items-center justify-center rounded-control border border-white/20 text-white hover:bg-white/10";

  return (
    <footer data-dark className="bg-brand-gradient">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="RM Electronics, home">
            <FullLogo className="h-auto w-44" />
          </Link>
          <p className="mt-3 text-sm text-lavender-200">{BUSINESS.description}</p>
          <ul className="mt-4 flex gap-3">
            <li>
              <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" className={social}>
                <Icon name="facebook" className="h-6 w-6" />
                <span className="sr-only">RM Electronics on Facebook (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className={social}>
                <Icon name="instagram" className="h-6 w-6" />
                <span className="sr-only">RM Electronics on Instagram (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Quick links</h2>
          <ul className="mt-2">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="TV brands">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Doorstep repair by brand</h2>
          <ul className="mt-2">
            {PUBLISHED_BRANDS.map((brand) => (
              <li key={brand.slug}>
                <Link href={`/tv-repair/${brand.slug}`} className={linkClass}>
                  {brand.name} TV repair
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h2>
          <address className="mt-2 space-y-1 text-sm not-italic text-lavender-200">
            <p className="flex gap-2.5 pb-1">
              <Icon name="mapPin" className="mt-0.5 h-5 w-5 text-accent" />
              <span>{BUSINESS.address.full}</span>
            </p>
            <p>
              <a href={BUSINESS.phone.href} className="inline-flex min-h-11 items-center gap-2.5 font-semibold text-white hover:underline">
                <Icon name="phone" className="h-5 w-5 text-accent" />
                {BUSINESS.phone.display}
              </a>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex min-h-11 items-center gap-2.5 break-all text-lavender-200 hover:text-white hover:underline">
                <Icon name="mail" className="h-5 w-5 text-accent" />
                {BUSINESS.email}
              </a>
            </p>
            <p>
              <DirectionsLink placement="footer" className="text-link inline-flex min-h-11 items-center gap-2">
                <Icon name="navigation" className="h-5 w-5" />
                Get directions to the shop
              </DirectionsLink>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page space-y-1.5 py-5 text-sm text-lavender-200">
          {/* <p>
            <strong className="font-semibold text-white">{DOORSTEP.headline}.</strong> {DOORSTEP.areasNote}
          </p> */}
          {/* <p>{INDEPENDENT_DISCLAIMER}</p> */}
          <p>
            &copy; {year} {BUSINESS.name}, Nagole, Hyderabad.
          </p>
        </div>
      </div>
    </footer>
  );
}
