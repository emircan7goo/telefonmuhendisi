/**
 * Dükkan iletişim bilgileri ve WhatsApp/tel link yardımcıları.
 * Saf modül: hem server hem client component'lerden import edilebilir.
 * Telefon numarası admin panelindeki "İletişim Numarası (WhatsApp)" ayarından
 * (settings.contactPhone) gelir; bu dosyadaki değer sadece varsayılandır.
 */

export const DEFAULT_SHOP_PHONE = "+905449456417";
export const SHOP_NAME = "Telefon Mühendisi (Semih İletişim)";
export const SHOP_ADDRESS = "4 Temmuz Mah. İnönü Cd. No:2, 41500 Karamürsel / Kocaeli";
export const SHOP_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=40.690559,29.615174";

/** "0544 945 64 17", "+90 544...", "544..." → "905449456417". Geçersizse null. */
export function normalizeTrPhone(input: string | null | undefined): string | null {
  let digits = (input ?? "").replace(/\D/g, "");
  if (digits.startsWith("0090")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = `9${digits}`;
  if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return /^90\d{10}$/.test(digits) ? digits : null;
}

/** 905449456417 → "0544 945 64 17" */
export function formatTrPhone(input: string | null | undefined): string {
  const n = normalizeTrPhone(input);
  if (!n) return input ?? "";
  const local = n.slice(2);
  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8)}`;
}

export function whatsappUrl(phone: string | null | undefined, text?: string): string {
  const n = normalizeTrPhone(phone) ?? normalizeTrPhone(DEFAULT_SHOP_PHONE)!;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telUrl(phone: string | null | undefined): string {
  const n = normalizeTrPhone(phone) ?? normalizeTrPhone(DEFAULT_SHOP_PHONE)!;
  return `tel:+${n}`;
}
