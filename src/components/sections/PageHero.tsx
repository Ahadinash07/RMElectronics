import Image from "next/image";
import type { ReactNode } from "react";
import type { SiteImage } from "@/content/images";
import { Breadcrumbs } from "./Breadcrumbs";

type Props = {
  breadcrumbs: { name: string; href?: string }[];
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  image?: SiteImage;
};

/** Dark navy inner-page header. Text and actions come before the image in the DOM, so on phones the heading is first. */
export function PageHero({ breadcrumbs, title, children, actions, image }: Props) {
  return (
    <section data-dark className="bg-brand-gradient">
      <div className={`container-page grid items-center gap-6 py-7 sm:py-10 ${image ? "lg:grid-cols-[1.1fr_1fr] lg:gap-12" : ""}`}>
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="heading-1">{title}</h1>
          {children ? <div className="lead mt-3 max-w-2xl space-y-3">{children}</div> : null}
          {actions ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 520px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="aspect-[16/10] w-full rounded-[1.25rem] border border-white/15 object-cover shadow-card"
          />
        ) : null}
      </div>
    </section>
  );
}
