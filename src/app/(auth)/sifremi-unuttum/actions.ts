"use server";

import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "@/lib/mail/smtp";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(email: string) {
  const targetEmail = email.trim().toLowerCase();
  
  if (!targetEmail) {
    return { success: false, error: "Lütfen e-posta adresinizi giriniz." };
  }

  try {
    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, targetEmail),
    });

    // Secure practice: return success even if user doesn't exist to prevent email harvesting
    if (!user) {
      return { 
        success: true, 
        message: "E-posta adresi kayıtlı ise sıfırlama bağlantısı gönderilecektir." 
      };
    }

    // Generate unique token and 1 hour expiry
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save token to verificationTokens
    await db.insert(verificationTokens).values({
      identifier: targetEmail,
      token: token,
      expires: expires,
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sifremi-unuttum/yeni?token=${token}&email=${encodeURIComponent(targetEmail)}`;

    // Send email using GoDaddy SMTP
    const emailResult = await sendEmail({
      to: targetEmail,
      subject: "Şifre Sıfırlama Talebi | Telefon Mühendisi",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 24px; font-weight: 900;">Telefon Mühendisi</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Garantili Elektronik Onarım Merkezi</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;" />
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Merhaba <strong>${user.name || "Kullanıcımız"}</strong>,</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak hemen yeni bir şifre belirleyebilirsiniz:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">Yeni Şifre Belirle</a>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; background-color: #f8fafc; padding: 12px; border-radius: 8px;">
            <strong>Güvenlik Uyarısı:</strong> Bu sıfırlama bağlantısı <strong>1 saat</strong> boyunca geçerlidir. Eğer bu talebi siz gerçekleştirmediyseniz, bu e-postayı güvenle yok sayabilirsiniz. Şifreniz siz yeni bir şifre belirleyene kadar değişmeyecektir.
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

    return { 
      success: true, 
      message: "E-posta adresi kayıtlı ise sıfırlama bağlantısı gönderilecektir." 
    };
  } catch (err: any) {
    console.error("Şifre sıfırlama talep hatası:", err);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  const targetEmail = email.trim().toLowerCase();
  
  if (!targetEmail || !token || !newPassword) {
    return { success: false, error: "Lütfen tüm bilgileri eksiksiz doldurunuz." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Şifreniz en az 6 karakterden oluşmalıdır." };
  }

  try {
    // Find token in database
    const tokenRecord = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, targetEmail),
        eq(verificationTokens.token, token)
      ),
    });

    if (!tokenRecord) {
      return { success: false, error: "Geçersiz veya hatalı şifre sıfırlama kodu." };
    }

    // Check expiry
    if (tokenRecord.expires < new Date()) {
      return { success: false, error: "Bu sıfırlama bağlantısının süresi dolmuş." };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update user password
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, targetEmail));

    // Delete token
    await db.delete(verificationTokens)
      .where(and(
        eq(verificationTokens.identifier, targetEmail),
        eq(verificationTokens.token, token)
      ));

    return { success: true };
  } catch (err: any) {
    console.error("Şifre güncelleme hatası:", err);
    return { success: false, error: "Şifreniz güncellenirken bir hata oluştu." };
  }
}
