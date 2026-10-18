import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { DOORSTEP } from "@/content/site";
import { SectionHeading } from "./SectionHeading";

const POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "home", title: "A technician at your home", text: "No need to carry a heavy TV. The technician visits you and checks the TV where it is." },
  { icon: "clipboard", title: `Visiting charges from ${DOORSTEP.visitingCharge}`, text: "Repair cost depends on the TV and the fault, and is discussed after diagnosis." },
  { icon: "shield", title: `${DOORSTEP.experience} of experience`, text: "Technicians with 20+ years of industry experience, as stated by the business." },
  { icon: "tv", title: "LED, LCD and Smart TVs", text: "Power, picture, backlight, sound and Smart TV problems across popular brands." },
  { icon: "info", title: "What to share when booking", text: "Your TV brand, model if available, what it is doing, and your area help the team discuss the next step." },
  { icon: "store", title: "Workshop option in Nagole", text: "If a fault cannot be handled at home, the team explains the options, including taking the TV to the workshop in Nagole." },
];

/** Doorstep service explainer with the areas visited. Used on the main pages so the service is clear everywhere. */
export function DoorstepSection({ tone = "surface", headingId = "doorstep-heading" }: { tone?: "white" | "surface"; headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page grid items-start gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div>
          <SectionHeading id={headingId} eyebrow="Doorstep service" title="Doorstep TV repair in Hyderabad">
            RM Electronics brings TV repair to your door. Book a visit, and a technician checks your TV at home. If a fault cannot be fixed at home, the team explains the options, including taking the TV to the workshop.
          </SectionHeading>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-brand">Areas we visit</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {DOORSTEP.areas.map((area) => (
              <li key={area} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-brand">
                <Icon name="mapPin" className="h-4 w-4 text-info" />
                {area}
              </li>
            ))}
            <li className="inline-flex items-center rounded-full bg-lavender-100 px-3 py-1.5 text-sm font-medium text-brand">and other areas of Hyderabad</li>
          </ul>
          <p className="mt-2 text-sm text-ink-2">Not sure about your area? Call and ask.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <BookRepairButton placement="doorstep_section" size="lg" />
            <CallLink placement="doorstep_section" asButton variant="secondary" size="lg" />
            <WhatsAppLink placement="doorstep_section" asButton size="lg" />
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {POINTS.map((p) => (
            <li key={p.title} className="card !p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-control bg-lavender-100 text-brand">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <h3 className="heading-3 mt-3 !text-base">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
