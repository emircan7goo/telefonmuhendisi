"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/authz";

export async function updateOrderStatus(orderId: number, status: string) {
  await requireAdmin();
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
