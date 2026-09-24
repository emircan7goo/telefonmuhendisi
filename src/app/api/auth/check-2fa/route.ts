import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre zorunludur." }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Check password
    const isPasswordValid = Boolean(user.passwordHash && bcrypt.compareSync(password, user.passwordHash));

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
    }

    // Check if device is trusted
    const cookieStore = await cookies();
    const trustedDeviceCookie = cookieStore.get(`trusted_device_${user.id}`);

    if (trustedDeviceCookie) {
      // Device is trusted, no 2FA needed
      return NextResponse.json({ success: true, require2FA: false });
    }

    // Device not trusted, generate 2FA OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

    // Save to DB
    const identifier = `2fa-${email}`;
    // Clear old tokens
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
    
    await db.insert(verificationTokens).values({
      identifier,
      token: otp,
      expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // TODO: Send OTP via Email (Console log for now)
    console.log(`[EMAIL 2FA] To: ${email} -> Kodunuz: ${otp}`);

    return NextResponse.json({ success: true, require2FA: true, message: "Doğrulama kodu e-posta adresinize gönderildi." });

  } catch (error) {
    console.error("check-2fa error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
