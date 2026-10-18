import Image from "next/image";
import { CallLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { BrandGrid } from "@/components/sections/BrandGrid";
import { FaqSection } from "@/components/sections/FaqSection";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { SERVICES_FAQS } from "@/content/faqs";
import { IMAGES } from "@/content/images";
import { SERVICE_CATEGORIES } from "@/content/services";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Doorstep TV Repair Services in Hyderabad | RM Electronics",
  description:
    "Explore common TV faults and book a doorstep visit from RM Electronics with your TV brand, model and symptoms.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        title="Doorstep TV repair services in Hyderabad"
        image={IMAGES.board}
        actions={
          <>
            <BookRepairButton placement="services_hero" size="lg" />
            <CallLink placement="services_hero" asButton variant="secondary" size="lg" />
          </>
        }
      >
        <p>
          A technician visits your home for power, picture, sound and Smart TV problems. The right solution depends on the TV model and the cause of the fault. Find your symptom below, then book a visit.
        </p>
      </PageHero>

      <DoorstepSection tone="white" />
      <section aria-labelledby="categories-heading" className="section bg-surface">
        <div className="container-page">
          <SectionHeading id="categories-heading" eyebrow="Service categories" title="Find your TV problem">
            Each category explains what is usually reported, what an inspection may look at, and what to have ready. None of this replaces a proper diagnosis.
          </SectionHeading>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {SERVICE_CATEGORIES.map((service) => (
              <article key={service.id} id={service.id} className="card scroll-mt-24">
                <Image
                  src={service.image.src}
                  alt=""
                  width={service.image.width}
                  height={service.image.height}
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="mb-5 aspect-[16/9] w-full rounded-control object-cover"
                />
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-surface text-brand">
                    <Icon name={service.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="heading-3">{service.title}</h3>
                </div>
                <p className="mt-3 text-ink-2">{service.summary}</p>

                <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand">What people report</h4>
                <ul className="mt-2 space-y-1.5 text-ink-2">
                  {service.symptoms.map((s) => (
                    <li key={s} className="flex gap-2.5">
                      <Icon name="check" className="mt-1 h-4 w-4 text-brand" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand">What may be checked</h4>
                <p className="mt-1 text-ink-2">{service.mayBeChecked}</p>

                <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand">What to share</h4>
                <p className="mt-1 text-ink-2">{service.share}</p>

                <p className="mt-4 flex gap-2.5 rounded-control bg-surface p-3 text-sm text-ink-2">
                  <Icon name="info" className="mt-0.5 h-5 w-5 text-brand" />
                  <span>{service.caveat}</span>
                </p>

                <div className="mt-5">
                  <BookRepairButton placement={`service_${service.id}`} variant="secondary">
                    Book a visit for this
                  </BookRepairButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="examples-heading" className="section">
        <div className="container-page">
          <SectionHeading id="examples-heading" eyebrow="Display symptoms" title="Examples of display faults">
            Two photographs showing what display symptoms can look like. They are examples only: similar-looking faults can have different causes and different fixes, and none of this shows a customer result.
          </SectionHeading>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {[IMAGES.exampleLines, IMAGES.exampleDistorted].map((image) => (
              <li key={image.src}>
                <figure>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="aspect-[16/10] w-full rounded-card border border-line object-cover"
                  />
                  <figcaption className="mt-2 text-sm text-ink-2">{image.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GallerySection tone="white" count={6} title="The workshop behind the services" />
      <BrandGrid tone="surface" />
      <FaqSection faqs={SERVICES_FAQS} headingId="services-faq" tone="surface" />
      <FinalCta />
    </>
  );
}
