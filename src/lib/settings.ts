import { db } from "@/lib/db";

/** Admin panelinden yönetilen anahtarlar (settings tablosu). */
export type ShopSettingKey =
  | "siteTitle"
  | "contactPhone"
  | "maintenanceMode"
  | "notifyEmail"
  | "defaultTechnicianEmail";

/** Ayarları okur; DB hatasında boş döner (bildirim/atama gibi yan işler ana akışı bozmasın). */
export async function getShopSettings(): Promise<Partial<Record<ShopSettingKey, string>>> {
  try {
    const rows = await db.query.settings.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch (err) {
    console.warn("[settings] okunamadı:", (err as Error).message);
    return {};
  }
}
