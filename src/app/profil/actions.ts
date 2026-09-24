"use server";

import { db } from "@/lib/db";
import { repairs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authz";
import { acceptedStatusFor, parsePrice } from "@/lib/repair-status";
import { transitionRepair } from "@/lib/repairs/transition";

const REPAIR_DISCOUNT_CODE = "telefonmuhendisi";
const REPAIR_DISCOUNT_RATE = 0.1;

async function requireOwnRepair(repairId: number) {
  const user = await requireUser();
  if (!Number.isInteger(repairId)) throw new Error("Geçersiz tamir numarası.");

  const repair = await db.query.repairs.findFirst({ where: eq(repairs.id, repairId) });
  if (!repair) throw new Error("Tamir kaydı bulunamadı.");
  if (repair.userId !== user.id) throw new Error("Yetkisiz İşlem: Bu kayıt size ait değil!");
  return { user, repair };
}

/**
 * Müşteri personelin sunduğu teklifi kabul eder. Fiyat her zaman sunucudaki
 * teklif (estimatedPrice) üzerinden hesaplanır; müşteri sadece indirim kodu gönderebilir.
 */
export async function acceptRepairPrice(repairId: number, discountCode?: string) {
  const { user, repair } = await requireOwnRepair(repairId);

  const quoted = repair.estimatedPrice;
  if (!quoted) throw new Error("Bu tamir için henüz bir fiyat teklifi yok.");

  const useDiscount = discountCode?.trim().toLowerCase() === REPAIR_DISCOUNT_CODE;
  const finalPrice = useDiscount ? (Number(quoted) * (1 - REPAIR_DISCOUNT_RATE)).toFixed(2) : quoted;
  const notes = useDiscount
    ? `${repair.notes || ""}\n[SİSTEM]: %10 İndirim Kodu Uygulandı (${REPAIR_DISCOUNT_CODE}). Orijinal Teklif: ${quoted} ₺`.trim()
    : repair.notes;

  await transitionRepair({
    repair,
    actor: "customer",
    userId: user.id,
    to: acceptedStatusFor(repair.repairType),
    set: { finalPrice, notes },
    systemMessage: `Müşteri ${finalPrice} ₺ teklifini onayladı.${useDiscount ? " (%10 indirim kodu uygulandı)" : ""}`,
    audit: {
      action: "ACCEPT_REPAIR_PRICE",
      details: `Tamir #${repairId} fiyatı kabul edildi: ${finalPrice} ₺.${useDiscount ? " İndirim kodu kullanıldı." : ""}`,
    },
  });

  revalidatePath("/profil");
  revalidatePath("/takip");
  revalidatePath("/tmkontrols/tamirler");
  return { success: true };
}

/**
 * Müşteri karşı teklif sunar. Karşı teklif SADECE not/mesaj olarak kaydedilir;
 * teklif fiyatına (estimatedPrice) dokunulmaz. Personel kabul ederse yeni teklif
 * olarak tekrar sunar, müşteri de onu onaylar.
 */
export async function counterOfferRepairPrice(repairId: number, counterPrice: string) {
  const { user, repair } = await requireOwnRepair(repairId);

  const counter = parsePrice(counterPrice);
  if (!counter) throw new Error("Lütfen geçerli bir teklif girin.");

  const quoted = repair.estimatedPrice ? Number(repair.estimatedPrice) : null;
  if (quoted !== null && Number(counter) >= quoted) {
    throw new Error("Karşı teklifiniz mevcut tekliften düşük olmalıdır. Mevcut teklifi doğrudan onaylayabilirsiniz.");
  }

  const notes = `${repair.notes || ""}\n[PAZARLIK]: Müşteri karşı teklif sundu: ${counter} ₺ (Mevcut teklif: ${repair.estimatedPrice} ₺)`.trim();

  await transitionRepair({
    repair,
    actor: "customer",
    userId: user.id,
    to: "customer_counter_offer",
    set: { notes },
    systemMessage: `Müşteri karşı teklif sundu: ${counter} ₺ (Mevcut teklif: ${repair.estimatedPrice} ₺). Yetkili incelemesi bekleniyor.`,
    audit: { action: "COUNTER_OFFER", details: `Tamir #${repairId} için müşteri ${counter} ₺ karşı teklif sundu.` },
  });

  revalidatePath("/profil");
  revalidatePath("/tmkontrols/tamirler");
  return { success: true };
}
