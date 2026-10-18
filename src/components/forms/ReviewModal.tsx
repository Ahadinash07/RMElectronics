"use client";

import { DialogShell } from "@/components/ui/DialogShell";
import { ReviewForm } from "./ReviewForm";

export function ReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title="Write a review"
      description="Share your honest experience. Reviews are checked before they appear on the website."
      closeLabel="Close review form"
    >
      <ReviewForm onDone={onClose} />
    </DialogShell>
  );
}
