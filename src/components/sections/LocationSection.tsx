import Image from "next/image";
import { CallLink, DirectionsLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { Icon } from "@/components/ui/Icon";
import { IMAGES } from "@/content/images";
import { BUSINESS } from "@/content/site";
import { HoursBlock } from "./HoursBlock";
import { MapEmbed } from "./MapEmbed";
import { SectionHeading } from "./SectionHeading";

export function LocationSection({ tone = "white" }: { tone?: "white" | "surface" }) {
  const sign = IMAGES.sign;
  return (
    <section aria-labelledby="location-heading" className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading id="location-heading" eyebrow="Find us" title="RM Electronics in Nagole">
            Look for the signboard near Vishal Mega Mart. If you are not sure whether your location is convenient, call and ask about service arrangements.
          </SectionHeading>
          <address className="mt-6 space-y-3 not-italic text-ink-2">
            <p className="flex gap-3">
              <Icon name="mapPin" className="mt-1 h-5 w-5 text-brand" />
              <span>{BUSINESS.address.full}</span>
            </p>
            <p className="flex gap-3">
              <Icon name="phone" className="mt-1 h-5 w-5 text-brand" />
              <a href={BUSINESS.phone.href} className="font-semibold text-brand hover:underline">
                {BUSINESS.phone.display}
              </a>
            </p>
          </address>
          <HoursBlock />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <DirectionsLink placement="location" asButton variant="secondary" size="lg" />
            <CallLink placement="location" asButton variant="primary" size="lg" />
            <WhatsAppLink placement="location" asButton size="lg" />
          </div>
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
      <div className="container-page mt-10">
        <MapEmbed />
      </div>
    </section>
  );
}
