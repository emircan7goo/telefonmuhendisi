import { NextRequest, NextResponse } from "next/server";
import { verifyEnrollmentToken } from "@/lib/enrollment";

/**
 * Cihaz kurulumdan sonra bu endpoint'i çağırır ve konfigürasyonu alır.
 * URL formu: /api/v1/enroll/<token>
 * Deep link: mdmconfig://enroll?url=<origin>/api/v1/enroll/<token>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const payload = verifyEnrollmentToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "invalid_or_expired_enrollment" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const origin = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const serverUrl = `${proto}://${origin}/api/v1/`;

  return NextResponse.json(
    {
      status: "ok",
      server_url: serverUrl,
      api_token: payload.tok,
      device_id: payload.dev ?? null,
      expires_in: Math.max(0, payload.exp - Math.floor(Date.now() / 1000)),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
