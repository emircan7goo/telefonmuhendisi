"use server";

import { db } from "@/lib/db";
import { devicePurchases, notifications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail/smtp";
import { auth } from "@/auth";
import { contactUserColumns } from "@/lib/db/safe-columns";

export async function makeOffer(data: { id: number; price: number; notes: string }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return { success: false, error: "Yetkisiz erişim: Bu işlem için Admin yetkisi gereklidir." };
  }

  try {
    // Check if the purchase exists
    const purchase = await db.query.devicePurchases.findFirst({
      where: eq(devicePurchases.id, data.id),
      with: {
        user: { columns: contactUserColumns },
      }
    });

    if (!purchase) {
      return { success: false, error: "Talep bulunamadı." };
    }

    // Update the purchase status
    await db.update(devicePurchases)
      .set({
        status: "offered",
        offeredPrice: data.price.toString() as any, // Using string for decimal
        adminNotes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(devicePurchases.id, data.id));

    // Create Notification
    await db.insert(notifications).values({
      userId: purchase.userId,
      title: "Cihazınız İçin Teklifimiz Hazır! 🎉",
      message: `${purchase.brand} ${purchase.model} cihazınız için ${data.price.toLocaleString("tr-TR")} ₺ teklif verilmiştir.`,
      link: "/profil", // In real app, /profil/cihaz-sat-taleplerim
    });

    // Send Email
    if (purchase.user?.email) {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Talebiniz İncelendi!</h2>
          <p>Sayın ${purchase.user.name || "Müşterimiz"},</p>
          <p>Telefon Mühendisi'ne göndermiş olduğunuz <strong>${purchase.brand} ${purchase.model}</strong> marka/model cihazınız uzmanlarımızca incelenmiştir.</p>
          <p>Cihazınız için size sunabileceğimiz net nakit/takas teklifi:</p>
          <h1 style="color: #4f46e5; font-size: 36px;">${data.price.toLocaleString("tr-TR")} ₺</h1>
          ${data.notes ? `<p><strong>Uzman Notu:</strong> ${data.notes}</p>` : ''}
          <br/>
          <p>Teklifimizi değerlendirmek için hemen sitemize giriş yapın ve profilinize gidin!</p>
          <a href="http://localhost:3000/profil" style="padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Profilime Git</a>
        </div>
      `;

      await sendEmail({
        to: purchase.user.email,
        subject: "Cihazınız İçin Fiyat Teklifimiz Hazır! | Telefon Mühendisi",
        html: emailHtml,
      });
    }

    revalidatePath("/tmkontrols/cihaz-alim");
    return { success: true };
  } catch (err: any) {
    console.error("Make offer error:", err);
    return { success: false, error: "Teklif iletilirken bir hata oluştu." };
  }
}
