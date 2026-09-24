"use server";

import { db } from "@/lib/db";
import { repairs, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mail";
import { getRepairCreatedEmailHtml } from "@/lib/mail/templates";

export async function createRepairTicket(data: any) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!session || !userId) {
    return { success: false, error: "Lütfen önce giriş yapın." };
  }

  try {
    const deviceModelStr = `${data.brand?.name} ${data.model?.name}`;
    const issueDesc = `${data.issue?.name}\nDetay: ${data.details || 'Yok'}\nİletişim: ${data.phone}`;
    
    let rType = "instore";
    if (data.issue?.id === 'yazilimsal') {
      rType = data.deliveryMethod === 'uzaktan' ? 'remote' : 'cargo';
    } else {
      // Donanımsal işlemlerde varsayılan kargo (veya elden teslim)
      rType = 'cargo'; 
    }

    // Find yunus's user ID to auto-assign
    const yunus = await db.query.users.findFirst({
      where: eq(users.email, "yunuserbalta@gmail.com")
    });

    const [newRepair] = await db.insert(repairs).values({
      userId,
      technicianId: yunus?.id || null,
      deviceModel: deviceModelStr,
      issueDescription: issueDesc,
      status: "pending",
      repairType: rType,
      repairImage: null, // Tech will upload progress photo here later
      notes: "Müşteri paneli üzerinden oluşturuldu."
    }).returning({ id: repairs.id });

    // Eğer birden fazla fotoğraf yüklendiyse, bunları teknisyene mesaj olarak düş
    if (data.photos && data.photos.length > 0) {
      const messagesToInsert = data.photos.map((photoUrl: string) => ({
        repairId: newRepair.id,
        userId,
        message: "Müşteri tarafından yüklenen arıza görseli.",
        imageUrl: photoUrl
      }));
      
      const { repairMessages } = await import("@/lib/db/schema");
      await db.insert(repairMessages).values(messagesToInsert);
    }

    // Send Email Notification
    if (session?.user?.email) {
      const html = getRepairCreatedEmailHtml(
        session.user.name || "Değerli Müşterimiz",
        deviceModelStr,
        data.issue?.name || "Bilinmeyen Arıza"
      );
      await sendEmail({
        to: session.user.email,
        subject: "📱 Tamir Talebiniz Alındı | Telefon Mühendisi",
        html: html
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error("Repair ticket creation failed:", err);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }
}

