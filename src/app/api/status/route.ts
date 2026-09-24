import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Basit, bağımlılıksız durum endpoint'i. DB/Redis'e dokunmaz.
 */
export async function GET() {
  return NextResponse.json({
    system: "Telefon Mühendisi",
    status: "operational",
    deployed_by: "Claude Cloud Session",
    environment: "Cloudflare Workers & Neon",
    timestamp: new Date().toISOString(),
  });
}
