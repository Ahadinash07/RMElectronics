import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SERVICE_CATEGORIES } from "@/content/services";
import { SectionHeading } from "./SectionHeading";

export function ServiceGrid() {
  return (
    <section aria-labelledby="services-heading" className="section">
      <div className="container-page">
        <SectionHeading id="services-heading" eyebrow="Services" title="TV repair support for common faults">
          From power and picture problems to sound or Smart TV connectivity issues, the right solution depends on the TV model and the cause of the fault. Share the symptoms with RM Electronics so the next step can be discussed.
        </SectionHeading>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.slice(0, 6).map((service) => (
            <li key={service.id} className="card flex flex-col">
              <Image
                src={service.image.src}
                alt=""
                width={service.image.width}
                height={service.image.height}
                sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                className="mb-4 aspect-[16/9] w-full rounded-control object-cover"
              />
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-surface text-brand">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h3 className="heading-3 mt-4">{service.title}</h3>
              <p className="mt-2 flex-1 text-ink-2">{service.summary}</p>
              <Link href={`/services#${service.id}`} className="text-link mt-4 inline-flex min-h-11 items-center gap-1.5">
                Learn more<span className="sr-only"> about {service.title}</span>
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
