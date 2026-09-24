"use server";

import { db } from "@/lib/db";
import { repairs, users, auditLogs } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { claimFor, requireAdmin, requireRepairAccess } from "@/lib/authz";
import { parsePrice } from "@/lib/repair-status";
import { transitionRepair } from "@/lib/repairs/transition";

export async function updateRepairStatus(repairId: number, status: string) {
  const { user, repair } = await requireRepairAccess(repairId, { staffOnly: true });

  await transitionRepair({
    repair,
    actor: "staff",
    userId: user.id,
    to: status,
    set: claimFor(user, repair),
    audit: {
      action: "UPDATE_REPAIR_STATUS",
      details: `Tamir #${repairId} durumu '${repair.status}' → '${status}' olarak güncellendi.`,
    },
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

  const offered = parsePrice(price);
  if (!offered) throw new Error("Geçerli bir fiyat girin.");

  const notes = `${repair.notes || ""}\n[YÖNETİM]: Müşteriye yeni fiyat teklifi sunuldu: ${offered} ₺`.trim();

  // Yeni teklif, önceki kesinleşmiş fiyatı geçersiz kılar; müşteri onaylayınca yeniden kesinleşir.
  await transitionRepair({
    repair,
    actor: "staff",
    userId: user.id,
    to: "awaiting_customer_approval",
    set: { estimatedPrice: offered, finalPrice: null, notes, ...claimFor(user, repair) },
    systemMessage: `Fiyat teklifi sunuldu: ${offered} ₺. Müşteri onayı bekleniyor.`,
    audit: { action: "OFFER_PRICE", details: `Tamir #${repairId} için ${offered} ₺ fiyat teklifi sunuldu.` },
  });

  revalidatePath("/tmkontrols/tamirler");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  return { success: true };
}
