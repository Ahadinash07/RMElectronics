import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BUSINESS, MAPS_DIRECTIONS_URL, buildWhatsAppUrl } from "../src/content/site";
import { breadcrumbJsonLd, localBusinessJsonLd } from "../src/lib/seo";

describe("business data", () => {
  it("phone formats are consistent", () => {
    assert.equal(BUSINESS.phone.href, "tel:+917893457190");
    assert.equal(BUSINESS.phone.display.replace(/\s/g, ""), BUSINESS.phone.e164.replace("+91", ""));
    assert.equal(BUSINESS.phone.waDigits, BUSINESS.phone.e164.replace("+", ""));
  });
  it("directions link carries the address", () => {
    assert.ok(MAPS_DIRECTIONS_URL.startsWith("https://www.google.com/maps/dir/?api=1&destination="));
    assert.ok(decodeURIComponent(MAPS_DIRECTIONS_URL).includes("Shrungeri Colony"));
  });
  it("whatsapp link uses the verified-format number and encodes the message", () => {
    const url = buildWhatsAppUrl("Hi there & more");
    assert.ok(url.startsWith("https://wa.me/917893457190?text="));
    assert.ok(url.includes(encodeURIComponent("Hi there & more")));
  });
  it("no opening hours are published until the owner supplies them", () => {
    assert.equal(BUSINESS.hours, null);
  });
});

describe("structured data", () => {
  it("LocalBusiness contains only verified properties", () => {
    const ld = localBusinessJsonLd() as Record<string, unknown>;
    assert.equal(ld["@type"], "LocalBusiness");
    assert.equal(ld.telephone, "+917893457190");
    assert.deepEqual(ld.areaServed, { "@type": "City", name: "Hyderabad" });
    for (const forbidden of ["aggregateRating", "review", "priceRange", "openingHours", "geo", "foundingDate"]) {
      assert.ok(!(forbidden in ld), `${forbidden} must not be present`);
    }
  });
  it("breadcrumbs are positioned from 1", () => {
    const ld = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]) as {
      itemListElement: { position: number }[];
    };
    assert.deepEqual(ld.itemListElement.map((i) => i.position), [1, 2]);
  });
});
