import type { SiteVideo } from "@/content/images";

/** Silent clip, loads only metadata until the visitor presses play (keeps mobile data use low). */
export function VideoCard({ video, id }: { video: SiteVideo; id: string }) {
  return (
    <figure className="card flex h-full flex-col !p-4 sm:!p-5">
      <div className="aspect-video overflow-hidden rounded-control bg-navy">
        <video
          controls
          playsInline
          preload="metadata"
          width={video.width}
          height={video.height}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-desc`}
          className="h-full w-full object-contain"
        >
          <source src={video.src} type="video/mp4" />
          Your browser cannot play this video.
        </video>
      </div>
      <figcaption className="mt-4 flex-1">
        <h3 id={`${id}-title`} className="heading-3">
          {video.title}
        </h3>
        <p id={`${id}-desc`} className="mt-1 text-sm text-ink-2">
          {video.description}
        </p>
      </figcaption>
    </figure>
  );
}
