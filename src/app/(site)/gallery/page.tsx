import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { FinalCta } from "@/components/sections/FinalCta";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { VideoCard } from "@/components/sections/VideoCard";
import { GALLERY, IMAGES, VIDEOS } from "@/content/images";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gallery | RM Electronics Workshop in Nagole",
  description:
    "Photos and short videos of the RM Electronics workshop and shop in Nagole, Hyderabad, plus examples of common TV display faults.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
      <PageHero
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Gallery" }]}
        title="Gallery: the RM Electronics workshop"
        image={IMAGES.bench}
        actions={
          <>
            <BookRepairButton placement="gallery_hero" size="lg" />
            <CallLink placement="gallery_hero" asButton variant="secondary" size="lg" />
            <WhatsAppLink placement="gallery_hero" asButton size="lg" />
          </>
        }
      >
        <p>
          A look at the workshop, the shop and what common TV display faults can look like. These are real photographs; captions describe what is shown and none of them are customer results.
        </p>
      </PageHero>

      <section aria-labelledby="photos-heading" className="section">
        <div className="container-page">
          <SectionHeading id="photos-heading" eyebrow="Photos" title="Workshop, shop and symptom examples">
            Use the filters to narrow the photos, and tap any photo to enlarge it. Use the arrow keys or the buttons to move between photos.
          </SectionHeading>
          <div className="mt-6">
            <GalleryGrid items={GALLERY} filters />
          </div>
        </div>
      </section>

      <section aria-labelledby="videos-heading" className="section bg-surface">
        <div className="container-page">
          <SectionHeading id="videos-heading" eyebrow="Videos" title="Short clips from the shop and TV screens">
            Take a quick look at the RM Electronics shopfront and an example of a TV display symptom. These clips are silent and load only when you press play.
          </SectionHeading>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {VIDEOS.map((video, index) => (
              <VideoCard key={video.src} video={video} id={`video-${index}`} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta title="Seen something familiar on your TV?" />
    </>
  );
}
