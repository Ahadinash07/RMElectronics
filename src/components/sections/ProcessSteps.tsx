import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    title: "Book your doorstep visit",
    text: "Call or use the booking form with your TV brand, model, problem and area in Hyderabad.",
  },
  {
    title: "Technician visits your home",
    text: "Visiting charges start at \u20b9199. The technician checks the TV where it is.",
  },
  {
    title: "Diagnosis and estimate",
    text: "Once the fault is identified, you can ask about the repair estimate and what it covers before deciding.",
  },
  {
    title: "Repair, or workshop if needed",
    text: "Repairs that can be done at home are done there. If the TV needs workshop work, the team explains the options.",
  },
];

export function ProcessSteps({ tone = "white" }: { tone?: "white" | "surface" }) {
  return (
    <section aria-labelledby="process-heading" className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page">
        <SectionHeading id="process-heading" eyebrow="How it works" title="How doorstep repair works" />
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-base font-bold text-white"
              >
                {index + 1}
              </span>
              <h3 className="heading-3 mt-4">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-ink-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
