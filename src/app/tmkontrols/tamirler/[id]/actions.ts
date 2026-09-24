"use server";

import { db } from "@/lib/db";
import { repairs, repairMessages, auditLogs } from "@/lib/db/schema";
import { claimFor, requireRepairAccess } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mail/smtp";
import { getRepairStatusUpdatedEmailHtml } from "@/lib/mail/templates";
import { contactUserColumns } from "@/lib/db/safe-columns";
import { REPAIR_STATUS_META, normalizeRepairStatus, parsePrice, parseRepairStatus } from "@/lib/repair-status";
import { transitionRepair } from "@/lib/repairs/transition";

export async function sendRepairMessage(repairId: number, message: string, imageUrl: string | null = null) {
  const { user } = await requireRepairAccess(repairId, { staffOnly: true });

  if (!message && !imageUrl) {
    throw new Error("Mesaj veya görsel boş olamaz.");
  }

  await db.insert(repairMessages).values({
    repairId,
    userId: user.id,
    message: message || null,
    imageUrl: imageUrl || null,
  });

  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  return { success: true };
}

function parseCost(input: string | null | undefined): string | null {
  const raw = (input ?? "").toString().trim();
  if (!raw || Number(raw.replace(",", ".")) === 0) return null;
  const parsed = parsePrice(raw);
  if (!parsed) throw new Error("Tutarlar pozitif bir sayı olmalıdır.");
  return parsed;
}

export async function updateRepairDetails(repairId: number, data: {
  status: string;
  notes: string;
  finalPrice: string;
  partsCost: string;
  laborCost: string;
  repairImage: string | null;
}) {
  const { user } = await requireRepairAccess(repairId, { staffOnly: true });

  const { notes, repairImage } = data;

  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId),
    with: { user: { columns: contactUserColumns } }
  });
  if (!repair) throw new Error("Tamir kaydı bulunamadı.");

  const price = parseCost(data.finalPrice);
  const partsCost = parseCost(data.partsCost);
  const status = parseRepairStatus(data.status);
  if (!status) throw new Error("Geçersiz tamir durumu.");
  const statusChanged = status !== normalizeRepairStatus(repair.status);
  // Teklif aşamasında fiyat henüz kesinleşmedi; kesin fiyat müşteri onayıyla oluşur.
  const isQuoteStage = status === "awaiting_customer_approval" || status === "customer_counter_offer";

  const priceNum = price ? Number(price) : 0;
  const partsCostNum = partsCost ? Number(partsCost) : 0;
  const cargoCostNum = repair.repairType === "cargo" ? 150 : 0;
  const remainingProfit = priceNum - partsCostNum - cargoCostNum;
  const calculatedLabor = remainingProfit > 0 ? (remainingProfit / 2).toFixed(2) : "0";

  const fields = {
    notes: notes || null,
    estimatedPrice: price,
    finalPrice: isQuoteStage ? null : price,
    partsCost,
    laborCost: calculatedLabor,
    repairImage: repairImage || null,
    ...claimFor(user, repair),
  };
  const auditDetails = `Tamir #${repairId} detayları güncellendi. Durum: ${status}, Fiyat: ${price || 0}₺`;

  if (statusChanged || status === "awaiting_customer_approval") {
    // Aynı durumda "Müşteriye Sun" = yeni teklif; makine awaiting → awaiting geçişine izin verir.
    await transitionRepair({
      repair,
      actor: "staff",
      userId: user.id,
      to: status,
      set: fields,
      systemMessage: statusChanged
        ? undefined
        : price !== repair.estimatedPrice ? `Fiyat teklifi güncellendi: ${price} ₺. Müşteri onayı bekleniyor.` : null,
      audit: { action: "UPDATE_REPAIR_DETAILS", details: auditDetails },
    });
  } else {
    await db.update(repairs)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(repairs.id, repairId));

    await db.insert(auditLogs).values({
      userId: user.id,
      action: "UPDATE_REPAIR_DETAILS",
      target: repairId.toString(),
      details: auditDetails,
    });
  }

  // Send Email Notification if status changed
  if (statusChanged && repair.user?.email) {
    const statusTr = REPAIR_STATUS_META[status].customerLabel;

    const html = getRepairStatusUpdatedEmailHtml(
      repair.user.name || "Değerli Müşterimiz",
      repair.deviceModel,
      statusTr,
      notes || undefined
    );

    await sendEmail({
      to: repair.user.email,
      subject: `📱 Cihazınızın Durumu Güncellendi: ${statusTr}`,
      html: html
    });
  }

  revalidatePath("/tmkontrols", "layout");
  revalidatePath("/tmkontrols/tamirler");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  revalidatePath("/profil");
  revalidatePath("/takip");
  return { success: true };
}
