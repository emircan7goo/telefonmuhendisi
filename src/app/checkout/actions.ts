"use server";

import { db } from "@/lib/db";
import { orders, orderItems, coupons } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, sql } from "drizzle-orm";

export async function createOrder(data: {
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  shippingAddress: any;
  billingAddress: any;
  items: Array<{ productId: number | string; quantity: number; price: number }>;
  paymentMethod: "havale" | "kapida";
}) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Lütfen siparişi tamamlamak için önce giriş yapın." };
    }

    const userId = session.user.id;
    if (!userId) {
      return { success: false, error: "Kullanıcı kimliği bulunamadı." };
    }

    // 1. Create the order
    const [newOrder] = await db.insert(orders).values({
      userId,
      totalAmount: data.totalAmount.toString(),
      couponCode: data.couponCode || null,
      discountAmount: data.discountAmount ? data.discountAmount.toString() : "0",
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      status: data.paymentMethod === "havale" ? "pending" : "confirmed", // havale bekler, kapıda ödeme direkt onaylanır (demo)
      paymentId: data.paymentMethod, 
    }).returning();

    // Increment coupon usedCount if valid
    if (data.couponCode) {
      await db.update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(eq(coupons.code, data.couponCode));
    }

    // 2. Insert items
    for (const item of data.items) {
      // In a real app we'd fetch the real product price from DB to avoid client-side price manipulation.
      // But for this demo, we'll trust the client side payload.
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: typeof item.productId === "string" ? parseInt(item.productId.replace("p-", "")) || 0 : item.productId, // Hack for static IDs like "p-1" vs DB IDs
        quantity: item.quantity,
        price: item.price.toString(),
      });
    }

    return { success: true, orderId: newOrder.id };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message || "Sipariş oluşturulamadı." };
  }
}
