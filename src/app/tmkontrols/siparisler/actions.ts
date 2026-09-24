"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Güvenlik: Sadece yetkili personelin erişimini sağlar
const checkAdmin = async () => {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Yetkisiz erişim: Bu işlem için Admin yetkisi gereklidir.");
  }
};

export async function updateOrderStatus(orderId: number, status: string) {
  await checkAdmin();
  try {
    await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    revalidatePath("/tmkontrols/siparisler");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
