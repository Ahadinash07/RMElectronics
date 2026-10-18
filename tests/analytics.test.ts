import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { looksLikePersonalData, sanitizeParams } from "../src/lib/analytics";

describe("analytics sanitizer", () => {
  it("keeps allow-listed, non-personal params", () => {
    assert.deepEqual(sanitizeParams({ placement: "hero", page_path: "/about", form_id: "repair_enquiry" }), {
      placement: "hero",
      page_path: "/about",
      form_id: "repair_enquiry",
    });
  });

  it("drops anything not on the allow-list (names, phones, problem text, message text)", () => {
    const out = sanitizeParams({
      placement: "hero",
      name: "Ravi",
      phone: "9876543210",
      problem: "no picture",
      message: "Hi RM Electronics",
      email: "a@b.com",
    });
    assert.deepEqual(out, { placement: "hero" });
  });

  it("drops allow-listed params whose values look like a phone number or email", () => {
    const out = sanitizeParams({ placement: "+91 98765 43210", utm_source: "me@example.com", utm_campaign: "9876543210", form_id: "ok" });
    assert.deepEqual(out, { form_id: "ok" });
  });

  it("keeps ordinary campaign names and long numeric ids that are not mobile-like", () => {
    assert.deepEqual(sanitizeParams({ utm_campaign: "lg-oled-nagole-2026", utm_source: "google" }), {
      utm_campaign: "lg-oled-nagole-2026",
      utm_source: "google",
    });
    assert.deepEqual(sanitizeParams({ utm_campaign: "21234567890" }), { utm_campaign: "21234567890" });
  });

  it("ignores non-string values and truncates long ones", () => {
    const out = sanitizeParams({ placement: 5, error_category: "x".repeat(300) });
    assert.equal(out.placement, undefined);
    assert.equal(out.error_category?.length, 100);
  });

  it("handles undefined", () => assert.deepEqual(sanitizeParams(undefined), {}));

  it("looksLikePersonalData basics", () => {
    assert.equal(looksLikePersonalData("hello@x.com"), true);
    assert.equal(looksLikePersonalData("78934 57190"), true);
    assert.equal(looksLikePersonalData("sticky_bar"), false);
  });
});
