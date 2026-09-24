import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, otp, rememberMe } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "E-posta ve doğrulama kodu zorunludur." }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Dev mode bypass
    if (process.env.NODE_ENV === "development" && otp === "123456") {
      // success
    } else {
      const identifier = `2fa-${email}`;
      const tokenRecord = await db.query.verificationTokens.findFirst({
        where: eq(verificationTokens.identifier, identifier)
      });

      if (!tokenRecord) {
        return NextResponse.json({ error: "Kod bulunamadı veya süresi dolmuş." }, { status: 400 });
      }

      if (tokenRecord.token !== otp) {
        return NextResponse.json({ error: "Hatalı doğrulama kodu." }, { status: 400 });
      }

      if (new Date() > tokenRecord.expires) {
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
        return NextResponse.json({ error: "Kodun süresi dolmuş." }, { status: 400 });
      }

      // Valid OTP, delete it
      await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
    }

    // Set trusted device cookie if rememberMe is true
    if (rememberMe) {
      const cookieStore = await cookies();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      cookieStore.set(`trusted_device_${user.id}`, "trusted", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + thirtyDays)
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("verify-2fa error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
