"use client";

import type { ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button-styles";
import { useEnquiry } from "./EnquiryProvider";

export function WriteReviewButton({
  placement,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  placement: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
}) {
  const { openReview } = useEnquiry();
  return (
    <button type="button" aria-haspopup="dialog" className={buttonClasses(variant, size, className)} onClick={() => openReview(placement)}>
      {children ?? "Write a review"}
    </button>
  );
}
