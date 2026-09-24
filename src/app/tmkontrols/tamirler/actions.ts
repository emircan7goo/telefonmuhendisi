"use server";

import { db } from "@/lib/db";
import { repairs, users, auditLogs } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { claimFor, requireAdmin, requireRepairAccess } from "@/lib/authz";

export async function updateRepairStatus(repairId: number, status: string) {
  const { user, repair } = await requireRepairAccess(repairId, { staffOnly: true });

  let finalPrice = repair.finalPrice;
  if ((status === "in_progress" || status === "completed") && !finalPrice && repair.estimatedPrice) {
    finalPrice = repair.estimatedPrice;
  }

  await db.update(repairs)
    .set({ status, finalPrice, ...claimFor(user, repair), updatedAt: new Date() })
    .where(eq(repairs.id, repairId));
  
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
  const user = await requireAdmin();

  const technician = await db.query.users.findFirst({
    where: and(eq(users.id, technicianId), eq(users.role, "technician")),
    columns: { id: true },
  });
  if (!technician) throw new Error("Geçerli bir teknisyen seçilmedi.");

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
  const { user, repair } = await requireRepairAccess(repairId, { staffOnly: true });

  const notes = `${repair.notes || ""}\n[YÖNETİM]: Müşteriye yeni fiyat teklifi sunuldu: ${price} ₺`.trim();

  await db.update(repairs)
    .set({ 
      estimatedPrice: price, 
      status: "awaiting_customer_approval", 
      notes,
      ...claimFor(user, repair),
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
