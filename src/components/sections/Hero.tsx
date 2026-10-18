import Image from "next/image";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { RepairEnquiryForm } from "@/components/forms/RepairEnquiryForm";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IMAGES } from "@/content/images";
import { DOORSTEP } from "@/content/site";

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: "home", text: "Technician comes to your door" },
  { icon: "mapPin", text: "Across Hyderabad" },
  { icon: "clipboard", text: `Visiting charges from ${DOORSTEP.visitingCharge}` },
  { icon: "shield", text: `${DOORSTEP.experience} technician experience` },
];

/**
 * Home hero on the logo's navy gradient. On phones, the photo sits directly below the heading.
 * Desktop: the three-step booking form sits beside the text so booking needs no extra click.
 */
export function Hero() {
  const image = IMAGES.bench;
  return (
    <section aria-labelledby="hero-heading" className="flex min-h-[80vh] items-center bg-brand-gradient">
      <div className="container-page grid items-center gap-6 py-7 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-12">
        <div data-dark>
          <p className="eyebrow mb-2 text-sm font-semibold uppercase tracking-wider">Doorstep service &middot; Hyderabad</p>
          <h1 id="hero-heading" className="heading-1">
            Doorstep TV Repair in Hyderabad
          </h1>
          <div className="mt-4 lg:hidden">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/10] w-full rounded-[1.25rem] border border-white/15 object-cover"
            />
          </div>
          <p className="lead mt-3 max-w-xl">
            RM Electronics sends a technician to your home to check and repair LCD, LED and Smart TVs. Share your TV brand, model and the problem, and book a visit.
          </p>
          <ul className="mt-4 grid max-w-xl gap-2 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h.text} className="flex items-center gap-2.5 text-sm font-medium text-white">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent">
                  <Icon name={h.icon} className="h-5 w-5" />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CallLink placement="hero" asButton variant="primary" size="lg" />
            <WhatsAppLink placement="hero" asButton size="lg" className="w-full sm:w-auto" />
            <BookRepairButton placement="hero" variant="secondary" size="lg" className="lg:hidden" />
          </div>
          <p className="mt-4 text-sm text-lavender-200">An independent TV repair service. Repair outcomes depend on the TV and the fault.</p>
        </div>

        {/* Desktop booking form card. */}
        <div className="hidden rounded-[1.25rem] bg-white p-6 shadow-xl lg:block">
          <h2 className="text-xl font-bold text-brand">Book a doorstep visit</h2>
          <p className="mb-4 mt-1 text-sm text-ink-2">Three quick steps. Your details are used only to reply to this enquiry.</p>
          <RepairEnquiryForm active placement="hero_form" />
        </div>
      </div>
    </section>
  );
}
