import Redis from "ioredis";

/**
 * Tekil Redis instance'ı. REDIS_URL yoksa null döner ve tüm callers
 * `if (redis)` kontrolüyle graceful degrade olmalı (Faz 2 Pusher fallback var).
 */
const globalForRedis = globalThis as unknown as {
  __redis?: Redis | null;
};

export const redis: Redis | null = (() => {
  if (globalForRedis.__redis !== undefined) return globalForRedis.__redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    globalForRedis.__redis = null;
    return null;
  }
  try {
    const client = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 2,
      enableAutoPipelining: true,
      connectTimeout: 5000,
    });
    client.on("error", (err) => {
      console.warn("[redis] error:", err.message);
    });
    globalForRedis.__redis = client;
    return client;
  } catch (err) {
    console.warn("[redis] init failed:", (err as Error).message);
    globalForRedis.__redis = null;
    return null;
  }
})();
