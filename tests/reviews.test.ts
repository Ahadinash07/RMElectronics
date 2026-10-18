import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REVIEWS } from "../src/content/reviews";
import { createRateLimiter, createSeenStore } from "../src/lib/rate-limit";
import { createReviewHandler } from "../src/lib/review-handler";
import { validateReview } from "../src/lib/review-validation";
import type { HandlerInput } from "../src/lib/enquiry-handler";

const good = {
  name: "Ravi K.",
  area: "Nagole",
  brand: "Samsung",
  rating: "5",
  text: "The TV was explained clearly and I was kept informed.",
  permission: true,
  website: "",
  elapsedMs: 8000,
  submissionId: "3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a7b",
};
const env = { LEAD_DELIVERY_PROVIDER: "resend", RESEND_API_KEY: "re_x", LEAD_TO_EMAIL: "o@example.com", LEAD_FROM_EMAIL: "RM <l@example.com>" };

function make(opts: { env?: Record<string, string | undefined>; fetchFn?: typeof fetch } = {}) {
  const logs: string[] = [];
  const handler = createReviewHandler({
    env: opts.env ?? env,
    rateLimiter: createRateLimiter({ limit: 50, windowMs: 60_000 }),
    seen: createSeenStore<string>({ ttlMs: 60_000 }),
    ...(opts.fetchFn ? { fetchFn: opts.fetchFn } : {}),
    generateReference: () => "REV00001",
    log: (m) => logs.push(m),
  });
  return { handler, logs };
}
const req = (p: unknown): HandlerInput => {
  const body = JSON.stringify(p);
  return { contentType: "application/json", contentLength: body.length, ip: "1.1.1.1", readBody: async () => body };
};

describe("the published reviews list", () => {
  it("only contains reviews with permission and sane content", () => {
    for (const r of REVIEWS) {
      assert.equal(r.permission, true);
      assert.ok(r.text.length >= 10 && r.text.length <= 1000);
      assert.ok(!/<[a-z]/i.test(r.text), "no markup");
      if (r.rating !== undefined) assert.ok(r.rating >= 1 && r.rating <= 5);
    }
    assert.equal(new Set(REVIEWS.map((r) => r.id)).size, REVIEWS.length);
  });
});

describe("validateReview", () => {
  it("accepts a good review", () => assert.equal(validateReview(good).ok, true));
  it("requires permission, rating, name and enough text", () => {
    const r = validateReview({ ...good, permission: false, rating: "", name: "", text: "short" });
    assert.equal(r.ok, false);
    if (!r.ok) for (const f of ["permission", "rating", "name", "text"] as const) assert.ok(r.errors[f], f);
  });
  it("rejects links and emails (spam) and out-of-range ratings", () => {
    assert.equal(validateReview({ ...good, text: "Great service visit www.spam.example now please" }).ok, false);
    assert.equal(validateReview({ ...good, text: "Great service, mail me at bob@spam.example for deals" }).ok, false);
    assert.equal(validateReview({ ...good, rating: "6" }).ok, false);
    assert.equal(validateReview({ ...good, rating: "0" }).ok, false);
  });
});

describe("review handler", () => {
  it("reports success only after the provider accepts, and sends it as 'to approve'", async () => {
    let sent: { subject: string; text: string } | undefined;
    const fetchFn = (async (_u: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const res = await make({ fetchFn }).handler(req(good));
    assert.equal(res.status, 200);
    assert.ok(sent?.subject.includes("to approve"));
    assert.ok(sent?.text.includes("NOT published yet"));
  });
  it("never reports success when not configured or provider fails", async () => {
    assert.equal((await make({ env: {} }).handler(req(good))).status, 503);
    const bad = (async () => new Response("no", { status: 500 })) as unknown as typeof fetch;
    assert.equal((await make({ fetchFn: bad }).handler(req(good))).status, 502);
  });
  it("rejects honeypot / too-fast submissions and invalid input", async () => {
    const { handler } = make();
    assert.equal((await handler(req({ ...good, website: "x" }))).status, 400);
    assert.equal((await handler(req({ ...good, elapsedMs: 10 }))).status, 400);
    assert.equal((await handler(req({ ...good, text: "short" }))).status, 400);
  });
  it("does not deliver the same review twice", async () => {
    let calls = 0;
    const fetchFn = (async () => {
      calls++;
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const { handler } = make({ fetchFn });
    await handler(req(good));
    await handler(req(good));
    assert.equal(calls, 1);
  });
});
