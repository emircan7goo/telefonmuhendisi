"use server";

import { db } from "@/lib/db";
import { repairs, repairMessages, auditLogs } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mail/smtp";
import { getRepairStatusUpdatedEmailHtml } from "@/lib/mail/templates";

export async function sendRepairMessage(repairId: number, message: string, imageUrl: string | null = null) {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "technician") {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }

  if (!message && !imageUrl) {
    throw new Error("Mesaj veya görsel boş olamaz.");
  }

  await db.insert(repairMessages).values({
    repairId,
    userId: session.user.id as string,
    message: message || null,
    imageUrl: imageUrl || null,
  });

  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  return { success: true };
}

export async function updateRepairDetails(repairId: number, data: {
  status: string;
  notes: string;
  finalPrice: string;
  partsCost: string;
  laborCost: string;
  repairImage: string | null;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "technician") {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }

  const { status, notes, finalPrice, partsCost, repairImage } = data;

  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId),
    with: { user: true }
  });
  if (!repair) throw new Error("Tamir kaydı bulunamadı.");

  const finalPriceNum = parseFloat((finalPrice || "0").toString().replace(",", ".")) || 0;
  const partsCostNum = parseFloat((partsCost || "0").toString().replace(",", ".")) || 0;
  const cargoCostNum = repair.repairType === "cargo" ? 150 : 0;
  const remainingProfit = finalPriceNum - partsCostNum - cargoCostNum;
  const calculatedLabor = remainingProfit > 0 ? (remainingProfit / 2).toString() : "0";

  await db.update(repairs)
    .set({
      status,
      notes: notes || null,
      estimatedPrice: finalPrice ? finalPrice : null,
      finalPrice: finalPrice ? finalPrice : null,
      partsCost: partsCost ? partsCost : null,
      laborCost: calculatedLabor,
      repairImage: repairImage || null,
      updatedAt: new Date()
    })
    .where(eq(repairs.id, repairId));

  // Log to audit logs
  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: "UPDATE_REPAIR_DETAILS",
    target: repairId.toString(),
    details: `Tamir #${repairId} detayları güncellendi. Durum: ${status}, Fiyat: ${finalPrice || 0}₺`
  });

  // Send Email Notification if status changed
  if (repair.status !== status && repair.user?.email) {
    let statusTr = status;
    if (status === "in_progress") statusTr = "Parça Bekleniyor / İşlemde";
    if (status === "completed") statusTr = "Onarım Tamamlandı";
    if (status === "cancelled") statusTr = "İptal Edildi";
    if (status === "pending") statusTr = "İnceleniyor";

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
