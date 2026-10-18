import type { EnquiryFormValues } from "./validation";

/**
 * Builds the customer-controlled WhatsApp draft for a completed enquiry.
 * The visitor still has to press Send in WhatsApp; opening a wa.me link does
 * not send a message automatically.
 */
export function formatEnquiryWhatsAppMessage(values: EnquiryFormValues): string {
  const lines = [
    "Hi RM Electronics, I would like to book a doorstep TV visit.",
    `Name: ${values.name.trim() || "Not provided"}`,
    `Mobile: ${values.phone.trim() || "Not provided"}`,
    `TV brand: ${values.brand.trim() || "Not provided"}`,
    `Problem: ${values.problem.trim() || "Not provided"}`,
  ];

  if (values.locality.trim()) lines.push(`Area: ${values.locality.trim()}`);
  if (values.model.trim()) lines.push(`TV model: ${values.model.trim()}`);
  if (values.details.trim()) lines.push(`Additional details: ${values.details.trim()}`);

  return lines.join("\n");
}
