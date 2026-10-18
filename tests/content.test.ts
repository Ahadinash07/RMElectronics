import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BRANDS } from "../src/content/brands";
import { CAMPAIGNS } from "../src/content/campaigns";
import { BRAND_OPTIONS } from "../src/lib/validation";

describe("brand pages are genuinely distinct (no doorway templates)", () => {
  it("covers the five required brands", () => {
    assert.deepEqual(BRANDS.map((b) => b.slug).sort(), ["lg-oled", "oneplus", "samsung", "sony", "vu"]);
  });
  it("no two brands share a title, description, heading, angle paragraph, symptom title or FAQ", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    const add = (kind: string, value: string, owner: string) => {
      const key = `${kind}:${value}`;
      const prev = seen.get(key);
      if (prev && prev !== owner) dupes.push(`${kind} shared by ${prev} and ${owner}: ${value.slice(0, 60)}`);
      seen.set(key, owner);
    };
    for (const b of BRANDS) {
      add("title", b.metaTitle, b.slug);
      add("desc", b.metaDescription, b.slug);
      add("h1", b.h1, b.slug);
      add("angle-heading", b.angle.heading, b.slug);
      b.angle.paragraphs.forEach((p) => add("angle", p, b.slug));
      b.symptoms.forEach((s) => add("symptom", s.title, b.slug));
      b.faqs.forEach((f) => add("faq", f.q, b.slug));
    }
    assert.deepEqual(dupes, []);
  });
  it("each brand has substantial, structured content", () => {
    for (const b of BRANDS) {
      assert.ok(b.angle.paragraphs.length >= 2, b.slug);
      assert.ok(b.symptoms.length >= 4, b.slug);
      assert.ok(b.faqs.length >= 3, b.slug);
      assert.ok(b.share.length >= 3, b.slug);
      assert.ok(b.metaTitle.length <= 70 && b.metaDescription.length <= 160, `${b.slug} meta length`);
      assert.ok(BRAND_OPTIONS.includes(b.formBrand), `${b.slug} form brand`);
    }
  });
  it("brand copy makes no unverified promises", () => {
    const text = JSON.stringify(BRANDS).toLowerCase();
    for (const banned of ["same-day", "same day", "guarantee", "free diagnosis", "genuine parts", "lifetime", "% off", "\u20b9"]) {
      assert.ok(!text.includes(banned), `found "${banned}"`);
    }
    assert.ok(!/\brs\.?\s?\d/.test(text), "no rupee prices");
  });
});

describe("campaigns", () => {
  it("slugs are unique and brand campaigns point at real brands", () => {
    assert.equal(new Set(CAMPAIGNS.map((c) => c.slug)).size, CAMPAIGNS.length);
    for (const c of CAMPAIGNS) if (c.brandSlug) assert.ok(BRANDS.some((b) => b.slug === c.brandSlug));
  });
});

import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { GALLERY, IMAGES, VIDEOS } from "../src/content/images";
import { SERVICE_CATEGORIES } from "../src/content/services";

const PUBLIC_DIR = join(__dirname, "..", "public");

describe("gallery and media", () => {
  it("every image and video file exists, is non-empty and reasonably small", () => {
    const files = [...Object.values(IMAGES).map((i) => i.src), ...VIDEOS.map((v) => v.src)];
    for (const f of files) {
      const path = join(PUBLIC_DIR, f);
      assert.ok(existsSync(path), `missing ${f}`);
      const size = statSync(path).size;
      assert.ok(size > 1000, `${f} too small`);
      assert.ok(size < 2_000_000, `${f} too large (${size})`);
    }
  });
  it("gallery items have meaningful alt text, captions and no duplicates", () => {
    assert.ok(GALLERY.length >= 10);
    assert.equal(new Set(GALLERY.map((g) => g.src)).size, GALLERY.length);
    for (const g of GALLERY) {
      assert.ok(g.alt.length >= 30, `alt too short: ${g.src}`);
      assert.ok(g.caption.length >= 10);
    }
  });
  it("videos describe themselves and say they are silent", () => {
    for (const v of VIDEOS) {
      assert.ok(v.title && v.description.includes("No sound"));
    }
  });
  it("every service category has a card image", () => {
    for (const s of SERVICE_CATEGORIES) assert.ok(s.image.src.startsWith("/images/"));
  });
});

import { DOORSTEP, SPARE_PARTS_PHONE } from "../src/content/site";
import { GENERAL_FAQS, SERVICES_FAQS } from "../src/content/faqs";

describe("doorstep positioning", () => {
  it("provides at least five service-specific FAQs in addition to the general service FAQs", () => {
    assert.ok(SERVICES_FAQS.length >= 9);
    for (const faq of SERVICES_FAQS) {
      assert.ok(faq.q.trim() && faq.a.trim(), "every service FAQ has a question and answer");
    }
  });

  it("brand pages and campaigns lead with doorstep service in Hyderabad", () => {
    for (const b of BRANDS) {
      assert.ok(/doorstep/i.test(b.h1) && /hyderabad/i.test(b.h1), `${b.slug} h1`);
      assert.ok(/doorstep/i.test(b.metaTitle), `${b.slug} title`);
      assert.ok(/doorstep/i.test(b.intro), `${b.slug} intro`);
    }
    for (const c of CAMPAIGNS) assert.ok(/doorstep/i.test(c.h1), `${c.slug} h1`);
  });
  it("doorstep facts are consistent and exclude unconfirmed claims", () => {
    assert.equal(DOORSTEP.visitingCharge, "\u20b9199");
    assert.ok(DOORSTEP.areas.includes("Nagole") && DOORSTEP.areas.length >= 7);
    assert.equal(SPARE_PARTS_PHONE.href, "tel:+919059888821");
    const all = JSON.stringify({ GENERAL_FAQS, DOORSTEP }).toLowerCase();
    for (const unconfirmed of ["10,000", "30 din", "90 days", "warranty period", "9:00 am", "9 am"]) assert.ok(!all.includes(unconfirmed), unconfirmed);
  });
  it("FAQ answers mention the visiting charge and the doorstep service", () => {
    assert.ok(GENERAL_FAQS.some((f) => f.a.includes("\u20b9199")));
    assert.ok(GENERAL_FAQS.some((f) => /doorstep/i.test(f.a)));
  });
});
