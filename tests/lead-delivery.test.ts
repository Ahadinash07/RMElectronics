import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deliverLead, formatLeadSubject, formatLeadText, readDeliveryConfig } from "../src/lib/lead-delivery";
import { validateEnquiry } from "../src/lib/validation";

function makeLead() {
  const r = validateEnquiry({
    name: "Ravi Kumar",
    phone: "9876543210",
    brand: "LG",
    problem: "TV not turning on",
    locality: "Nagole",
    model: "OLED55",
    contactMethod: "Call",
    details: "Dead since morning",
    consent: true,
    attribution: { utm_source: "google", utm_campaign: "lg-oled" },
  });
  if (!r.ok) throw new Error("fixture invalid");
  return r.data;
}

describe("readDeliveryConfig", () => {
  it("returns null when nothing is configured", () => {
    assert.equal(readDeliveryConfig({}), null);
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "" }), null);
  });
  it("returns null for an unknown provider (no silent fake mode)", () => {
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "console" }), null);
  });
  it("resend needs key, recipient and sender", () => {
    const base = { LEAD_DELIVERY_PROVIDER: "resend", RESEND_API_KEY: "re_x", LEAD_TO_EMAIL: "a@b.in", LEAD_FROM_EMAIL: "RM <leads@b.in>" };
    assert.equal(readDeliveryConfig(base)?.provider, "resend");
    assert.equal(readDeliveryConfig({ ...base, RESEND_API_KEY: "" }), null);
    assert.equal(readDeliveryConfig({ ...base, LEAD_TO_EMAIL: "not-an-email" }), null);
    assert.equal(readDeliveryConfig({ ...base, LEAD_FROM_EMAIL: "" }), null);
  });
  it("webhook requires https (localhost http allowed)", () => {
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "webhook", LEAD_WEBHOOK_URL: "https://hooks.example.com/x" })?.provider, "webhook");
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "webhook", LEAD_WEBHOOK_URL: "http://hooks.example.com/x" }), null);
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "webhook", LEAD_WEBHOOK_URL: "http://localhost:9000/x" })?.provider, "webhook");
    assert.equal(readDeliveryConfig({ LEAD_DELIVERY_PROVIDER: "webhook", LEAD_WEBHOOK_URL: "garbage" }), null);
  });
});

describe("lead formatting", () => {
  it("puts only enum values in the subject", () => {
    assert.equal(formatLeadSubject(makeLead(), "AB12CD34"), "New TV repair enquiry [AB12CD34] - LG");
  });
  it("includes the key details in the body", () => {
    const text = formatLeadText(makeLead(), "AB12CD34", "2026-10-17T00:00:00.000Z");
    for (const s of ["Ravi Kumar", "+919876543210", "LG", "OLED55", "TV not turning on", "Nagole", "utm_source=google", "AB12CD34"]) {
      assert.ok(text.includes(s), s);
    }
  });
});

describe("deliverLead", () => {
  const resend = { provider: "resend", apiKey: "re_secret", to: "owner@example.com", from: "RM <leads@example.com>" } as const;

  it("posts to Resend with bearer auth and reports success only on 2xx", async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fetchFn = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const result = await deliverLead(makeLead(), "AB12CD34", resend, { fetchFn });
    assert.deepEqual(result, { ok: true });
    assert.equal(seen?.url, "https://api.resend.com/emails");
    const headers = seen?.init.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer re_secret");
    const body = JSON.parse(String(seen?.init.body));
    assert.deepEqual(body.to, ["owner@example.com"]);
    assert.ok(body.text.includes("Ravi Kumar"));
  });

  it("reports provider rejection (never success)", async () => {
    const fetchFn = (async () => new Response("nope", { status: 403 })) as unknown as typeof fetch;
    assert.deepEqual(await deliverLead(makeLead(), "R", resend, { fetchFn }), { ok: false, reason: "provider_rejected", status: 403 });
  });

  it("reports network failure", async () => {
    const fetchFn = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    assert.deepEqual(await deliverLead(makeLead(), "R", resend, { fetchFn }), { ok: false, reason: "network" });
  });

  it("reports timeout when the request is aborted", async () => {
    const fetchFn = ((_: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => {
          const e = new Error("aborted");
          e.name = "AbortError";
          reject(e);
        });
      })) as unknown as typeof fetch;
    assert.deepEqual(await deliverLead(makeLead(), "R", resend, { fetchFn, timeoutMs: 20 }), { ok: false, reason: "timeout" });
  });

  it("sends JSON with optional bearer secret to a webhook", async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fetchFn = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(null, { status: 204 });
    }) as unknown as typeof fetch;
    const r = await deliverLead(makeLead(), "AB12CD34", { provider: "webhook", url: "https://hooks.example.com/x", secret: "s3" }, { fetchFn });
    assert.deepEqual(r, { ok: true });
    assert.equal((seen?.init.headers as Record<string, string>).Authorization, "Bearer s3");
    const payload = JSON.parse(String(seen?.init.body));
    assert.equal(payload.reference, "AB12CD34");
    assert.equal(payload.phone, "+919876543210");
  });
});
