import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Prod liveness/readiness probe. Compose healthcheck bu path'i çağırıyor.
 * 200 = uygulama + bağımlılıklar OK, 503 = kritik bağımlılık down.
 */
export async function GET() {
  const started = Date.now();
  const result: Record<string, any> = {
    status: "ok",
    uptime_ms: Math.floor(process.uptime() * 1000),
    ts: new Date().toISOString(),
    checks: {} as Record<string, any>,
  };
  let degraded = false;

  try {
    const t0 = Date.now();
    await db.execute(sql`select 1 as ok`);
    result.checks.postgres = { ok: true, latency_ms: Date.now() - t0 };
  } catch (e: any) {
    result.checks.postgres = { ok: false, error: e?.message };
    degraded = true;
  }

  if (redis) {
    try {
      const t0 = Date.now();
      const pong = await redis.ping();
      result.checks.redis = { ok: pong === "PONG", latency_ms: Date.now() - t0 };
    } catch (e: any) {
      result.checks.redis = { ok: false, error: e?.message };
      // Redis kritik değil; degrade sayma
    }
  } else {
    result.checks.redis = { ok: false, configured: false };
  }

  result.checks.pusher = {
    configured: Boolean(process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET),
  };
  result.checks.turn = {
    configured: Boolean(process.env.TURN_STATIC_AUTH_SECRET && process.env.TURN_HOST),
  };

  result.total_ms = Date.now() - started;

  if (degraded) result.status = "degraded";
  return NextResponse.json(result, { status: degraded ? 503 : 200 });
}
