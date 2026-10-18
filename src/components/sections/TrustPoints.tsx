import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "./SectionHeading";

/** Only statements that can be checked against the signboard, the photos and this website itself. */
const POINTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "home",
    title: "We come to you",
    text: "Doorstep service across Hyderabad, so you do not have to move your TV.",
  },
  {
    icon: "store",
    title: "A real workshop in Nagole",
    text: "Based near Vishal Mega Mart in Shrungeri Colony. The signboard and workshop photos on this site are the business's own.",
  },
  {
    icon: "clipboard",
    title: "Honest about repairability",
    text: "No promise that every fault can be repaired. A diagnosis comes first, and costs depend on the fault, model and parts.",
  },
  {
    icon: "phone",
    title: "Easy to reach directly",
    text: "Call or email without filling in a form first, or book a visit online if you prefer.",
  },
];

export function TrustPoints({ tone = "surface" }: { tone?: "white" | "surface" }) {
  return (
    <section aria-labelledby="trust-heading" className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page">
        <SectionHeading id="trust-heading" eyebrow="Why contact us" title="What you can rely on" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <li key={p.title} className="card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-surface text-brand">
                <Icon name={p.icon} className="h-6 w-6" />
              </span>
              <h3 className="heading-3 mt-4">{p.title}</h3>
              <p className="mt-2 text-ink-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
