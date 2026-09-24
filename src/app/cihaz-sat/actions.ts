"use server";

import { db } from "@/lib/db";
import { devicePurchases } from "@/lib/db/schema";
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

    await db.insert(devicePurchases).values({
      userId: session.user.id,
      brand: formData.brand,
      model: formData.model,
      condition: formData.condition,
      images: formData.images,
      notes: formData.notes,
      status: "pending",
    });

    revalidatePath("/tmkontrols/cihaz-alim");
    return { success: true };
  } catch (error) {
    console.error("Device sale error:", error);
    return { success: false, error: "Talebiniz alınırken bir hata oluştu." };
  }
}
