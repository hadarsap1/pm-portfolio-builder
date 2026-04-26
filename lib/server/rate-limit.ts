// Sliding-window per-IP rate limiter.
// In-process: fine for single-instance deploys, resets on cold start, doesn't
// share across serverless replicas. Swap for Upstash/Redis for production scale.
//
// Hung off globalThis so it survives Turbopack worker boundaries in dev (same
// reasoning as gallery-store.ts).

const GLOBAL_KEY = Symbol.for("pm-portfolio.rate-limit");

interface Bucket {
  // Sorted list of request timestamps within the active window
  hits: number[];
}

type RateLimitGlobal = typeof globalThis & {
  [GLOBAL_KEY]?: Map<string, Bucket>;
};

function store(): Map<string, Bucket> {
  const g = globalThis as RateLimitGlobal;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Map<string, Bucket>();
  return g[GLOBAL_KEY];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Per-key sliding-window limiter.
 * @param key   Usually the client IP plus the route name to scope buckets.
 * @param limit Max requests allowed inside the window.
 * @param windowMs Window size in milliseconds.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const map = store();
  const now = Date.now();
  const cutoff = now - windowMs;

  const bucket = map.get(key) ?? { hits: [] };
  // Drop hits older than the window
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= limit) {
    map.set(key, bucket);
    const oldest = bucket.hits[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  bucket.hits.push(now);
  map.set(key, bucket);
  return {
    allowed: true,
    remaining: limit - bucket.hits.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client IP extraction. Vercel/most proxies set x-forwarded-for.
 * Falls back to a constant so rate-limiting still functions in dev.
 */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "anonymous";
}
