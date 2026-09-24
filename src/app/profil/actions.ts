"use server";

import { db } from "@/lib/db";
import { repairs, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function acceptRepairPrice(repairId: number, discountCode?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId)
  });

  if (!repair) throw new Error("Tamir kaydı bulunamadı.");
  if (repair.userId !== session.user.id) throw new Error("Yetkisiz İşlem: Bu kayıt size ait değil!");

  let finalPrice = repair.estimatedPrice;
  let notes = repair.notes || "";

  if (discountCode && discountCode.toLowerCase() === "telefonmuhendisi") {
    if (finalPrice) {
      const priceNum = parseFloat(finalPrice);
      if (!isNaN(priceNum)) {
        const discounted = (priceNum * 0.9).toFixed(2);
        finalPrice = discounted;
        notes = `${notes}\n[SİSTEM]: %10 İndirim Kodu Uygulandı (telefonmuhendisi). Orijinal Teklif: ${repair.estimatedPrice} ₺`.trim();
      }
    }
  }

  await db.update(repairs)
    .set({ 
      status: "in_progress", 
      finalPrice,
      notes,
      updatedAt: new Date() 
    })
    .where(eq(repairs.id, repairId));

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: "ACCEPT_REPAIR_PRICE",
    target: repairId.toString(),
    details: `Tamir #${repairId} fiyatı kabul edildi. ${discountCode === "telefonmuhendisi" ? "İndirim kodu kullanıldı." : ""}`
  });

  revalidatePath("/profil");
  revalidatePath("/tmkontrols/tamirler");
  return { success: true };
}

export async function counterOfferRepairPrice(repairId: number, counterPrice: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId)
  });

  if (!repair) throw new Error("Tamir kaydı bulunamadı.");
  if (repair.userId !== session.user.id) throw new Error("Yetkisiz İşlem: Bu kayıt size ait değil!");

  const oldPrice = repair.estimatedPrice;
  const notes = `${repair.notes || ""}\n[PAZARLIK]: Müşteri karşı teklif sundu: ${counterPrice} ₺ (Eski fiyat: ${oldPrice} ₺)`.trim();

  await db.update(repairs)
    .set({ 
      status: "customer_counter_offer", 
      estimatedPrice: counterPrice,
      notes,
      updatedAt: new Date() 
    })
    .where(eq(repairs.id, repairId));

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: "COUNTER_OFFER",
    target: repairId.toString(),
    details: `Tamir #${repairId} için müşteri ${counterPrice} ₺ karşı teklif sundu.`
  });

  revalidatePath("/profil");
  revalidatePath("/tmkontrols/tamirler");
  return { success: true };
}
