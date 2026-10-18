/**
 * Small in-memory helpers for the enquiry endpoint.
 *
 * IMPORTANT: state lives in one server instance's memory. On serverless
 * hosting (e.g. Vercel) each instance has its own memory, so this is a
 * best-effort speed bump, not a hard guarantee. For strict limits, back these
 * with a shared store (Upstash Redis / Vercel KV) - see README.
 */

export type RateLimiter = {
  check(key: string): { allowed: boolean; retryAfterSec: number };
};

export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}): RateLimiter {
  const { limit, windowMs, now = Date.now, maxKeys = 5000 } = options;
  const hits = new Map<string, number[]>();

  return {
    check(key: string) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);

      if (recent.length >= limit) {
        const oldest = recent[0] ?? t;
        hits.set(key, recent);
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (t - oldest)) / 1000)) };
      }

      recent.push(t);
      hits.set(key, recent);

      if (hits.size > maxKeys) {
        for (const [k, stamps] of hits) {
          if (stamps.every((ts) => t - ts >= windowMs)) hits.delete(k);
          if (hits.size <= maxKeys) break;
        }
      }
      return { allowed: true, retryAfterSec: 0 };
    },
  };
}

export type SeenStore<T> = {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
};

/** Remembers recently accepted submission IDs so a retry never creates a second lead. */
export function createSeenStore<T>(options: {
  ttlMs: number;
  now?: () => number;
  maxEntries?: number;
}): SeenStore<T> {
  const { ttlMs, now = Date.now, maxEntries = 2000 } = options;
  const entries = new Map<string, { value: T; expires: number }>();

  return {
    get(id) {
      const entry = entries.get(id);
      if (!entry) return undefined;
      if (entry.expires <= now()) {
        entries.delete(id);
        return undefined;
      }
      return entry.value;
    },
    set(id, value) {
      const t = now();
      entries.set(id, { value, expires: t + ttlMs });
      if (entries.size > maxEntries) {
        for (const [k, v] of entries) {
          if (v.expires <= t || entries.size > maxEntries) entries.delete(k);
          if (entries.size <= maxEntries) break;
        }
      }
    },
  };
}
