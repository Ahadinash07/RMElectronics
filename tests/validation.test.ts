import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeIndianMobile, validateEnquiry, sanitizeAttribution, firstInvalidField } from "../src/lib/validation";

const valid = {
  name: "Ravi Kumar",
  phone: "98765 43210",
  brand: "Samsung",
  problem: "Sound but no picture",
  locality: "Nagole",
  model: "UA43",
  contactMethod: "Call",
  details: "Screen stays black.",
  consent: true,
};

describe("normalizeIndianMobile", () => {
  const cases: [string, string | null][] = [
    ["7893457190", "+917893457190"],
    ["78934 57190", "+917893457190"],
    ["07893457190", "+917893457190"],
    ["917893457190", "+917893457190"],
    ["+91 78934-57190", "+917893457190"],
    ["(+91) 7893457190", "+917893457190"],
    ["1234567890", null],
    ["5893457190", null],
    ["789345719", null],
    ["78934571901", null],
    ["abcdefghij", null],
    ["", null],
    ["+91 7893457190 ext 5", null],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" -> ${expected}`, () => assert.equal(normalizeIndianMobile(input), expected));
  }
  it("rejects non-strings", () => assert.equal(normalizeIndianMobile(12345 as unknown), null));
});

describe("validateEnquiry", () => {
  it("accepts a valid enquiry and normalises the phone", () => {
    const r = validateEnquiry(valid);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.data.phone, "+919876543210");
      assert.equal(r.data.consent, true);
    }
  });

  it("accepts the form's required fields without optional area or extra details", () => {
    const r = validateEnquiry({
      name: "Ravi Kumar",
      phone: "98765 43210",
      brand: "Samsung",
      problem: "Sound but no picture",
      consent: true,
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.data.locality, "");
      assert.equal(r.data.model, "");
      assert.equal(r.data.details, "");
    }
  });

  it("requires consent to be literally true", () => {
    for (const consent of [false, "true", 1, undefined]) {
      const r = validateEnquiry({ ...valid, consent });
      assert.equal(r.ok, false);
      if (!r.ok) assert.ok(r.errors.consent);
    }
  });

  it("rejects values outside the allowed brand / problem lists", () => {
    const r = validateEnquiry({ ...valid, brand: "Hacker TV", problem: "<script>" });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.ok(r.errors.brand);
      assert.ok(r.errors.problem);
    }
  });

  it("reports every missing required field", () => {
    const r = validateEnquiry({});
    assert.equal(r.ok, false);
    if (!r.ok) {
      for (const f of ["name", "phone", "brand", "problem", "consent"] as const) assert.ok(r.errors[f], f);
      assert.equal(firstInvalidField(r.errors), "name");
    }
  });

  it("handles non-object input safely", () => {
    for (const bad of [null, undefined, "x", 5, []]) assert.equal(validateEnquiry(bad).ok, false);
  });

  it("enforces length limits", () => {
    const r = validateEnquiry({ ...valid, details: "a".repeat(501), model: "m".repeat(61), name: "n".repeat(81) });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.ok(r.errors.details);
      assert.ok(r.errors.model);
      assert.ok(r.errors.name);
    }
  });

  it("accepts names with accents, apostrophes and Indic scripts", () => {
    for (const name of ["Anne-Marie O'Neil", "శ్రీనివాస్", "सुनील कुमार"]) {
      assert.equal(validateEnquiry({ ...valid, name }).ok, true, name);
    }
  });

  it("rejects names containing markup or digits", () => {
    for (const name of ["<b>Bob</b>", "Bob123", "Bob; DROP TABLE"]) {
      assert.equal(validateEnquiry({ ...valid, name }).ok, false, name);
    }
  });

  it("strips control characters and collapses whitespace in single-line fields", () => {
    const r = validateEnquiry({ ...valid, name: "Ravi\n\t  Kumar\u0000", locality: "Na\ngole" });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.data.name, "Ravi Kumar");
      assert.equal(r.data.locality, "Na gole");
    }
  });

  it("keeps line breaks in details but caps blank lines", () => {
    const r = validateEnquiry({ ...valid, details: "line1\r\n\r\n\r\n\r\nline2" });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.data.details, "line1\n\nline2");
  });

  it("allows an empty optional contact method but rejects unknown ones", () => {
    assert.equal(validateEnquiry({ ...valid, contactMethod: "" }).ok, true);
    assert.equal(validateEnquiry({ ...valid, contactMethod: "Pigeon" }).ok, false);
  });
});

describe("sanitizeAttribution", () => {
  it("keeps clean campaign labels", () => {
    assert.deepEqual(sanitizeAttribution({ utm_source: "google", utm_campaign: "lg-oled_nagole", landing_path: "/lp/lg-oled" }), {
      utm_source: "google",
      utm_campaign: "lg-oled_nagole",
      landing_path: "/lp/lg-oled",
    });
  });
  it("drops markup, overlong values and unknown keys", () => {
    const out = sanitizeAttribution({ utm_source: "<script>", utm_medium: "x".repeat(200), evil: "1", utm_campaign: "ok" });
    assert.deepEqual(out, { utm_campaign: "ok" });
  });
  it("returns {} for non-objects", () => assert.deepEqual(sanitizeAttribution("x"), {}));
});
