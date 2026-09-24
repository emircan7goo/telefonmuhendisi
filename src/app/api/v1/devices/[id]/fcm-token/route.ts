import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getDeviceById } from "@/lib/telemetryStore";

/**
 * Faz 4.18 - FCM registration iskeleti.
 * Cihaz Firebase Messaging registration token'ını buraya POST eder.
 * Token Redis'te dev:<id>:fcm anahtarında tutulur (30 gün TTL).
 * Push gönderimi Faz 5'te Admin SDK ile eklenecek (google-services.json gerekli).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const token = String(body?.token ?? "").trim();

    if (!token) {
      return NextResponse.json({ error: "missing_token" }, { status: 400 });
    }

    if (redis) {
      await redis.set(`dev:${id}:fcm`, token, "EX", 60 * 60 * 24 * 30);
    } else {
      // Fallback: in-memory device state'ine bağla (restart'ta kaybolur)
      const dev = getDeviceById(id) as any;
      if (dev) dev.fcm_token = token;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "error" }, { status: 500 });
  }
}
