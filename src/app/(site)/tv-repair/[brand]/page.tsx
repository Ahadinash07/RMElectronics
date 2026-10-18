import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { GallerySection } from "@/components/sections/GallerySection";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { BRANDS, PUBLISHED_BRANDS, getBrand } from "@/content/brands";
import { INDEPENDENT_DISCLAIMER } from "@/content/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Params = { brand: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PUBLISHED_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return buildMetadata({
    title: brand.metaTitle,
    description: brand.metaDescription,
    path: `/tv-repair/${brand.slug}`,
  });
}

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const path = `/tv-repair/${brand.slug}`;
  const related = brand.related
    .map((s) => BRANDS.find((b) => b.slug === s))
    .filter((b): b is (typeof BRANDS)[number] => Boolean(b?.published));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: `${brand.name} TV repair`, path },
        ])}
      />
      <PageHero
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: `${brand.name} TV repair` }]}
        title={brand.h1}
        image={brand.image}
        actions={
          <>
            <CallLink placement={`brand_${brand.slug}_hero`} asButton variant="primary" size="lg" />
            <BookRepairButton placement={`brand_${brand.slug}_hero`} brand={brand.formBrand} variant="secondary" size="lg" />
          </>
        }
      >
        <p>{brand.intro}</p>
      </PageHero>

      <section aria-label="Scope and independence" className="border-b border-line bg-surface">
        <div className="container-page py-5">
          <p className="flex gap-3 text-ink-2">
            <Icon name="info" className="mt-0.5 h-5 w-5 text-brand" />
            <span>
              {brand.caveat} {INDEPENDENT_DISCLAIMER}
            </span>
          </p>
        </div>
      </section>

      <section aria-labelledby="angle-heading" className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <SectionHeading id="angle-heading" title={brand.angle.heading} />
          <div className="space-y-4 text-ink-2">
            {brand.angle.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="symptoms-heading" className="section bg-surface">
        <div className="container-page">
          <SectionHeading id="symptoms-heading" title={brand.symptomsHeading}>
            Described as possible issues, not diagnoses. What is actually wrong can only be confirmed by checking the TV.
          </SectionHeading>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.symptoms.map((s) => (
              <li key={s.title} className="card">
                <h3 className="heading-3">{s.title}</h3>
                <p className="mt-2 text-ink-2">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="enquire-heading" className="section">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading id="enquire-heading" title="What to share when you book" />
            <h3 className="heading-3 mt-6">{brand.modelHelp.heading}</h3>
            <p className="mt-2 text-ink-2">{brand.modelHelp.text}</p>
          </div>
          <div className="card">
            <h3 className="heading-3">Helpful details to share</h3>
            <ul className="mt-3 space-y-2.5 text-ink-2">
              {brand.share.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Icon name="check" className="mt-1 h-4 w-4 text-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <BookRepairButton placement={`brand_${brand.slug}_details`} brand={brand.formBrand} />
              <CallLink placement={`brand_${brand.slug}_details`} asButton variant="secondary" />
            </div>
          </div>
        </div>
      </section>

      <GallerySection
        tone="white"
        count={3}
        title="Where TVs are checked"
        intro="Photos of the RM Electronics workshop in Nagole. They show the workshop, not your TV model."
        headingId="brand-gallery"
      />
      <DoorstepSection tone="white" />
      <FaqSection faqs={brand.faqs} title={`${brand.name} questions`} tone="surface" headingId="brand-faq" />

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="section">
          <div className="container-page">
            <h2 id="related-heading" className="heading-3">
              Other enquiry pages
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
              {related.map((b) => (
                <li key={b.slug}>
                  <Link href={`/tv-repair/${b.slug}`} className="text-link inline-flex min-h-11 items-center">
                    {b.name} TV repair enquiry
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-link inline-flex min-h-11 items-center">
                  All repair services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-link inline-flex min-h-11 items-center">
                  Contact and directions
                </Link>
              </li>
            </ul>
          </div>
        </section>
      ) : null}

      <FinalCta title={`Need a ${brand.name} TV technician at your door?`} brand={brand.formBrand} placement={`brand_${brand.slug}_cta`} />
    </>
  );
}
