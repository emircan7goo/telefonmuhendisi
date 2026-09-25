"use server";

import { db } from "@/lib/db";
import { repairs, repairMessages, users } from "@/lib/db/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { requireUser, AuthzError } from "@/lib/authz";
import { sendEmail } from "@/lib/mail";
import { getRepairCreatedEmailHtml } from "@/lib/mail/templates";
import { DEVICE_DATABASE } from "@/data/devices";
import { normalizeTrPhone, formatTrPhone } from "@/lib/contact";
import { getShopSettings } from "@/lib/settings";
import { normalizeEmail } from "@/lib/email";
import { userEmailEquals } from "@/lib/db/user-email";
import { notifyNewRepair } from "@/lib/repairs/notify";
import type { RepairType } from "@/lib/repair-status";

/** Kullanıcı başına saatlik en fazla talep (spam koruması). */
const MAX_TICKETS_PER_HOUR = 5;
const MAX_PHOTOS = 6;
// Eski varsayılan: panelde "Varsayılan Teknisyen" ayarı yoksa bu hesaba atanır (teknisyense).
const LEGACY_DEFAULT_TECHNICIAN_EMAIL = "yunuserbalta@gmail.com";

const DELIVERY_TO_REPAIR_TYPE: Record<string, RepairType> = {
  magaza: "instore",
  kargo: "cargo",
  uzaktan: "remote",
};

const photoSchema = z
  .string()
  .max(1_500_000)
  .refine((v) => v.startsWith("https://") || /^data:image\/(jpeg|png|webp);base64,/.test(v), "Geçersiz görsel");

// Sihirbaz tüm marka/model/arıza nesnesini gönderiyor; sadece id'lere ve
// (listede olmayan model için) girilen model adına güveniyoruz.
const ticketSchema = z.object({
  brand: z.object({ id: z.string().max(64) }).passthrough(),
  model: z.object({ id: z.string().max(128), name: z.string().trim().max(100) }).passthrough(),
  issue: z.object({ id: z.string().max(32) }).passthrough(),
  deliveryMethod: z.string().max(16).optional(),
  details: z.string().trim().max(2000).optional().default(""),
  phone: z.string().max(32),
  photos: z.array(photoSchema).max(MAX_PHOTOS).optional().default([]),
});

async function defaultTechnicianId(): Promise<string | null> {
  const settings = await getShopSettings();
  const email = normalizeEmail(
    settings.defaultTechnicianEmail || process.env.DEFAULT_TECHNICIAN_EMAIL || LEGACY_DEFAULT_TECHNICIAN_EMAIL
  );
  if (!email) return null;
  const tech = await db.query.users.findFirst({
    where: and(userEmailEquals(email), eq(users.role, "technician")),
    columns: { id: true },
  });
  return tech?.id ?? null;
}

export async function createRepairTicket(input: unknown) {
  try {
    const user = await requireUser();

    const parsed = ticketSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Talep bilgileri eksik veya hatalı. Lütfen formu kontrol edin." };
    }
    const data = parsed.data;

    const phone = normalizeTrPhone(data.phone);
    if (!phone) return { success: false, error: "Lütfen geçerli bir cep telefonu numarası girin." };

    // Cihaz ve arıza bilgisi istemciden değil, sunucudaki cihaz veritabanından alınır.
    const brand = DEVICE_DATABASE.find((b) => b.id === data.brand.id);
    // Bazı modeller aynı id'yi paylaşıyor (ör. "Redmi Note 13 Pro" / "Pro+"): önce id + ad ile eşleştir.
    const model =
      brand?.models.find((m) => m.id === data.model.id && m.name === data.model.name) ??
      brand?.models.find((m) => m.id === data.model.id);
    const repairOption = model?.repairs.find((r) => r.id === data.issue.id);
    if (!brand || !model || !repairOption) {
      return { success: false, error: "Seçilen cihaz veya arıza bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin." };
    }

    // "Listede olmayan model" akışında kullanıcı model adını kendisi yazar.
    const isCustomModel = data.model.name !== model.name;
    const modelName = isCustomModel ? data.model.name : model.name;
    if (!modelName) return { success: false, error: "Lütfen cihaz modelini girin." };
    const deviceModelStr = brand.id === "diger" ? modelName : `${brand.name} ${modelName}`;

    const isSoftware = repairOption.id === "yazilimsal";
    let repairType: RepairType = DELIVERY_TO_REPAIR_TYPE[data.deliveryMethod ?? ""] ?? "instore";
    if (repairType === "remote" && !isSoftware) repairType = "instore"; // donanım uzaktan onarılamaz

    // Sihirbazda gösterilen liste fiyatı ön teklif olarak kaydedilir (listede olmayan modelde fiyat yok).
    const listPrice = !isCustomModel && brand.id !== "diger" ? repairOption.price.toFixed(2) : null;

    const since = new Date(Date.now() - 60 * 60 * 1000);
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(repairs)
      .where(and(eq(repairs.userId, user.id), gte(repairs.createdAt, since)));
    if (recent >= MAX_TICKETS_PER_HOUR) {
      return { success: false, error: "Kısa sürede çok fazla talep oluşturdunuz. Lütfen bir süre sonra tekrar deneyin veya bize WhatsApp'tan yazın." };
    }

    const issueDesc = `${repairOption.name}\nDetay: ${data.details || "Yok"}\nİletişim: ${formatTrPhone(phone)}`;

    const [newRepair] = await db.insert(repairs).values({
      userId: user.id,
      technicianId: await defaultTechnicianId(),
      deviceModel: deviceModelStr,
      issueDescription: issueDesc,
      status: "pending",
      repairType,
      estimatedPrice: listPrice,
      repairImage: null, // Teknisyen onarım fotoğrafını sonra yükler
      notes: "Müşteri paneli üzerinden oluşturuldu.",
    }).returning();

    // Müşterinin yüklediği fotoğraflar teknisyene sohbet mesajı olarak düşer
    if (data.photos.length > 0) {
      await db.insert(repairMessages).values(
        data.photos.map((photoUrl) => ({
          repairId: newRepair.id,
          userId: user.id,
          message: "Müşteri tarafından yüklenen arıza görseli.",
          imageUrl: photoUrl,
        }))
      );
    }

    await notifyNewRepair(newRepair, { issueName: repairOption.name, details: data.details, photoCount: data.photos.length });

    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "📱 Tamir Talebiniz Alındı | Telefon Mühendisi",
        html: getRepairCreatedEmailHtml(user.name || "Değerli Müşterimiz", deviceModelStr, repairOption.name),
      });
    }

    return { success: true, repairId: newRepair.id };
  } catch (err) {
    if (err instanceof AuthzError) return { success: false, error: "Lütfen önce giriş yapın." };
    console.error("Repair ticket creation failed:", err);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }
}
