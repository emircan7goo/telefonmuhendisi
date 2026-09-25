"use server";

import { db } from "@/lib/db";
import { devicePurchases, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyShop } from "@/lib/notify";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitDeviceSale(formData: {
  brand: string;
  model: string;
  condition: string;
  images: string[];
  notes?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Lütfen önce giriş yapınız." };
    }

    if (!formData.images || formData.images.length < 3) {
      return { success: false, error: "Lütfen cihazın en az 3 farklı açıdan fotoğrafını yükleyin." };
    }

    const [sale] = await db.insert(devicePurchases).values({
      userId: session.user.id,
      brand: formData.brand,
      model: formData.model,
      condition: formData.condition,
      images: formData.images,
      notes: formData.notes,
      status: "pending",
    }).returning({ id: devicePurchases.id });

    const seller = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { name: true, phone: true, email: true },
    });
    await notifyShop({
      subject: `📲 Yeni Cihaz Satış Talebi #${sale.id} — ${formData.brand} ${formData.model}`,
      title: `Yeni cihaz satış talebi #${sale.id}`,
      rows: [
        ["Müşteri", seller?.name],
        ["Telefon", seller?.phone],
        ["E-posta", seller?.email],
        ["Cihaz", `${formData.brand} ${formData.model}`],
        ["Durum", formData.condition],
        ["Not", formData.notes],
        ["Fotoğraf", `${formData.images.length} adet (panelde)`],
      ],
      customerPhone: seller?.phone,
      customerMessage: `Merhaba ${seller?.name || ""}, Telefon Mühendisi'nden yazıyoruz. ${formData.brand} ${formData.model} cihazınız için satış talebiniz hakkında:`,
      adminPath: "/tmkontrols/cihaz-alim",
    });

    revalidatePath("/tmkontrols/cihaz-alim");
    return { success: true };
  } catch (error) {
    console.error("Device sale error:", error);
    return { success: false, error: "Talebiniz alınırken bir hata oluştu." };
  }
}
