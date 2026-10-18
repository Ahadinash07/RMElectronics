"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from "@/content/images";
import { trackEvent } from "@/lib/analytics";

type Props = {
  items: GalleryItem[];
  /** Show the category filter buttons. */
  filters?: boolean;
};

/**
 * Responsive photo grid with an accessible lightbox (native <dialog>): focus is trapped,
 * Escape closes, Left/Right arrows (and the buttons) move between photos.
 * Without JavaScript the thumbnails are still visible images.
 */
export function GalleryGrid({ items, filters = false }: Props) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);
  const current = active !== null ? visible[active] : undefined;
  const open = active !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const go = (delta: number) =>
    setActive((i) => (i === null || visible.length === 0 ? i : (i + delta + visible.length) % visible.length));

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
  };

  const chip = (selected: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border-2 px-4 text-sm font-semibold ${
      selected ? "border-brand bg-brand text-white" : "border-line bg-white text-brand hover:border-brand"
    }`;

  return (
    <div>
      {filters ? (
        <div role="group" aria-label="Filter photos" className="mb-6 flex flex-wrap gap-2">
          <button type="button" aria-pressed={filter === "all"} className={chip(filter === "all")} onClick={() => setFilter("all")}>
            All photos
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button key={c.id} type="button" aria-pressed={filter === c.id} className={chip(filter === c.id)} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => {
                setActive(index);
                trackEvent("gallery_open", { placement: item.category });
              }}
              className="group block w-full overflow-hidden rounded-card border border-line bg-white text-left shadow-card"
              aria-haspopup="dialog"
            >
              <span className="relative block">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 368px, (min-width: 416px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand shadow">
                  <Icon name="search" className="h-5 w-5" />
                </span>
              </span>
              <span className="block p-3 text-sm text-ink-2">
                {item.caption}
                <span className="sr-only"> (open larger view)</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label={current ? `Photo ${(active ?? 0) + 1} of ${visible.length}: ${current.caption}` : "Photo viewer"}
        onClose={() => setActive(null)}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        {current ? (
          <div className="overflow-hidden rounded-card bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
              <p className="text-sm font-semibold text-brand" aria-live="polite">
                Photo {(active ?? 0) + 1} of {visible.length}
              </p>
              <button
                type="button"
                data-autofocus
                onClick={() => setActive(null)}
                aria-label="Close photo viewer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-control text-brand hover:bg-surface"
              >
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-[#111827]">
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="mx-auto max-h-[62dvh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <button type="button" onClick={() => go(-1)} className="inline-flex min-h-12 items-center gap-2 rounded-control border-2 border-brand px-4 font-semibold text-brand hover:bg-surface">
                <Icon name="arrowRight" className="h-5 w-5 rotate-180" />
                Previous
              </button>
              <p className="hidden flex-1 text-center text-sm text-ink-2 sm:block">{current.caption}</p>
              <button type="button" onClick={() => go(1)} className="inline-flex min-h-12 items-center gap-2 rounded-control border-2 border-brand px-4 font-semibold text-brand hover:bg-surface">
                Next
                <Icon name="arrowRight" className="h-5 w-5" />
              </button>
            </div>
            <p className="px-4 pb-4 text-sm text-ink-2 sm:hidden">{current.caption}</p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
