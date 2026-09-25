import { db } from "@/lib/db";
import { repairs, repairMessages, auditLogs } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import {
  PRICE_LOCKING_STATUSES,
  PRICE_REQUIRED_STATUSES,
  RepairTransitionError,
  assertTransition,
  normalizeRepairStatus,
  repairStatusSystemMessage,
  type RepairActor,
  type RepairStatus,
} from "@/lib/repair-status";
import { notifyCustomerRepairEvent } from "@/lib/repairs/notify";

type RepairRow = typeof repairs.$inferSelect;
export type RepairUpdate = Partial<typeof repairs.$inferInsert>;

interface TransitionInput {
  repair: RepairRow;
  actor: RepairActor;
  userId: string;
  to: string;
  /** Durumla birlikte yazılacak ek alanlar (fiyat, not, takip kodu...) */
  set?: RepairUpdate;
  /** Sohbete düşülecek sistem mesajı; verilmezse durum için varsayılan mesaj kullanılır. null = mesaj yok */
  systemMessage?: string | null;
  audit?: { action: string; details: string };
}

/**
 * Tamir durumunu durum makinesine göre değiştirir.
 * - Geçiş aktöre (personel/müşteri) göre doğrulanır.
 * - Güncelleme, okunan durum hâlâ geçerliyse yapılır (eşzamanlı iki isteğin
 *   aynı geçişi iki kez uygulamasını engeller).
 */
export async function transitionRepair(input: TransitionInput): Promise<RepairRow> {
  const { repair, actor, userId, set = {} } = input;
  const to: RepairStatus = assertTransition(repair.status, input.to, actor);

  const estimatedPrice = set.estimatedPrice !== undefined ? set.estimatedPrice : repair.estimatedPrice;
  if (PRICE_REQUIRED_STATUSES.includes(to) && !estimatedPrice) {
    throw new RepairTransitionError("Müşteriye sunmadan önce geçerli bir fiyat teklifi girin.");
  }

  const values: RepairUpdate = { ...set, status: to, updatedAt: new Date() };
  const finalPrice = set.finalPrice !== undefined ? set.finalPrice : repair.finalPrice;
  if (PRICE_LOCKING_STATUSES.includes(to) && !finalPrice && estimatedPrice) {
    values.finalPrice = estimatedPrice;
  }

  const updatedRepair = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(repairs)
      .set(values)
      .where(and(eq(repairs.id, repair.id), eq(repairs.status, repair.status)))
      .returning();

    if (!updated) {
      throw new RepairTransitionError("Tamir kaydı bu sırada güncellendi. Lütfen sayfayı yenileyip tekrar deneyin.");
    }

    const message =
      input.systemMessage !== undefined
        ? input.systemMessage
        : normalizeRepairStatus(repair.status) === to
          ? null
          : repairStatusSystemMessage(to, { price: estimatedPrice, trackingCode: set.customerTrackingCode });
    if (message) {
      await tx.insert(repairMessages).values({ repairId: repair.id, userId, message: `[SİSTEM]: ${message}` });
    }

    if (input.audit) {
      await tx.insert(auditLogs).values({
        userId,
        action: input.audit.action,
        target: repair.id.toString(),
        details: input.audit.details,
      });
    }

    return updated;
  });

  // Müşteri aksiyon aldıysa (onay, karşı teklif, kargo, iptal) dükkan sahibine haber ver.
  if (actor === "customer") await notifyCustomerRepairEvent(updatedRepair, to);

  return updatedRepair;
}
