import { BrandGrid } from "@/components/sections/BrandGrid";
import { DoorstepSection } from "@/components/sections/DoorstepSection";
import { ContactStrip } from "@/components/sections/ContactStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/sections/JsonLd";
import { LocationSection } from "@/components/sections/LocationSection";
import { ProblemGrid } from "@/components/sections/ProblemGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { TrustPoints } from "@/components/sections/TrustPoints";
import { GallerySection } from "@/components/sections/GallerySection";
import { GENERAL_FAQS } from "@/content/faqs";
import { BUSINESS } from "@/content/site";
import { buildMetadata, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Doorstep TV Repair in Hyderabad | RM Electronics",
  description:
    `RM Electronics sends a technician to your home for LCD, LED and Smart TV repair across Hyderabad. Visiting charges from \u20b9199. Call ${BUSINESS.phone.display}.`,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      <Hero />
      <ContactStrip />
      <DoorstepSection tone="white" />
      <ProblemGrid />
      <ServiceGrid />
      <BrandGrid tone="surface" />
      <ProcessSteps />
      <GallerySection tone="surface" count={6} />
      <TrustPoints tone="surface" />
      <LocationSection tone="white" />
      <FaqSection faqs={GENERAL_FAQS} />
      <FinalCta />
    </>
  );
}
