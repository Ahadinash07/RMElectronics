import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRateLimiter, createSeenStore } from "../src/lib/rate-limit";

describe("rate limiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    assert.equal(rl.check("a").allowed, true);
    assert.equal(rl.check("a").allowed, true);
    const blocked = rl.check("a");
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterSec >= 1);
    assert.equal(rl.check("b").allowed, true);
    t = 1001;
    assert.equal(rl.check("a").allowed, true);
  });
});

describe("seen store", () => {
  it("expires entries", () => {
    let t = 0;
    const s = createSeenStore<string>({ ttlMs: 100, now: () => t });
    s.set("id", "ref");
    assert.equal(s.get("id"), "ref");
    t = 101;
    assert.equal(s.get("id"), undefined);
  });
});
