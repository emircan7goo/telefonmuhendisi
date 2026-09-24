"use server";

import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function sendSmsOTP(phone: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length < 10) {
    return { success: false, error: "Geçerli bir telefon numarası giriniz." };
  }

  try {
    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenIdentifier = `sms-otp:${cleanPhone}`;

    // Clean up existing tokens for this phone
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, tokenIdentifier));

    // Save token
    await db.insert(verificationTokens).values({
      identifier: tokenIdentifier,
      token: otpCode,
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // TODO: Integrate actual SMS Provider here (Netgsm / Twilio)
    console.log(`[SMS MOCK] To: ${cleanPhone}, Code: ${otpCode}`);

    return { success: true, message: "Doğrulama kodu SMS ile gönderildi." };
  } catch (error) {
    console.error("SMS OTP Error:", error);
    return { success: false, error: "SMS gönderilirken bir hata oluştu." };
  }
}
