import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createEnquiryHandler, type HandlerInput } from "../src/lib/enquiry-handler";
import { createRateLimiter, createSeenStore } from "../src/lib/rate-limit";

const SUBMISSION_ID = "3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a7b";

const goodPayload = () => ({
  name: "Ravi Kumar",
  phone: "9876543210",
  brand: "Sony",
  problem: "No sound or distorted sound",
  locality: "Nagole",
  model: "",
  contactMethod: "Call",
  details: "",
  consent: true,
  website: "",
  elapsedMs: 9000,
  submissionId: SUBMISSION_ID,
});

const env = {
  LEAD_DELIVERY_PROVIDER: "resend",
  RESEND_API_KEY: "re_x",
  LEAD_TO_EMAIL: "owner@example.com",
  LEAD_FROM_EMAIL: "RM <leads@example.com>",
};

function build(options: { env?: Record<string, string | undefined>; fetchFn?: typeof fetch; limit?: number } = {}) {
  const logs: string[] = [];
  const handler = createEnquiryHandler({
    env: options.env ?? env,
    rateLimiter: createRateLimiter({ limit: options.limit ?? 50, windowMs: 60_000 }),
    seen: createSeenStore<string>({ ttlMs: 60_000 }),
    ...(options.fetchFn ? { fetchFn: options.fetchFn } : {}),
    generateReference: () => "REF00001",
    log: (m) => logs.push(m),
  });
  return { handler, logs };
}

function req(payload: unknown, overrides: Partial<HandlerInput> = {}): HandlerInput {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return { contentType: "application/json", contentLength: body.length, ip: "1.2.3.4", readBody: async () => body, ...overrides };
}

const okFetch = () => {
  const calls: number[] = [];
  const fetchFn = (async () => {
    calls.push(1);
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;
  return { fetchFn, calls };
};

describe("enquiry handler", () => {
  it("accepts a valid enquiry only after the provider accepts it", async () => {
    const { fetchFn, calls } = okFetch();
    const { handler } = build({ fetchFn });
    const res = await handler(req(goodPayload()));
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, reference: "REF00001" });
    assert.equal(calls.length, 1);
  });

  it("accepts the shorter form payload without optional contact details", async () => {
    const { locality: _locality, model: _model, contactMethod: _contactMethod, details: _details, ...shortPayload } = goodPayload();
    void _locality;
    void _model;
    void _contactMethod;
    void _details;
    const { fetchFn } = okFetch();
    const { handler } = build({ fetchFn });
    const res = await handler(req(shortPayload));
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, reference: "REF00001" });
  });

  it("NEVER reports success when delivery is not configured", async () => {
    const { handler, logs } = build({ env: {} });
    const res = await handler(req(goodPayload()));
    assert.equal(res.status, 503);
    assert.equal(res.body.ok, false);
    assert.ok(logs.some((l) => l.includes("NOT delivered")));
  });

  it("NEVER reports success when the provider rejects, and logs no personal data", async () => {
    const fetchFn = (async () => new Response("bad", { status: 401 })) as unknown as typeof fetch;
    const { handler, logs } = build({ fetchFn });
    const res = await handler(req(goodPayload()));
    assert.equal(res.status, 502);
    assert.equal(res.body.ok, false);
    const logged = logs.join(" ");
    assert.ok(!logged.includes("Ravi") && !logged.includes("9876543210"));
  });

  it("NEVER reports success on network failure", async () => {
    const fetchFn = (async () => {
      throw new TypeError("down");
    }) as unknown as typeof fetch;
    const res = await build({ fetchFn }).handler(req(goodPayload()));
    assert.equal(res.status, 502);
  });

  it("returns field errors for invalid input and does not call the provider", async () => {
    const { fetchFn, calls } = okFetch();
    const res = await build({ fetchFn }).handler(req({ ...goodPayload(), phone: "123", consent: false }));
    assert.equal(res.status, 400);
    assert.equal(res.body.ok, false);
    if (!res.body.ok && res.body.code === "invalid") {
      assert.ok(res.body.errors.phone);
      assert.ok(res.body.errors.consent);
    } else assert.fail("expected invalid");
    assert.equal(calls.length, 0);
  });

  it("rejects honeypot submissions and too-fast submissions", async () => {
    const { fetchFn, calls } = okFetch();
    const { handler } = build({ fetchFn });
    assert.equal((await handler(req({ ...goodPayload(), website: "http://spam" }))).status, 400);
    assert.equal((await handler(req({ ...goodPayload(), elapsedMs: 200 }))).status, 400);
    const { elapsedMs: _omit, ...noTiming } = goodPayload();
    void _omit;
    assert.equal((await handler(req(noTiming))).status, 400);
    assert.equal(calls.length, 0);
  });

  it("does not deliver the same submission twice", async () => {
    const { fetchFn, calls } = okFetch();
    const { handler } = build({ fetchFn });
    const a = await handler(req(goodPayload()));
    const b = await handler(req(goodPayload()));
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.deepEqual(a.body, b.body);
    assert.equal(calls.length, 1);
  });

  it("collapses simultaneous duplicate requests into one delivery", async () => {
    let calls = 0;
    const fetchFn = (async () => {
      calls++;
      await new Promise((r) => setTimeout(r, 30));
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const { handler } = build({ fetchFn });
    const [a, b] = await Promise.all([handler(req(goodPayload())), handler(req(goodPayload()))]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.equal(calls, 1);
  });

  it("does not remember failed deliveries (a retry may still succeed)", async () => {
    let attempt = 0;
    const fetchFn = (async () => {
      attempt++;
      return new Response("{}", { status: attempt === 1 ? 500 : 200 });
    }) as unknown as typeof fetch;
    const { handler } = build({ fetchFn });
    assert.equal((await handler(req(goodPayload()))).status, 502);
    assert.equal((await handler(req(goodPayload()))).status, 200);
  });

  it("rate limits by IP", async () => {
    const { fetchFn } = okFetch();
    const { handler } = build({ fetchFn, limit: 2 });
    await handler(req({ ...goodPayload(), submissionId: "3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a01" }));
    await handler(req({ ...goodPayload(), submissionId: "3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a02" }));
    const third = await handler(req({ ...goodPayload(), submissionId: "3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a03" }));
    assert.equal(third.status, 429);
    assert.ok(third.headers?.["Retry-After"]);
    const other = await handler(req(goodPayload(), { ip: "9.9.9.9" }));
    assert.equal(other.status, 200);
  });

  it("rejects wrong content type, oversized and malformed bodies", async () => {
    const { handler } = build();
    assert.equal((await handler(req(goodPayload(), { contentType: "text/plain" }))).status, 415);
    assert.equal((await handler(req(goodPayload(), { contentLength: 99999 }))).status, 413);
    assert.equal((await handler(req("{not json"))).status, 400);
    assert.equal((await handler(req("[1,2]"))).status, 400);
    assert.equal((await handler(req({ ...goodPayload(), submissionId: "nope" }))).status, 400);
  });
});
