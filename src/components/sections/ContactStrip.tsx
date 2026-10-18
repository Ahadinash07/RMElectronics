import { DirectionsLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/content/site";

/** Slim strip of verified contact cues. No opening hours or response-time promises. */
export function ContactStrip() {
  const item = "flex min-h-12 items-center gap-3";
  const columns = BUSINESS.whatsappVerified ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <section aria-label="Contact summary" className="border-y border-line bg-surface">
      <ul className={`container-page grid gap-x-8 gap-y-1 py-3 ${columns}`}>
        <li className={item}>
          <Icon name="phone" className="h-5 w-5 text-brand" />
          <a href={BUSINESS.phone.href} className="font-semibold text-brand hover:underline">
            {BUSINESS.phone.display}
          </a>
        </li>
        <li className={item}>
          <Icon name="home" className="h-5 w-5 text-brand" />
          <span>Doorstep service across Hyderabad</span>
        </li>
        <li className={item}>
          <Icon name="navigation" className="h-5 w-5 text-brand" />
          <DirectionsLink placement="contact_strip" className="text-link">
            Directions to the shop
          </DirectionsLink>
        </li>
        <li className={item}>
          <WhatsAppLink placement="contact_strip" className="text-link inline-flex min-h-11 items-center gap-2">
            WhatsApp
          </WhatsAppLink>
        </li>
      </ul>
    </section>
  );
}
