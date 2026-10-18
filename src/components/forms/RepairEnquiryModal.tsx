"use client";

import { DialogShell } from "@/components/ui/DialogShell";
import { RepairEnquiryForm } from "./RepairEnquiryForm";

type Props = {
  open: boolean;
  placement: string;
  brand: string | undefined;
  onClose: () => void;
};

export function RepairEnquiryModal({ open, placement, brand, onClose }: Props) {
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title="Book a Doorstep TV Repair"
      description="Three quick steps. A technician can visit your home in Hyderabad."
      closeLabel="Close enquiry form"
    >
      <RepairEnquiryForm active={open} placement={placement} defaultBrand={brand} onSuccess={onClose} />
    </DialogShell>
  );
}
