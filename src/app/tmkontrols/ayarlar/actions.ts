"use server";

import { db } from "@/lib/db";
import { settings, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { normalizeEmail } from "@/lib/email";
import { normalizeTrPhone } from "@/lib/contact";

export async function saveSettings(formData: {
  siteTitle: string;
  contactPhone: string;
  maintenanceMode: string;
  notifyEmail: string;
  defaultTechnicianEmail: string;
}) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return { success: false, error: "Yetkisiz erişim." };
    }

    const notifyEmail = normalizeEmail(formData.notifyEmail);
    const defaultTechnicianEmail = normalizeEmail(formData.defaultTechnicianEmail);
    const looksLikeEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!looksLikeEmail(notifyEmail) || !looksLikeEmail(defaultTechnicianEmail)) {
      return { success: false, error: "Lütfen geçerli bir e-posta adresi girin." };
    }
    if (formData.contactPhone && !normalizeTrPhone(formData.contactPhone)) {
      return { success: false, error: "İletişim numarası geçerli bir Türkiye cep/sabit numarası olmalı (örn. 0544 945 64 17)." };
    }

    // Array of key value pairs
    const pairs = [
      { key: "siteTitle", value: formData.siteTitle },
      { key: "contactPhone", value: formData.contactPhone },
      { key: "maintenanceMode", value: formData.maintenanceMode },
      { key: "notifyEmail", value: notifyEmail },
      { key: "defaultTechnicianEmail", value: defaultTechnicianEmail },
    ];

    for (const pair of pairs) {
      // Upsert logic manually since we are using basic insert
      const existing = await db.query.settings.findFirst({
        where: eq(settings.key, pair.key)
      });

      if (existing) {
        await db.update(settings)
          .set({ value: pair.value, updatedAt: new Date() })
          .where(eq(settings.key, pair.key));
      } else {
        await db.insert(settings).values({
          key: pair.key,
          value: pair.value
        });
      }
    }

    // Log the audit
    await db.insert(auditLogs).values({
      userId: admin.id,
      action: "UPDATE_SETTINGS",
      target: "settings_table",
      details: "Sistem ayarları güncellendi.",
    });

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Settings error:", error);
    return { success: false, error: error.message || "Ayarlar kaydedilirken hata oluştu." };
  }
}
