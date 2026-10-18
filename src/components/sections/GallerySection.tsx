import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GALLERY, type GalleryItem } from "@/content/images";
import { GalleryGrid } from "./GalleryGrid";
import { SectionHeading } from "./SectionHeading";

/** A heading plus a preview grid of real workshop photos, linking to the full gallery. */
export function GallerySection({
  items,
  count = 6,
  title = "Inside the RM Electronics workshop",
  intro = "Real photographs of the workshop and shop in Nagole. Tap any photo to see it larger.",
  tone = "white",
  showAllLink = true,
  headingId = "gallery-heading",
}: {
  items?: GalleryItem[];
  count?: number;
  title?: string;
  intro?: string;
  tone?: "white" | "surface";
  showAllLink?: boolean;
  headingId?: string;
}) {
  const list = (items ?? GALLERY.filter((g) => g.category === "workshop")).slice(0, count);
  return (
    <section aria-labelledby={headingId} className={`section ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-page">
        <SectionHeading id={headingId} eyebrow="Gallery" title={title}>
          {intro}
        </SectionHeading>
        <div className="mt-6">
          <GalleryGrid items={list} />
        </div>
        {showAllLink ? (
          <p className="mt-6">
            <Link href="/gallery" className="text-link inline-flex min-h-11 items-center gap-1.5">
              View the full gallery and videos
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
