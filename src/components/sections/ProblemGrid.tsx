import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PROBLEMS } from "@/content/services";
import { SectionHeading } from "./SectionHeading";

export function ProblemGrid() {
  return (
    <section aria-labelledby="problems-heading" className="section bg-surface">
      <div className="container-page">
        <SectionHeading id="problems-heading" eyebrow="Common TV problems" title="What is your TV doing?">
          These are the symptoms people most often describe. A symptom alone does not prove which part has failed, so a diagnosis is needed to confirm the cause.
        </SectionHeading>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <li key={problem.id} className="card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-surface text-brand">
                <Icon name={problem.icon} className="h-6 w-6" />
              </span>
              <h3 className="heading-3 mt-4">{problem.title}</h3>
              <p className="mt-2 text-ink-2">{problem.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/services" className="text-link">
            See how each type of problem is handled
          </Link>
        </p>
      </div>
    </section>
  );
}
