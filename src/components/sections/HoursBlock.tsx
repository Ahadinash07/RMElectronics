import { BUSINESS } from "@/content/site";

/** Renders nothing until the owner provides real opening hours in src/content/site.ts. */
export function HoursBlock() {
  if (!BUSINESS.hours || BUSINESS.hours.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="heading-3">Opening hours</h3>
      <dl className="mt-2 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-2">
        {BUSINESS.hours.map((h) => (
          <div key={h.days} className="contents">
            <dt className="font-medium text-ink">{h.days}</dt>
            <dd>{h.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
