import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { FaqSection } from "@/components/sections/FaqSection";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { BRANDS, getBrand } from "@/content/brands";
import { CAMPAIGNS, getCampaign, type Campaign } from "@/content/campaigns";
import { BUSINESS, INDEPENDENT_DISCLAIMER } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

type Params = { campaign: string };

export const dynamicParams = false;

function isAvailable(campaign: Campaign): boolean {
  // A brand campaign is only live while its brand page is published.
  return campaign.brandSlug ? Boolean(getBrand(campaign.brandSlug)) : true;
}

export function generateStaticParams(): Params[] {
  return CAMPAIGNS.filter(isAvailable).map((c) => ({ campaign: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { campaign: slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign || !isAvailable(campaign)) return {};
  // Landing pages are noindex so they never compete with, or duplicate, the organic pages.
  return buildMetadata({
    title: campaign.metaTitle,
    description: campaign.sub,
    path: `/lp/${campaign.slug}`,
    noindex: true,
  });
}

export default async function CampaignPage({ params }: { params: Promise<Params> }) {
  const { campaign: slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign || !isAvailable(campaign)) notFound();

  const brand = campaign.brandSlug ? BRANDS.find((b) => b.slug === campaign.brandSlug) : undefined;
  const formBrand = brand?.formBrand;
  const placement = `lp_${campaign.slug}`;

  return (
    <>
      <section aria-labelledby="lp-heading" className="bg-brand-gradient">
        <div className="container-page grid items-center gap-6 py-7 sm:py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-12">
          <div data-dark>
            <p className="eyebrow mb-2 text-sm font-semibold uppercase tracking-wider">Doorstep service &middot; Hyderabad</p>
            <h1 id="lp-heading" className="heading-1">
              {campaign.h1}
            </h1>
            <p className="lead mt-4 max-w-xl">{campaign.sub}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CallLink placement={`${placement}_hero`} asButton variant="primary" size="lg" />
              <BookRepairButton placement={`${placement}_hero`} variant="secondary" size="lg" {...(formBrand ? { brand: formBrand } : {})} />
            </div>
            <div className="mt-3 sm:max-w-xs">
              <WhatsAppLink placement={`${placement}_hero`} asButton size="lg" className="w-full" />
            </div>
            <p className="mt-4 text-sm text-lavender-200">{INDEPENDENT_DISCLAIMER}</p>
          </div>
          <Image
            src={campaign.image.src}
            alt={campaign.image.alt}
            width={campaign.image.width}
            height={campaign.image.height}
            sizes="(min-width: 1024px) 540px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="aspect-[16/10] w-full rounded-[1.25rem] border border-white/15 object-cover"
          />
        </div>
      </section>

      <DoorstepSection tone="white" headingId="lp-doorstep" />
      <section aria-labelledby="lp-symptoms" className="section bg-surface">
        <div className="container-page">
          <SectionHeading id="lp-symptoms" title={campaign.symptomsHeading}>
            These are possible issues, not diagnoses. A check is needed to confirm the cause, and repairability depends on the fault and model.
          </SectionHeading>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {campaign.symptoms.map((s) => (
              <li key={s.title} className="card">
                <h3 className="heading-3">{s.title}</h3>
                <p className="mt-2 text-ink-2">{s.text}</p>
              </li>
            ))}
          </ul>
          {brand ? (
            <p className="mt-6">
              <Link href={`/tv-repair/${brand.slug}`} className="text-link inline-flex min-h-11 items-center gap-1.5">
                More about {brand.name} TV repair enquiries
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      <ProcessSteps />
      <GallerySection tone="white" count={3} showAllLink={false} title="Our workshop" intro="Real photographs of the RM Electronics workshop in Nagole." headingId="lp-gallery" />
      <FaqSection faqs={campaign.faqs} tone="surface" headingId="lp-faq" />
      <FinalCta
        title="Book a TV technician at your door"
        text={`Call ${BUSINESS.name} or book a doorstep visit with your TV brand, model and the problem you are seeing.`}
        placement={`${placement}_cta`}
        {...(formBrand ? { brand: formBrand } : {})}
      />
    </>
  );
}
