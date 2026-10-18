import { CallLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TrustPoints } from "@/components/sections/TrustPoints";
import { GallerySection } from "@/components/sections/GallerySection";
import { IMAGES } from "@/content/images";
import { INDEPENDENT_DISCLAIMER } from "@/content/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About RM Electronics | Doorstep TV Repair in Hyderabad",
  description:
    "Learn about RM Electronics, a doorstep LCD, LED and Smart TV repair service across Hyderabad with its workshop in Nagole.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
        title="About RM Electronics"
        image={IMAGES.floor}
        actions={
          <>
            <CallLink placement="about_hero" asButton variant="primary" size="lg" />
            <BookRepairButton placement="about_hero" variant="secondary" size="lg" />
          </>
        }
      >
        <p>
          RM Electronics is a doorstep TV repair service across Hyderabad, with its workshop in Nagole. Technicians with 20+ years of industry experience, as stated by the business, visit homes to check and repair LCD, LED and Smart TVs. Customers can book with their TV brand, model and symptoms.
        </p>
      </PageHero>

      <DoorstepSection tone="surface" />
      {/* <section aria-labelledby="what-we-do" className="section">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-14">
          <SectionHeading id="what-we-do" eyebrow="Local TV repair support" title="What RM Electronics does" />
          <div className="space-y-4 text-ink-2">
            <p>
              The shop signboard describes RM Electronics as an LCD, LED and Smart TV repair and service business. It lists Sony, LG, Samsung, Panasonic, Micromax and One+ TV among the brands.
            </p>
            <p>
              Whether a particular model or fault can be handled, and whether parts can be sourced, is confirmed during an enquiry rather than assumed in advance.
            </p>
            <p>{INDEPENDENT_DISCLAIMER}</p>
          </div>
        </div>
      </section> */}

      <GallerySection title="The workshop" count={6} tone="white" />
      <ProcessSteps tone="surface" />
      <TrustPoints tone="white" />
      <FinalCta />
    </>
  );
}
