import Link from "next/link";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { DOORSTEP } from "@/content/site";
import type { Faq } from "@/content/faqs";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "./SectionHeading";

/** Native <details> accordion: works without JavaScript and is keyboard accessible by default. */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  tone = "white",
  headingId = "faq-heading",
}: {
  faqs: Faq[];
  title?: string;
  tone?: "white" | "surface";
  headingId?: string;
}) {
  return (
    <section aria-labelledby={headingId} className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:gap-14">
          <div>
            <SectionHeading title={title} id={headingId}>
              Find answers about doorstep visits, charges, service areas and booking. If your question is not covered, call RM Electronics to discuss the next step.
            </SectionHeading>
            <div className="mt-6 rounded-card border border-line bg-surface p-5 sm:p-6">
              <h3 className="heading-3">Helpful details to have ready</h3>
              <p className="mt-2 text-ink-2">
                Share your TV brand and model, a short description of what it is doing, and your area in Hyderabad. Symptoms can suggest possible issues, but the cause needs to be checked.
              </p>
              <p className="mt-3 font-semibold text-brand">
                Visiting charges start at {DOORSTEP.visitingCharge}; repair cost is discussed after the TV is checked.
              </p>
              <p className="mt-3 text-sm text-ink-2">
                Service areas include {DOORSTEP.areas.join(", ")}. Call to confirm your area.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                <CallLink placement="faq" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link">
                  <Icon name="phone" className="h-5 w-5" />
                  Call Now
                </CallLink>
                <WhatsAppLink placement="faq" className="inline-flex min-h-11 items-center gap-2 font-semibold text-link">
                  WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} name={headingId} className="group rounded-card border border-line bg-white shadow-card">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-left text-base font-semibold text-brand">
                  {faq.q}
                  <Icon name="chevronDown" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="border-t border-line px-5 py-4 text-ink-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div aria-labelledby={`${headingId}-related-title`} className="mt-10 border-t border-line pt-8">
          <h3 id={`${headingId}-related-title`} className="heading-3">
            Explore more TV repair information
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link href="/services" className="group block h-full rounded-card border border-line bg-white p-5 transition-shadow hover:shadow-card">
                <span className="font-semibold text-brand">TV repair services</span>
                <span className="mt-2 block text-ink-2">Read about common picture, sound, power and connectivity symptoms.</span>
                <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-link">
                  Explore services
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/#brands-heading" className="group block h-full rounded-card border border-line bg-white p-5 transition-shadow hover:shadow-card">
                <span className="font-semibold text-brand">TV brand information</span>
                <span className="mt-2 block text-ink-2">See brand-specific details for selected TVs before you enquire.</span>
                <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-link">
                  Browse brands
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="group block h-full rounded-card border border-line bg-white p-5 transition-shadow hover:shadow-card">
                <span className="font-semibold text-brand">Contact and location</span>
                <span className="mt-2 block text-ink-2">Find contact details and the RM Electronics shop location in Nagole.</span>
                <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-link">
                  View contact details
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
