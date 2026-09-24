import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit, rateLimitGcTick } from "@/lib/rateLimit";

const PUBLIC_V1 = new Set<string>([
  "telemetry",
  "telemetry/batch",
  "commands/result",
]);

function pathAfterV1(pathname: string): string | null {
  const idx = pathname.indexOf("/api/v1/");
  if (idx === -1) return null;
  return pathname.slice(idx + "/api/v1/".length).replace(/\/+$/, "");
}

function isDeviceIngressRoute(rest: string): boolean {
  if (rest === "turn/credentials") return true;
  if (rest.startsWith("enroll/")) return true;
  if (!rest.startsWith("devices/")) return false;
  return (
    rest.endsWith("/telemetry") ||
    rest.endsWith("/media") ||
    rest.endsWith("/files") ||
    rest.endsWith("/audit-logs") ||
    rest.endsWith("/apps") ||
    rest.endsWith("/download") ||
    rest.endsWith("/stream") ||
    rest.endsWith("/stream/sse") ||
    rest.endsWith("/fcm-token") ||
    rest.endsWith("/locations") ||
    rest.endsWith("/pending-commands") ||
    rest.endsWith("/command/poll") ||
    rest.endsWith("/webrtc/signal") ||
    rest.endsWith("/agent") ||
    rest.endsWith("/intelligence")
  );
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function verifyHmac(
  secret: string,
  method: string,
  path: string,
  timestamp: string,
  signatureHex: string,
): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const msg = `${method}\n${path}\n${timestamp}`;
    const sigBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((h) => parseInt(h, 16)) ?? [],
    );
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(msg));
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Canlıda olmaması gereken debug uçları
  if (pathname === "/api/test-env") {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });
    const role = (token as any)?.role;
    if (!token || !["admin", "technician"].includes(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/tmkontrols-giris";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/api/v1/")) return NextResponse.next();

  const rest = pathAfterV1(pathname) ?? "";
  const isIngress = PUBLIC_V1.has(rest) || isDeviceIngressRoute(rest);

  if (isIngress) {
    const deviceHeader = req.headers.get("x-device-id");
    const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const sharedSecret = process.env.DEVICE_INGRESS_TOKEN;
    const hmacSecret = process.env.DEVICE_HMAC_SECRET;
    const hmacEnforce = process.env.HMAC_ENFORCE === "true";

    if (sharedSecret && bearer !== sharedSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!deviceHeader && rest.startsWith("devices/")) {
      return NextResponse.json({ error: "missing device id header" }, { status: 400 });
    }

    // Rate limit: cihaz başına 300/dk (5rps) + IP başına 900/dk (15rps)
    const now = Date.now();
    const dKey = `dev:${deviceHeader ?? "anon"}`;
    const ipKey = `ip:${clientIp(req)}`;
    const dRl = rateLimit(dKey, { capacity: 30, refillPerSec: 5 });
    const iRl = rateLimit(ipKey, { capacity: 60, refillPerSec: 15 });
    rateLimitGcTick();
    if (!dRl.ok || !iRl.ok) {
      const worst = !dRl.ok ? dRl : iRl;
      return NextResponse.json(
        { error: "rate_limited", retry_after_ms: worst.resetInMs },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(worst.resetInMs / 1000)),
            "X-RateLimit-Remaining-Device": String(dRl.remaining),
            "X-RateLimit-Remaining-Ip": String(iRl.remaining),
          },
        },
      );
    }

    // HMAC — opsiyonel, HMAC_ENFORCE=true iken zorunlu
    if (hmacSecret) {
      const sig = req.headers.get("x-signature");
      const ts = req.headers.get("x-timestamp");
      if (sig && ts) {
        const drift = Math.abs(now - Number(ts));
        if (Number.isFinite(Number(ts)) && drift <= 5 * 60 * 1000) {
          const ok = await verifyHmac(hmacSecret, req.method, pathname, ts, sig);
          if (!ok && hmacEnforce) {
            return NextResponse.json({ error: "bad_signature" }, { status: 401 });
          }
        } else if (hmacEnforce) {
          return NextResponse.json({ error: "stale_timestamp" }, { status: 401 });
        }
      } else if (hmacEnforce) {
        return NextResponse.json({ error: "missing_signature" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  // Admin-only /api/v1 uçları
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });
  const role = (token as any)?.role;
  if (!token || !["admin", "technician"].includes(role)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Admin IP rate limit — 1200/dk
  const iRl = rateLimit(`admin:${clientIp(req)}`, { capacity: 60, refillPerSec: 20 });
  rateLimitGcTick();
  if (!iRl.ok) {
    return NextResponse.json({ error: "rate_limited" }, {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(iRl.resetInMs / 1000)) },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/v1/:path*", "/api/test-env"],
};
