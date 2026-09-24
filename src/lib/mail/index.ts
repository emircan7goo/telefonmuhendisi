/**
 * E-posta gönderimi — Resend HTTP API.
 *
 * SMTP (nodemailer) Cloudflare Workers'ta ham TCP soketi gerektirdiği için
 * kaldırıldı; Resend'e düz `fetch` ile gidiliyor (SDK'ya gerek yok, Workers ve
 * Node'da aynı şekilde çalışır).
 *
 * Gerekli ortam değişkenleri:
 *   RESEND_API_KEY     — Resend API anahtarı (Cloudflare'de secret olarak)
 *   RESEND_FROM_EMAIL  — Resend'de doğrulanmış alan adından gönderici adresi
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "destek@telefonmuhendisi.com";
const SENDER_NAME = "Telefon Mühendisi";
const REQUEST_TIMEOUT_MS = 10_000;

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export type SendEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

function fromAddress(): string {
  const configured = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  // "Ad <adres>" biçiminde verildiyse olduğu gibi kullan
  return configured.includes("<") ? configured : `${SENDER_NAME} <${configured}>`;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey.startsWith("your-")) {
    if (process.env.NODE_ENV === "production") {
      // Üretimde sessizce "gönderildi" deme: OTP/şifre sıfırlama akışları hatayı göstermeli.
      console.error("[mail] RESEND_API_KEY tanımlı değil; e-posta gönderilemedi:", subject);
      return { success: false, error: "E-posta servisi yapılandırılmamış." };
    }
    console.log(`\n[MAIL MOCK] to: ${to}\n[MAIL MOCK] subject: ${subject}`);
    const otpMatch = html.match(/>\s*(\d{6})\s*</);
    if (otpMatch) console.log(`[MAIL MOCK] OTP CODE: ${otpMatch[1]}`);
    return { success: true, messageId: "mock-message-id" };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const body = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok || !body?.id) {
      const error = body?.message || `HTTP ${res.status}`;
      console.error("[mail] Resend hatası:", error);
      return { success: false, error };
    }
    return { success: true, messageId: body.id };
  } catch (error) {
    console.error("[mail] Resend isteği başarısız:", error);
    return { success: false, error: (error as Error).message || "E-posta gönderilemedi." };
  }
}

/** Kullanıcı kaynaklı metni (isim, cihaz modeli, not...) HTML e-postaya güvenle yerleştirir. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
