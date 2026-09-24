import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { repairs, repairMessages } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const repairId = parseInt(id);
    if (isNaN(repairId)) return new NextResponse("Invalid ID", { status: 400 });

    const body = await request.json();
    const { status, finalPrice, customerTrackingCode } = body;

    const repair = await db.query.repairs.findFirst({
      where: eq(repairs.id, repairId)
    });

    if (!repair) return new NextResponse("Not Found", { status: 404 });

    const userId = (session.user as any).id || "system";
    const isAdmin = (session.user as any).role === "admin";
    if (!isAdmin && repair.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateData: any = {};
    
    // Sadece admin fiyatı güncelleyebilir veya durumu belli statülere çekebilir
    if (isAdmin) {
      if (status) updateData.status = status;
      if (finalPrice !== undefined) updateData.finalPrice = finalPrice.toString();
    } else {
      // Müşterinin yetkileri
      if (status === "customer_agreed" && repair.status === "negotiating") {
         updateData.status = "customer_agreed";
      } else if (status === "shipped_to_shop" && repair.status === "customer_agreed") {
         updateData.status = "shipped_to_shop";
      } else if (status === "cancelled" && ["pending", "pending_quote", "negotiating"].includes(repair.status)) {
         updateData.status = "cancelled";
      }

      if (customerTrackingCode && updateData.status === "shipped_to_shop") {
         updateData.customerTrackingCode = customerTrackingCode;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new NextResponse("No valid fields to update or lacking permissions", { status: 400 });
    }

    const updatedRepair = await db.update(repairs)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(repairs.id, repairId))
      .returning();

    // Sistem mesajı oluştur
    if (status) {
      let systemMessageText = "";
      if (status === "negotiating" && finalPrice) systemMessageText = `Teknisyen fiyat teklifini güncelledi: ${finalPrice} TL`;
      else if (status === "customer_agreed") systemMessageText = "Müşteri teklifi onayladı. Kargo bekleniyor.";
      else if (status === "shipped_to_shop") systemMessageText = `Müşteri cihazı kargoya verdi. (Takip: ${customerTrackingCode || 'Belirtilmedi'})`;
      else if (status === "received_by_shop") systemMessageText = "Cihaz servise ulaştı. Onarım başlıyor.";
      else if (status === "pending_payment") systemMessageText = "Onarım tamamlandı. Ödeme bekleniyor.";
      else if (status === "completed") systemMessageText = "Süreç tamamlandı. Cihaz kargolanıyor/teslim ediliyor.";

      if (systemMessageText) {
        await db.insert(repairMessages).values({
          repairId,
          userId,
          message: `[SİSTEM]: ${systemMessageText}`,
        });
      }
    }

    return NextResponse.json(updatedRepair[0]);
  } catch (error) {
    console.error("[STATUS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
