"use server";

import { db } from "@/lib/db";
import { repairs, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function verifyAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "technician") {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }
  return session.user;
}

export async function updateRepairStatus(repairId: number, status: string) {
  const user = await verifyAuth();
  
  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId)
  });

  if (!repair) throw new Error("Kayıt bulunamadı.");

  let finalPrice = repair.finalPrice;
  if ((status === "in_progress" || status === "completed") && !finalPrice && repair.estimatedPrice) {
    finalPrice = repair.estimatedPrice;
  }

  await db.update(repairs).set({ status, finalPrice, updatedAt: new Date() }).where(eq(repairs.id, repairId));
  
  await db.insert(auditLogs).values({
    userId: user.id as string,
    action: "UPDATE_REPAIR_STATUS",
    target: repairId.toString(),
    details: `Tamir #${repairId} durumu '${status}' olarak güncellendi.`
  });

  revalidatePath("/tmkontrols/tamirler");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  return { success: true };
}

export async function assignTechnician(repairId: number, technicianId: string) {
  const user = await verifyAuth();
  
  await db.update(repairs).set({ technicianId, updatedAt: new Date() }).where(eq(repairs.id, repairId));
  
  await db.insert(auditLogs).values({
    userId: user.id as string,
    action: "ASSIGN_TECHNICIAN",
    target: repairId.toString(),
    details: `Tamir #${repairId} için teknisyen atandı.`
  });

  revalidatePath("/tmkontrols/tamirler");
  return { success: true };
}

export async function offerPrice(repairId: number, price: string) {
  const user = await verifyAuth();
  
  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId)
  });

  if (!repair) throw new Error("Kayıt bulunamadı.");

  const notes = `${repair.notes || ""}\n[YÖNETİM]: Müşteriye yeni fiyat teklifi sunuldu: ${price} ₺`.trim();

  await db.update(repairs)
    .set({ 
      estimatedPrice: price, 
      status: "awaiting_customer_approval", 
      notes,
      updatedAt: new Date() 
    })
    .where(eq(repairs.id, repairId));
  
  await db.insert(auditLogs).values({
    userId: user.id as string,
    action: "OFFER_PRICE",
    target: repairId.toString(),
    details: `Tamir #${repairId} için ${price} ₺ fiyat teklifi sunuldu.`
  });

  revalidatePath("/tmkontrols/tamirler");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  return { success: true };
}
