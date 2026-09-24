import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * TURN kısa-ömürlü kimlik bilgileri (RFC 5766 §7).
 * username = "<unix_expiry>:<deviceId>"
 * password = base64( HMAC-SHA1(secret, username) )
 *
 * coturn `use-auth-secret` + aynı `static-auth-secret` ile doğrular.
 * Env: TURN_STATIC_AUTH_SECRET, TURN_HOST, TURN_TTL_SEC (default 3600).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.TURN_STATIC_AUTH_SECRET;
  const host = process.env.TURN_HOST;

  if (!secret || !host) {
    return NextResponse.json(
      {
        // Fallback: public STUN listesi. TURN yoksa NAT'ın izin verdiği yerde çalışır.
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        configured: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const deviceId = request.headers.get("x-device-id") || "anon";
  const ttl = Number(process.env.TURN_TTL_SEC ?? 3600);
  const expiry = Math.floor(Date.now() / 1000) + ttl;
  const username = `${expiry}:${deviceId}`;
  const credential = crypto
    .createHmac("sha1", secret)
    .update(username)
    .digest("base64");

  return NextResponse.json(
    {
      configured: true,
      ttl,
      iceServers: [
        { urls: `stun:${host}:3478` },
        { urls: `turn:${host}:3478?transport=udp`, username, credential },
        { urls: `turn:${host}:3478?transport=tcp`, username, credential },
        { urls: `turns:${host}:5349?transport=tcp`, username, credential },
      ],
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
