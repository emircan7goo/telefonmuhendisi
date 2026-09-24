"use server";

import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "@/lib/mail/smtp";
import bcrypt from "bcryptjs";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, normalizeEmail } from "@/lib/email";
import { userEmailEquals } from "@/lib/db/user-email";

export async function sendEmailVerificationCode(email: string) {
  const targetEmail = normalizeEmail(email);
  
  if (!targetEmail) {
    return { success: false, error: "Lütfen geçerli bir e-posta adresi giriniz." };
  }

  // Check if email already exists
  const existingEmail = await db.query.users.findFirst({
    where: userEmailEquals(targetEmail)
  });

  if (existingEmail) {
    return { success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın." };
  }

  try {
    // Generate a 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 600000); // 10 minutes

    // Save token to verificationTokens
    await db.insert(verificationTokens).values({
      identifier: targetEmail,
      token: otp,
      expires: expires,
    });

    // Send email using GoDaddy SMTP
    const emailResult = await sendEmail({
      to: targetEmail,
      subject: "E-Posta Doğrulama Kodu | Telefon Mühendisi",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 24px; font-weight: 900;">Telefon Mühendisi</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Garantili Elektronik Onarım Merkezi</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;" />
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Merhaba,</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Telefon Mühendisi platformuna kayıt olmak için e-posta doğrulama kodunuz aşağıdadır:</p>
          <div style="text-align: center; margin: 35px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border: 1px dashed #bfdbfe; border-radius: 8px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; background-color: #f8fafc; padding: 12px; border-radius: 8px;">
            Bu kod <strong>10 dakika</strong> geçerlidir. Eğer bu talebi siz gerçekleştirmediyseniz, lütfen bu e-postayı dikkate almayınız.
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 25px; margin-bottom: 15px;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            Semih İletişim | destek@telefonmuhendisi.com | 0262 511 00 00
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return { success: false, error: "E-posta gönderilemedi." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("E-posta doğrulama gönderme hatası:", err);
    return { success: false, error: "Doğrulama kodu gönderilirken bir hata oluştu." };
  }
}

export async function verifyEmailAndRegister(name: string, phone: string, email: string, code: string, password: string) {
  const targetEmail = normalizeEmail(email);
  const cleanPhone = phone.replace(/\D/g, "");

  if (!name.trim() || !cleanPhone || !targetEmail || !code.trim() || !password) {
    return { success: false, error: "Lütfen tüm bilgileri eksiksiz doldurunuz." };
  }

  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return { success: false, error: `Şifreniz en az ${MIN_PASSWORD_LENGTH}, en fazla ${MAX_PASSWORD_LENGTH} karakter olmalıdır.` };
  }

  // Check if phone already exists
  const existingPhone = await db.query.users.findFirst({
    where: eq(users.phone, cleanPhone)
  });

  if (existingPhone) {
    return { success: false, error: "Bu telefon numarasıyla kayıtlı bir hesap zaten var. Lütfen giriş yapın." };
  }

  // Check if email already exists
  const existingEmail = await db.query.users.findFirst({
    where: userEmailEquals(targetEmail)
  });

  if (existingEmail) {
    return { success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın." };
  }

  try {
    // Development bypass or check database token
    let isCodeValid = false;
    
    if (process.env.NODE_ENV === 'development' && code === "123456") {
      isCodeValid = true;
    } else {
      const tokenRecord = await db.query.verificationTokens.findFirst({
        where: and(
          eq(verificationTokens.identifier, targetEmail),
          eq(verificationTokens.token, code.trim())
        )
      });

      if (tokenRecord && tokenRecord.expires > new Date()) {
        isCodeValid = true;
        // Delete token
        await db.delete(verificationTokens).where(and(
          eq(verificationTokens.identifier, targetEmail),
          eq(verificationTokens.token, code.trim())
        ));
      }
    }

    if (!isCodeValid) {
      return { success: false, error: "Geçersiz veya süresi dolmuş doğrulama kodu." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: cleanPhone,
      email: targetEmail,
      emailVerified: new Date(),
      passwordHash,
      role: "customer"
    });

    return { success: true };
  } catch (err: any) {
    console.error("Kayıt tamamlama hatası:", err);
    return { success: false, error: "Kayıt işlemi sırasında bir hata oluştu." };
  }
}
