// Basit in-memory token bucket. Multi-instance için ileride Redis'e taşınacak.
// Dev/tek-instance prod'da yeterli.
type Bucket = { tokens: number; ts: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInMs: number;
}

export function rateLimit(
  key: string,
  opts: { capacity: number; refillPerSec: number },
): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: opts.capacity, ts: now };
  const elapsedMs = now - b.ts;
  const refill = (elapsedMs / 1000) * opts.refillPerSec;
  b.tokens = Math.min(opts.capacity, b.tokens + refill);
  b.ts = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    const need = 1 - b.tokens;
    const resetInMs = Math.ceil((need / opts.refillPerSec) * 1000);
    return { ok: false, remaining: 0, resetInMs };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, remaining: Math.floor(b.tokens), resetInMs: 0 };
}

// Ergonomik GC: her ~1000 çağrıda bir eski bucket'ları at (setInterval Edge'de yok).
let opCount = 0;
export function rateLimitGcTick() {
  opCount++;
  if (opCount < 1000) return;
  opCount = 0;
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [k, v] of buckets) if (v.ts < cutoff) buckets.delete(k);
}
