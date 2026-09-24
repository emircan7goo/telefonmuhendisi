"use server";

import { db } from "@/lib/db";
import { repairs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicTrackingStatus(code: string) {
  try {
    if (!code) return { success: false, error: "Takip kodu boş olamaz." };

    // Extract numbers from code (e.g., "TM-1" -> 1, "1" -> 1)
    const match = code.match(/\d+/);
    if (!match) {
      return { success: false, error: "Geçersiz takip kodu biçimi. Örnek: TM-1" };
    }
    
    const repairId = parseInt(match[0]);
    const repair = await db.query.repairs.findFirst({
      where: eq(repairs.id, repairId)
    });

    if (!repair) {
      return { success: false, error: "Bu takip koduna ait bir cihaz kaydı bulunamadı." };
    }

    const stages = [
      { id: 1, label: "Kargo Teslim Alındı", status: "completed", date: new Date(repair.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' }), description: "Cihaz laboratuvarımıza ulaştı ve kayıt açıldı." },
      { id: 2, label: "Arıza Tespiti", status: "upcoming", description: "Mikroskop altında anakart ölçümleri ve teşhis süreci." },
      { id: 3, label: "Ameliyat Masasında", status: "upcoming", description: "Telefon Mühendisi bizzat cihazınızın onarımını gerçekleştiriyor." },
      { id: 4, label: "Test Ediliyor", status: "upcoming", description: "Tüm fonksiyonlar Apple Diagnostik araçlarıyla test ediliyor." },
      { id: 5, label: "Teslim Edildi", status: "upcoming", description: "İlk günkü gibi çalışan cihazınız teslim edildi." },
    ];

    const status = repair.status;
    let currentIdx = 0;
    if (status === "pending") {
      currentIdx = 0;
    } else if (status === "diagnosing") {
      currentIdx = 1;
    } else if (status === "awaiting_customer_approval" || status === "customer_counter_offer" || status === "in_progress") {
      currentIdx = 2;
    } else if (status === "completed") {
      currentIdx = 3;
    } else if (status === "shipped" || status === "delivered") {
      currentIdx = 4;
    }

    // Dynamic stage updates
    for (let i = 0; i < stages.length; i++) {
      if (i < currentIdx) {
        stages[i].status = "completed" as const;
      } else if (i === currentIdx) {
        if (status === "customer_counter_offer" || status === "awaiting_customer_approval") {
          stages[i].status = "error" as const;
          stages[i].description = "Fiyat Onayı Bekleniyor: Cihazın işleme başlanması için müşteri onayı beklenmektedir.";
        } else {
          stages[i].status = "current" as const;
          if (repair.notes) {
            stages[i].description = repair.notes;
          }
        }
      } else {
        stages[i].status = "upcoming" as const;
      }
    }

    return {
      success: true,
      deviceModel: repair.deviceModel,
      stages
    };
  } catch (error: any) {
    console.error("Public tracking query error:", error);
    return { success: false, error: "Bir sistem hatası oluştu." };
  }
}
