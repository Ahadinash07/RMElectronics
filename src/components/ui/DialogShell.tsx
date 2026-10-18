"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  closeLabel: string;
  children: ReactNode;
};

/**
 * Accessible modal / bottom sheet on the native <dialog> element: showModal() provides the top layer,
 * inert background, focus trap and Escape-to-close. We add the labelled title/description, a labelled
 * close button, focus on the first [data-autofocus] control, scroll lock and backdrop click.
 * Children stay mounted while closed, so typed values survive closing and reopening.
 */
export function DialogShell({ open, onClose, title, description, closeLabel, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="enquiry-dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] shadow-xl md:max-h-[calc(100dvh-2rem)] md:rounded-2xl md:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="heading-3">
              {title}
            </h2>
            <p id={descId} className="mt-1 text-sm text-ink-2">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-2 -mt-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-control text-brand hover:bg-surface"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
