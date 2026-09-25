"use server";

import { db } from "@/lib/db";
import { orders, orderItems, coupons, products } from "@/lib/db/schema";
import { requireUser, AuthzError } from "@/lib/authz";
import { and, asc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  computeOrderTotals,
  couponProblem,
  fromKurus,
  normalizeCouponCode,
  toKurus,
} from "@/lib/orders/pricing";
import { notifyShop } from "@/lib/notify";

const MAX_QTY_PER_ITEM = 20;
const MAX_LINES = 50;

const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(10).max(20),
  tcNo: z.string().trim().max(11).optional().default(""),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  fullAddress: z.string().trim().min(5).max(500),
});

// Fiyat, toplam ve indirim alanları bilinçli olarak YOK: hepsi sunucuda veritabanından hesaplanır.
const orderInputSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(1).max(MAX_QTY_PER_ITEM),
      })
    )
    .min(1)
    .max(MAX_LINES),
  couponCode: z.string().trim().max(64).optional(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.enum(["havale", "kapida"]),
});

export type CreateOrderInput = Omit<z.input<typeof orderInputSchema>, "items"> & {
  items: Array<{ productId: number | string; quantity: number }>;
};

/** Kullanıcıya olduğu gibi gösterilebilecek iş kuralı hatası. */
class OrderError extends Error {}

export async function createOrder(input: CreateOrderInput) {
  try {
    const user = await requireUser();

    const parsed = orderInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Sipariş bilgileri eksik veya hatalı. Lütfen adres ve sepetinizi kontrol edin." };
    }
    const data = parsed.data;

    // Aynı ürün birden fazla satırda gelirse birleştir
    const quantities = new Map<number, number>();
    for (const item of data.items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }
    const productIds = [...quantities.keys()].sort((a, b) => a - b);

    const result = await db.transaction(async (tx) => {
      // 1. Ürünleri kilitle ve güncel fiyat/stok bilgisini veritabanından oku
      const rows = await tx
        .select({ id: products.id, name: products.name, price: products.price, stock: products.stock, isActive: products.isActive })
        .from(products)
        .where(inArray(products.id, productIds))
        .orderBy(asc(products.id))
        .for("update");
      const byId = new Map(rows.map((r) => [r.id, r]));

      let subtotal = 0;
      const lines: Array<{ productId: number; name: string; quantity: number; unitPrice: string }> = [];
      for (const productId of productIds) {
        const product = byId.get(productId);
        const quantity = quantities.get(productId)!;
        if (!product || !product.isActive) {
          throw new OrderError("Sepetinizdeki bazı ürünler artık satışta değil. Lütfen sepetinizi güncelleyin.");
        }
        if (quantity > MAX_QTY_PER_ITEM) {
          throw new OrderError(`"${product.name}" için en fazla ${MAX_QTY_PER_ITEM} adet sipariş verilebilir.`);
        }
        if (product.stock < quantity) {
          throw new OrderError(
            product.stock > 0
              ? `"${product.name}" için stokta sadece ${product.stock} adet kaldı.`
              : `"${product.name}" stokta kalmadı.`
          );
        }
        subtotal += toKurus(product.price) * quantity;
        lines.push({ productId, name: product.name, quantity, unitPrice: product.price });
      }

      // 2. Kuponu kilitle ve doğrula
      let coupon: typeof coupons.$inferSelect | undefined;
      if (data.couponCode) {
        [coupon] = await tx
          .select()
          .from(coupons)
          .where(eq(coupons.code, normalizeCouponCode(data.couponCode)))
          .for("update");
        const problem = couponProblem(coupon);
        if (problem) throw new OrderError(problem);
      }

      const totals = computeOrderTotals(subtotal, data.paymentMethod, coupon);

      // 3. Stok düş (koşullu: eşzamanlı başka bir sipariş stoğu tükettiyse satır güncellenmez)
      for (const line of lines) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.quantity}`, updatedAt: new Date() })
          .where(and(eq(products.id, line.productId), gte(products.stock, line.quantity)))
          .returning({ id: products.id });
        if (updated.length === 0) throw new OrderError("Stok bilgisi değişti. Lütfen sepetinizi kontrol edip tekrar deneyin.");
      }

      // 4. Kupon kullanım sayısını artır (limit hâlâ aşılmamışsa)
      if (coupon) {
        const used = await tx
          .update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(and(eq(coupons.id, coupon.id), or(isNull(coupons.usageLimit), lt(coupons.usedCount, coupons.usageLimit))))
          .returning({ id: coupons.id });
        if (used.length === 0) throw new OrderError("Bu kuponun kullanım limiti dolmuş.");
      }

      // 5. Siparişi ve kalemlerini veritabanı fiyatlarıyla yaz
      const [order] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          totalAmount: fromKurus(totals.total),
          couponCode: coupon?.code ?? null,
          discountAmount: fromKurus(totals.couponDiscount + totals.bankTransferDiscount),
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          status: data.paymentMethod === "havale" ? "pending" : "confirmed", // havale ödeme bekler, kapıda ödeme onaylanır
          paymentId: data.paymentMethod,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          quantity: line.quantity,
          price: line.unitPrice,
        }))
      );

      return { orderId: order.id, totalAmount: fromKurus(totals.total), lines };
    });

    await notifyShop({
      subject: `🛒 Yeni Sipariş #${result.orderId} — ${result.totalAmount} ₺`,
      title: `Yeni sipariş #${result.orderId}`,
      rows: [
        ["Müşteri", data.shippingAddress.fullName],
        ["Telefon", data.shippingAddress.phone],
        ["Adres", `${data.shippingAddress.fullAddress}\n${data.shippingAddress.district} / ${data.shippingAddress.city}`],
        ["Ödeme", data.paymentMethod === "havale" ? "Havale / EFT (ödeme bekleniyor)" : "Kapıda ödeme"],
        ["Ürünler", result.lines.map((l) => `${l.quantity} × ${l.name}`).join("\n")],
        ["Kupon", data.couponCode],
        ["Toplam", `${result.totalAmount} ₺`],
      ],
      customerPhone: data.shippingAddress.phone,
      customerMessage: `Merhaba ${data.shippingAddress.fullName}, Telefon Mühendisi'nden yazıyoruz. #${result.orderId} numaralı siparişiniz hakkında:`,
      adminPath: "/tmkontrols/siparisler",
    });

    return { success: true, orderId: result.orderId, totalAmount: result.totalAmount };
  } catch (error) {
    if (error instanceof OrderError || error instanceof AuthzError) {
      return { success: false, error: error.message };
    }
    console.error("Order creation error:", error);
    return { success: false, error: "Sipariş oluşturulamadı. Lütfen daha sonra tekrar deneyin." };
  }
}
