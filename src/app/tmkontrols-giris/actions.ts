"use server";

import { db } from "@/lib/db";
import { verificationTokens, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mail/smtp";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/email";
import { userEmailEquals } from "@/lib/db/user-email";

// ─── OTP Rate Limiter (in-memory, per-process) ───────────────────────────────
// Format: email → { count, firstAttempt }
const otpAttempts = new Map<string, { count: number; firstAttemptMs: number }>();
const OTP_MAX_ATTEMPTS = 5;
const OTP_WINDOW_MS = 10 * 60 * 1000; // 10 dakika

function checkOtpRateLimit(email: string): { allowed: boolean; remaining?: number } {
  const now = Date.now();
  const entry = otpAttempts.get(email);
  if (!entry) {
    otpAttempts.set(email, { count: 1, firstAttemptMs: now });
    return { allowed: true, remaining: OTP_MAX_ATTEMPTS - 1 };
  }
  // Pencere dışına çıkıldıysa sıfırla
  if (now - entry.firstAttemptMs > OTP_WINDOW_MS) {
    otpAttempts.set(email, { count: 1, firstAttemptMs: now });
    return { allowed: true, remaining: OTP_MAX_ATTEMPTS - 1 };
  }
  if (entry.count >= OTP_MAX_ATTEMPTS) {
    const waitMin = Math.ceil((OTP_WINDOW_MS - (now - entry.firstAttemptMs)) / 60000);
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: OTP_MAX_ATTEMPTS - entry.count };
}
// ─────────────────────────────────────────────────────────────────────────────

export async function verifyAdminCredentialsAndSendOTP(formData: {
  email: string;
  pass: string;
}) {
  try {
    const email = normalizeEmail(formData.email);
    const { pass } = formData;
    if (!email || !pass) {
      return { success: false, error: "E-posta ve şifre gereklidir." };
    }

    // Rate limiting kontrolü
    const rateLimit = checkOtpRateLimit(email);
    if (!rateLimit.allowed) {
      return { success: false, error: "Çok fazla hatalı deneme yaptınız. Lütfen 10 dakika bekleyin." };
    }

    const user = await db.query.users.findFirst({
      where: userEmailEquals(email)
    });

    if (!user) {
      return { success: false, error: "Bu e-posta adresine ait bir hesap bulunamadı." };
    }

    if (user.role !== "admin" && user.role !== "technician") {
      return { success: false, error: "Bu sayfaya erişim yetkiniz bulunmamaktadır." };
    }

    // Verify password
    const passwordMatch = Boolean(user.passwordHash && bcrypt.compareSync(pass, user.passwordHash));

    if (!passwordMatch) {
      return { success: false, error: "Hatalı şifre girdiniz." };
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up existing tokens for this user
    const tokenIdentifier = `admin-otp:${email}`;
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.identifier, tokenIdentifier));

    // Save token in DB
    await db.insert(verificationTokens).values({
      identifier: tokenIdentifier,
      token: otpCode,
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: "Yönetici Portalı - İki Adımlı Doğrulama Kodu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 20px;">Yönetici Giriş Doğrulaması</h2>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Merhaba,</p>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Telefon Mühendisi yönetim paneline giriş yapmak için aşağıdaki 6 haneli güvenlik kodunu kullanın:</p>
          <div style="background-color: #f7fafc; border: 1px dashed #cbd5e0; padding: 15px; text-align: center; margin: 25px 0; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #2563eb; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="color: #718096; font-size: 13px; line-height: 1.6; border-top: 1px solid #edf2f7; padding-top: 20px;">Bu kod 5 dakika geçerlidir. Giriş talebi size ait değilse, lütfen hesap şifrenizi hemen güncelleyin.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[DEV BYPASS] SMTP failed to send 2FA email. Allowing entry. OTP Code: ${otpCode}`);
        return { success: true };
      }
      return { success: false, error: "Doğrulama e-postası gönderilemedi. Lütfen sunucu ayarlarını kontrol edin." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Admin credentials verification error:", error);
    return { success: false, error: error.message || "Giriş işlemi başlatılamadı." };
  }
}
