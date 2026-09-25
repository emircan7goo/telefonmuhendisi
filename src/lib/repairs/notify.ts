import { db } from "@/lib/db";
import { repairs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyShop } from "@/lib/notify";
import { REPAIR_STATUS_META, repairTypeLabel, type RepairStatus } from "@/lib/repair-status";

type RepairRow = typeof repairs.$inferSelect;

const CUSTOMER_EVENT_TITLES: Partial<Record<RepairStatus, string>> = {
  customer_agreed: "✅ Müşteri teklifi onayladı",
  in_progress: "✅ Müşteri teklifi onayladı",
  customer_counter_offer: "🤝 Müşteri karşı teklif sundu",
  shipped_to_shop: "📦 Müşteri cihazı kargoya verdi",
  cancelled: "❌ Müşteri tamir talebini iptal etti",
};

/** Formdaki "İletişim: 5xx..." satırından telefonu çıkarır (kayıtta telefon yoksa yedek). */
function phoneFromDescription(description: string): string | null {
  return description.match(/İletişim:\s*([+\d\s]+)/)?.[1]?.trim() || null;
}

async function customerContact(repair: RepairRow) {
  const customer = await db.query.users.findFirst({
    where: eq(users.id, repair.userId),
    columns: { name: true, phone: true, email: true },
  });
  return {
    name: customer?.name || "Müşteri",
    email: customer?.email,
    phone: phoneFromDescription(repair.issueDescription) || customer?.phone || null,
  };
}

/** Yeni tamir talebi → dükkan sahibine e-posta (+ müşteriye WhatsApp butonu). */
export async function notifyNewRepair(repair: RepairRow, extra: { issueName: string; details?: string; photoCount: number }) {
  try {
    const c = await customerContact(repair);
    await notifyShop({
      subject: `🔧 Yeni Tamir Talebi #${repair.id} — ${repair.deviceModel}`,
      title: `Yeni tamir talebi #${repair.id}`,
      rows: [
        ["Müşteri", c.name],
        ["Telefon", c.phone],
        ["E-posta", c.email],
        ["Cihaz", repair.deviceModel],
        ["Arıza", extra.issueName],
        ["Teslimat", repairTypeLabel(repair.repairType)],
        ["Liste fiyatı", repair.estimatedPrice ? `${repair.estimatedPrice} ₺` : "Belirlenecek"],
        ["Detay", extra.details],
        ["Fotoğraf", extra.photoCount ? `${extra.photoCount} adet (panelde sohbet bölümünde)` : null],
      ],
      customerPhone: c.phone,
      customerMessage: `Merhaba ${c.name}, Telefon Mühendisi'nden yazıyoruz. ${repair.deviceModel} için oluşturduğunuz #${repair.id} numaralı tamir talebinizle ilgili:`,
      adminPath: `/tmkontrols/tamirler/${repair.id}`,
    });
  } catch (err) {
    console.error("[notify] yeni tamir bildirimi:", err);
  }
}

/** Müşterinin kendi yaptığı durum değişiklikleri → dükkan sahibine e-posta. */
export async function notifyCustomerRepairEvent(repair: RepairRow, to: RepairStatus) {
  const title = CUSTOMER_EVENT_TITLES[to];
  if (!title) return;
  try {
    const c = await customerContact(repair);
    const lastNote = repair.notes?.split("\n").filter(Boolean).pop();
    await notifyShop({
      subject: `${title} — Tamir #${repair.id}`,
      title: `${title} (#${repair.id})`,
      rows: [
        ["Müşteri", c.name],
        ["Telefon", c.phone],
        ["Cihaz", repair.deviceModel],
        ["Teslimat", repairTypeLabel(repair.repairType)],
        ["Yeni durum", REPAIR_STATUS_META[to].label],
        ["Teklif", repair.estimatedPrice ? `${repair.estimatedPrice} ₺` : null],
        ["Kesin fiyat", repair.finalPrice ? `${repair.finalPrice} ₺` : null],
        ["Kargo takip", repair.customerTrackingCode],
        ["Son not", to === "customer_counter_offer" ? lastNote : null],
      ],
      customerPhone: c.phone,
      customerMessage: `Merhaba ${c.name}, Telefon Mühendisi'nden yazıyoruz. #${repair.id} numaralı tamiriniz hakkında:`,
      adminPath: `/tmkontrols/tamirler/${repair.id}`,
    });
  } catch (err) {
    console.error("[notify] müşteri tamir olayı bildirimi:", err);
  }
}
