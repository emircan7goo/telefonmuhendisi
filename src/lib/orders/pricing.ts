import { coupons } from "@/lib/db/schema";

/**
 * Sipariş fiyatlandırma kuralları — sunucu tarafında tek kaynak.
 * Tutarlar kuruş cinsinden tam sayı olarak hesaplanır (float yuvarlama hatası olmasın).
 */

export type Coupon = typeof coupons.$inferSelect;
export type PaymentMethod = "havale" | "kapida";

/** Havale/EFT ile ödemede ara toplama uygulanan indirim oranı (checkout sayfasındaki -%5). */
export const BANK_TRANSFER_DISCOUNT_RATE = 0.05;

export const toKurus = (value: string | number) => Math.round(Number(value) * 100);
export const fromKurus = (kurus: number) => (kurus / 100).toFixed(2);

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

/** Kupon kullanılamıyorsa kullanıcıya gösterilecek sebebi, kullanılabiliyorsa null döner. */
export function couponProblem(coupon: Coupon | undefined, now = new Date()): string | null {
  if (!coupon) return "Geçersiz kupon kodu.";
  if (!coupon.isActive) return "Bu kupon artık aktif değil.";
  if (coupon.expiryDate && now > coupon.expiryDate) return "Bu kuponun süresi dolmuş.";
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return "Bu kuponun kullanım limiti dolmuş.";
  return null;
}

/** Kupon indirimi (kuruş); ara toplamı aşamaz. */
export function couponDiscountKurus(coupon: Coupon, subtotalKurus: number): number {
  const value = Number(coupon.discountValue);
  let discount = 0;
  if (coupon.discountType === "percent") discount = Math.round((subtotalKurus * value) / 100);
  else if (coupon.discountType === "fixed") discount = toKurus(value);
  return Math.max(0, Math.min(discount, subtotalKurus));
}

export interface OrderTotals {
  subtotal: number;
  couponDiscount: number;
  bankTransferDiscount: number;
  total: number;
}

/** Toplam = ara toplam − havale indirimi − kupon indirimi (en az 0). Kuruş cinsinden. */
export function computeOrderTotals(subtotalKurus: number, paymentMethod: PaymentMethod, coupon?: Coupon | null): OrderTotals {
  const couponDiscount = coupon ? couponDiscountKurus(coupon, subtotalKurus) : 0;
  const bankTransferDiscount = paymentMethod === "havale" ? Math.round(subtotalKurus * BANK_TRANSFER_DISCOUNT_RATE) : 0;
  const total = Math.max(0, subtotalKurus - couponDiscount - bankTransferDiscount);
  return { subtotal: subtotalKurus, couponDiscount, bankTransferDiscount, total };
}
