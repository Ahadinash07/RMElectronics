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

/** Dark navy inner-page header. On phones, any hero image follows the title before supporting copy. */
export function PageHero({ breadcrumbs, title, children, actions, image }: Props) {
  return (
    <section data-dark className="bg-brand-gradient">
      <div className={`container-page grid items-center gap-6 py-7 sm:py-10 ${image ? "gap-y-0 lg:grid-cols-[1.1fr_1fr] lg:gap-x-12" : ""}`}>
        {image ? (
          <>
            <div className="lg:col-start-1 lg:row-start-1">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            <h1 className="heading-1 lg:col-start-1 lg:row-start-2">{title}</h1>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 520px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="mt-4 aspect-[16/10] w-full rounded-[1.25rem] border border-white/15 object-cover shadow-card lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:mt-0"
            />
            <div className="mt-3 lg:col-start-1 lg:row-start-3 lg:mt-0">
              {children ? <div className="lead mt-3 max-w-2xl space-y-3">{children}</div> : null}
              {actions ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            </div>
          </>
        ) : (
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="heading-1">{title}</h1>
            {children ? <div className="lead mt-3 max-w-2xl space-y-3">{children}</div> : null}
            {actions ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
          </div>
        )}
      </div>
    </section>
  );
}
