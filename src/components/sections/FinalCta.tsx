import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";

export function FinalCta({
  title = "Need a TV technician at your door in Hyderabad?",
  text = "Call RM Electronics or book a doorstep visit with your TV brand, model and the problem you are seeing.",
  brand,
  placement = "final_cta",
}: {
  title?: string;
  text?: string;
  brand?: string;
  placement?: string;
}) {
  return (
    <section data-dark aria-labelledby="final-cta-heading" className="bg-brand-gradient">
      <div className="container-page py-9 text-center sm:py-12">
        <h2 id="final-cta-heading" className="heading-2">
          {title}
        </h2>
        <p className="lead mx-auto mt-3 max-w-xl">{text}</p>
        <div className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <CallLink placement={placement} asButton variant="primary" size="lg" />
          <BookRepairButton placement={placement} variant="secondary" size="lg" {...(brand ? { brand } : {})}>
            Book Doorstep Repair
          </BookRepairButton>
          <WhatsAppLink placement={placement} asButton size="lg" />
        </div>
      </div>
    </section>
  );
}
