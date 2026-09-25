import { escapeHtml, sendEmail } from "@/lib/mail";
import { getShopSettings } from "@/lib/settings";
import { formatTrPhone, normalizeTrPhone, whatsappUrl } from "@/lib/contact";

const FALLBACK_NOTIFY_EMAIL = "destek@telefonmuhendisi.com";

function appUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://telefonmuhendisi.com").replace(/\/$/, "");
  return `${base}${path}`;
}

export interface ShopNotification {
  /** E-posta konusu, örn. "🔧 Yeni Tamir Talebi #12" */
  subject: string;
  /** E-postadaki başlık */
  title: string;
  /** [etiket, değer] satırları */
  rows: Array<[string, string | number | null | undefined]>;
  /** Müşterinin telefonu varsa "WhatsApp'tan yaz" butonu eklenir */
  customerPhone?: string | null;
  /** Müşteriye WhatsApp'ta gidecek hazır ilk mesaj */
  customerMessage?: string;
  /** Panelde ilgili kaydın yolu, örn. /tmkontrols/tamirler/12 */
  adminPath?: string;
}

/**
 * Dükkan sahibine yeni talep/olay e-postası gönderir. Alıcı sırasıyla:
 * panel ayarı "notifyEmail" → SHOP_NOTIFY_EMAIL → destek@telefonmuhendisi.com.
 * Asla hata fırlatmaz: bildirim başarısız olsa da müşterinin işlemi tamamlanır.
 */
export async function notifyShop(n: ShopNotification): Promise<void> {
  try {
    const settings = await getShopSettings();
    const to = settings.notifyEmail?.trim() || process.env.SHOP_NOTIFY_EMAIL?.trim() || FALLBACK_NOTIFY_EMAIL;

    const rows = n.rows
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
          `<td style="padding:6px 0;color:#0f172a;font-weight:600;white-space:pre-line">${escapeHtml(value)}</td></tr>`
      )
      .join("");

    const buttons: string[] = [];
    if (n.adminPath) {
      buttons.push(
        `<a href="${escapeHtml(appUrl(n.adminPath))}" style="display:inline-block;margin:4px;padding:12px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Panelde Aç</a>`
      );
    }
    if (normalizeTrPhone(n.customerPhone)) {
      buttons.push(
        `<a href="${escapeHtml(whatsappUrl(n.customerPhone, n.customerMessage))}" style="display:inline-block;margin:4px;padding:12px 20px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Müşteriye WhatsApp'tan Yaz (${escapeHtml(formatTrPhone(n.customerPhone))})</a>`
      );
    }

    const html = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#fff">
        <h2 style="margin:0 0 16px;color:#1e3a8a">${escapeHtml(n.title)}</h2>
        <table style="border-collapse:collapse;font-size:14px;width:100%">${rows}</table>
        <div style="margin-top:20px;text-align:center">${buttons.join("")}</div>
        <p style="margin-top:24px;color:#94a3b8;font-size:12px;text-align:center">Bu e-posta telefonmuhendisi.com tarafından otomatik gönderildi. Alıcı adresi panelde Ayarlar → "Bildirim E-postası" alanından değiştirilebilir.</p>
      </div>`;

    const result = await sendEmail({ to, subject: n.subject, html });
    if (!result.success) console.error("[notify] dükkan bildirimi gönderilemedi:", result.error);
  } catch (err) {
    console.error("[notify] dükkan bildirimi hatası:", err);
  }
}
