"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { RepairEnquiryModal } from "./RepairEnquiryModal";
import { ReviewModal } from "./ReviewModal";

type OpenOptions = { placement: string; brand?: string };
type Ctx = { open: (options: OpenOptions) => void; openReview: (placement: string) => void };

const EnquiryContext = createContext<Ctx | null>(null);

export function useEnquiry(): Ctx {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

/** Holds the single enquiry dialog for the whole site and exposes open(). */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; placement: string; brand: string | undefined }>({
    open: false,
    placement: "unknown",
    brand: undefined,
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((options: OpenOptions) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setState({ open: true, placement: options.placement, brand: options.brand });
    trackEvent("repair_form_open", { placement: options.placement });
  }, []);

  const openReview = useCallback((placement: string) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setReviewOpen(true);
    trackEvent("review_open", { placement });
  }, []);

  const closeReview = useCallback(() => {
    setReviewOpen(false);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const close = useCallback(() => {
    setState((s) => (s.open ? { ...s, open: false } : s));
    // Return focus to whatever opened the dialog.
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const value = useMemo(() => ({ open, openReview }), [open, openReview]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <RepairEnquiryModal open={state.open} placement={state.placement} brand={state.brand} onClose={close} />
      <ReviewModal open={reviewOpen} onClose={closeReview} />
    </EnquiryContext.Provider>
  );
}
