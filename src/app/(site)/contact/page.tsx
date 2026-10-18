import Image from "next/image";
import { DirectionsLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { RepairEnquiryForm } from "@/components/forms/RepairEnquiryForm";
import { HoursBlock } from "@/components/sections/HoursBlock";
import { JsonLd } from "@/components/sections/JsonLd";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { IMAGES } from "@/content/images";
import { BUSINESS, SPARE_PARTS_PHONE } from "@/content/site";
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact RM Electronics | Doorstep TV Repair, Hyderabad",
  description: "Call, email or book a doorstep TV repair visit with RM Electronics in Hyderabad. Workshop and shop in Nagole.",
  path: "/contact",
});

export default function ContactPage() {
  const sign = IMAGES.sign;
  const row = "flex gap-3.5";
  const iconWrap = "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface text-brand";

  return (
    <>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        ]}
      />
      <PageHero breadcrumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]} title="Contact RM Electronics: book a doorstep visit">
        <p>
          Have a TV issue? Call RM Electronics or book a doorstep technician visit anywhere in Hyderabad. The shop and workshop are in Nagole.
        </p>
      </PageHero>

      <section aria-label="Contact details and enquiry" className="section bg-surface">
        <div className="container-page grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="card space-y-6">
            <h2 className="heading-2">Get in touch</h2>
            <ul className="space-y-5">
              <li className={row}>
                <span className={iconWrap}>
                  <Icon name="phone" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted">Phone</p>
                  <a href={BUSINESS.phone.href} className="inline-flex min-h-11 items-center text-xl font-bold text-brand hover:underline">
                    {BUSINESS.phone.display}
                  </a>
                </div>
              </li>
              <li className={row}>
                <span className={iconWrap}>
                  <Icon name="wrench" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted">{SPARE_PARTS_PHONE.label}</p>
                  <a href={SPARE_PARTS_PHONE.href} className="inline-flex min-h-11 items-center text-lg font-bold text-brand hover:underline">
                    {SPARE_PARTS_PHONE.display}
                  </a>
                </div>
              </li>
              <li className={row}>
                <span className={iconWrap}>
                  <Icon name="mail" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted">Email</p>
                  <a href={`mailto:${BUSINESS.email}`} className="inline-flex min-h-11 items-center break-all font-semibold text-brand hover:underline">
                    {BUSINESS.email}
                  </a>
                </div>
              </li>
              <li className={row}>
                <span className={iconWrap}>
                  <Icon name="mapPin" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted">Address</p>
                  <address className="not-italic text-ink">{BUSINESS.address.full}</address>
                  <DirectionsLink placement="contact_page" className="text-link mt-1 inline-flex min-h-11 items-center gap-2">
                    <Icon name="navigation" className="h-4 w-4" />
                    Get directions on Google Maps
                  </DirectionsLink>
                </div>
              </li>
            </ul>
            <HoursBlock />
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">Follow RM Electronics</h3>
              <ul className="mt-2 flex flex-wrap gap-x-6">
                <li>
                  <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" className="text-link inline-flex min-h-11 items-center gap-2">
                    <Icon name="facebook" className="h-5 w-5" />
                    Facebook<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className="text-link inline-flex min-h-11 items-center gap-2">
                    <Icon name="instagram" className="h-5 w-5" />
                    Instagram<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="heading-2">Book a doorstep visit</h2>
            <p className="mt-2 text-ink-2">Three quick steps. Your details are used only to reply to this enquiry.</p>

            {/* Phones: the form opens as a bottom sheet instead of taking over the page. */}
            <div className="mt-5 md:hidden">
              <BookRepairButton placement="contact_page" size="lg" className="w-full" />
            </div>
            {/* Larger screens: inline form. */}
            <div className="mt-6 hidden md:block">
              <RepairEnquiryForm active placement="contact_page_inline" />
            </div>
          </div>
        </div>
      </section>

      <DoorstepSection tone="white" />
      <section aria-labelledby="map-heading" className="section bg-surface">
        <div className="container-page">
          <SectionHeading id="map-heading" eyebrow="Find us" title="Map and directions">
            {BUSINESS.address.full}
          </SectionHeading>
          <div className="mt-6">
            <MapEmbed />
          </div>
        </div>
      </section>

      <section aria-labelledby="recognise-heading" className="section">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 id="recognise-heading" className="heading-2">
              Recognising the shop
            </h2>
            <p className="lead mt-3">
              RM Electronics is on Road No. 2 in Shrungeri Colony, Nagole, near Vishal Mega Mart. Look for this signboard.
            </p>
          </div>
          <figure>
            <Image
              src={sign.src}
              alt={sign.alt}
              width={sign.width}
              height={sign.height}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="w-full rounded-card border border-line"
            />
            <figcaption className="mt-2 text-sm text-ink-2">{sign.caption}</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
