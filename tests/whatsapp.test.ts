import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatEnquiryWhatsAppMessage } from "../src/lib/whatsapp";
import { EMPTY_VALUES } from "../src/lib/validation";

describe("WhatsApp enquiry draft", () => {
  it("includes the captured booking details without analytics-style redaction", () => {
    const message = formatEnquiryWhatsAppMessage({
      ...EMPTY_VALUES,
      name: "Ravi Kumar",
      phone: "98765 43210",
      brand: "Samsung",
      problem: "Sound but no picture",
    });

    assert.match(message, /Name: Ravi Kumar/);
    assert.match(message, /Mobile: 98765 43210/);
    assert.match(message, /TV brand: Samsung/);
    assert.match(message, /Problem: Sound but no picture/);
  });

  it("includes optional details only when the visitor supplied them", () => {
    const message = formatEnquiryWhatsAppMessage({
      ...EMPTY_VALUES,
      name: "Ravi Kumar",
      phone: "98765 43210",
      brand: "LG",
      problem: "Other",
      locality: "Nagole",
      model: "55UQ7500",
      contactMethod: "WhatsApp",
      details: "The TV restarts after a few minutes.",
    });

    assert.match(message, /Area: Nagole/);
    assert.match(message, /TV model: 55UQ7500/);
    assert.match(message, /Preferred contact: WhatsApp/);
    assert.match(message, /Additional details: The TV restarts after a few minutes\./);
  });
});
