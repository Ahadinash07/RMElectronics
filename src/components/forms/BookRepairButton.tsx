"use client";

import type { ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button-styles";
import { useEnquiry } from "./EnquiryProvider";

type Props = {
  placement: string;
  /** Brand pre-selected in the form (a value from BRAND_OPTIONS). */
  brand?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
};

/** Opens the enquiry dialog. Use for every "Book a Repair" call to action. */
export function BookRepairButton({ placement, brand, variant = "primary", size = "md", className = "", onClick, children }: Props) {
  const { open } = useEnquiry();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={buttonClasses(variant, size, className)}
      onClick={() => {
        onClick?.();
        open({ placement, ...(brand ? { brand } : {}) });
      }}
    >
      {children ?? "Book Doorstep Repair"}
    </button>
  );
}
