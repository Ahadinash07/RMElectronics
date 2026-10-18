"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { Icon } from "@/components/ui/Icon";
import { NavLinks } from "./NavLinks";

/** Touch-friendly menu for phones and tablets. Escape closes it and returns focus to the toggle. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-control border-2 border-white/70 text-white hover:bg-white/10"
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/10 bg-navy shadow-card"
      >
        <nav aria-label="Main" className="container-page py-3">
          <NavLinks
            onNavigate={close}
            className="divide-y divide-white/10"
            linkClassName="flex min-h-12 items-center text-lg font-semibold text-white"
            activeClassName="underline decoration-accent decoration-4 underline-offset-8"
          />
          <div className="grid gap-3 pb-3 pt-4 sm:grid-cols-2">
            <BookRepairButton placement="mobile_menu" size="lg" onClick={close}>Book Doorstep Repair</BookRepairButton>
            <CallLink placement="mobile_menu" asButton variant="secondary" size="lg" />
            <WhatsAppLink placement="mobile_menu" asButton size="lg" />
          </div>
        </nav>
      </div>
    </>
  );
}
