import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { couponDiscountKurus, couponProblem, fromKurus, normalizeCouponCode, toKurus } from "@/lib/orders/pricing";

/**
 * Checkout'ta kupon önizlemesi. Buradaki tutar sadece gösterim içindir;
 * sipariş oluşturulurken indirim createOrder içinde veritabanından yeniden hesaplanır.
 */
export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Kupon kodu gereklidir." }, { status: 400 });
    }

    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, normalizeCouponCode(code))
    });

    const problem = couponProblem(coupon);
    if (problem || !coupon) {
      return NextResponse.json({ error: problem }, { status: coupon ? 400 : 404 });
    }

    const subtotal = Math.max(0, toKurus(Number(cartTotal) || 0));
    const discountAmount = Number(fromKurus(couponDiscountKurus(coupon, subtotal)));

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountAmount
      }
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
