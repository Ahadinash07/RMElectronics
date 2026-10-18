import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CallLink } from "@/components/analytics/ContactLinks";
import { LeadConversion } from "@/components/analytics/LeadConversion";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { BUSINESS } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Enquiry received | RM Electronics",
  description: "Your repair enquiry has been received by RM Electronics.",
  path: "/thank-you",
  noindex: true,
});

const REFERENCE_PATTERN = /^[0-9A-F]{8}$/;

export default async function ThankYouPage() {
  const store = await cookies();
  const reference = store.get("rm_lead_ref")?.value ?? "";

  // Only show this page after the server has accepted an enquiry (it sets this cookie).
  if (!REFERENCE_PATTERN.test(reference)) redirect("/contact");

  return (
    <section aria-labelledby="thanks-heading" className="section">
      <div className="container-page max-w-2xl text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7] text-success">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h1 id="thanks-heading" className="heading-1 mt-6">
          Thanks — your enquiry has been received.
        </h1>
        <p className="lead mt-4">
          Your repair enquiry has been submitted successfully. If you would prefer to speak directly, call RM Electronics at {BUSINESS.phone.display}.
        </p>
        <p className="mt-3 text-sm text-muted">
          Reference: <span className="font-mono font-semibold text-ink">{reference}</span>
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CallLink placement="thank_you" asButton variant="primary" size="lg">
            <Icon name="phone" />
            <span>Call RM Electronics</span>
          </CallLink>
          <Link href="/" className={buttonClasses("secondary", "lg")}>
            Return to Home
          </Link>
        </div>
      </div>
      <LeadConversion reference={reference} />
    </section>
  );
}
