import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Kupon kodu gereklidir." }, { status: 400 });
    }

    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code.toUpperCase())
    });

    if (!coupon) {
      return NextResponse.json({ error: "Geçersiz kupon kodu." }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Bu kupon artık aktif değil." }, { status: 400 });
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return NextResponse.json({ error: "Bu kuponun süresi dolmuş." }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Bu kuponun kullanım limiti dolmuş." }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    const value = Number(coupon.discountValue);

    if (coupon.discountType === "percent") {
      discountAmount = (cartTotal * value) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = value;
    }

    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: value,
        discountAmount: discountAmount
      }
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
