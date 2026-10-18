import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PUBLISHED_BRANDS } from "@/content/brands";
import { SectionHeading } from "./SectionHeading";

export function BrandGrid({ tone = "surface" }: { tone?: "white" | "surface" }) {
  return (
    <section aria-labelledby="brands-heading" className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page">
        <SectionHeading id="brands-heading" eyebrow="TV brands" title="Brands you can ask about">
          Choose your TV brand to see the symptoms people report and what to share when you enquire. These are enquiry pages for an independent repair service, not manufacturer service centres.
        </SectionHeading>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLISHED_BRANDS.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/tv-repair/${brand.slug}`}
                className="card group flex h-full flex-col transition-shadow hover:shadow-lg"
              >
                <Image
                  src={brand.image.src}
                  alt=""
                  width={brand.image.width}
                  height={brand.image.height}
                  sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                  className="mb-4 aspect-[16/9] w-full rounded-control object-cover"
                />
                <span className="text-xl font-bold text-brand">{brand.name}</span>
                <span className="mt-2 flex-1 text-ink-2">{brand.cardText}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-link">
                  {brand.name} repair enquiry
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-ink-2">
          The shop signboard also lists Panasonic and Micromax. Call to ask about those or any other brand.
        </p>
      </div>
    </section>
  );
}
