import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    r2_account: process.env.CLOUDFLARE_R2_ACCOUNT_ID ? "SET" : "MISSING",
    r2_bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ? "SET" : "MISSING",
    database: process.env.DATABASE_URL ? "SET" : "MISSING"
  });
}
