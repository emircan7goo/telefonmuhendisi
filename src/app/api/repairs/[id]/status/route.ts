import { NextResponse } from "next/server";
import { AuthzError, claimFor, requireRepairAccess } from "@/lib/authz";
import { RepairTransitionError, acceptedStatusFor, normalizeRepairStatus, parsePrice } from "@/lib/repair-status";
import { transitionRepair, type RepairUpdate } from "@/lib/repairs/transition";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairId = parseInt(id);
    if (isNaN(repairId)) return new NextResponse("Invalid ID", { status: 400 });

    const { user, repair } = await requireRepairAccess(repairId);
    const isStaff = user.role === "admin" || user.role === "technician";

    const body = await request.json().catch(() => ({}));
    let status = typeof body.status === "string" ? body.status : "";
    if (!status) return NextResponse.json({ error: "Durum belirtilmedi." }, { status: 400 });

    if (isStaff) {
      const set: RepairUpdate = { ...claimFor(user, repair) };
      if (body.finalPrice !== undefined && body.finalPrice !== null && body.finalPrice !== "") {
        const price = parsePrice(body.finalPrice);
        if (!price) return NextResponse.json({ error: "Geçersiz fiyat." }, { status: 400 });
        set.finalPrice = price;
      }

      const updated = await transitionRepair({
        repair,
        actor: "staff",
        userId: user.id,
        to: status,
        set,
        audit: { action: "UPDATE_REPAIR_STATUS", details: `Tamir #${repairId} durumu '${repair.status}' → '${status}'.` },
      });
      return NextResponse.json(updated);
    }

    // Müşteri: sadece kendi tamiri (requireRepairAccess) ve sadece makinedeki müşteri geçişleri.
    // Fiyat, not vb. alanlar müşteriden asla alınmaz.
    const set: RepairUpdate = {};
    const current = normalizeRepairStatus(repair.status);

    if (current === "awaiting_customer_approval" && (status === "customer_agreed" || status === "in_progress")) {
      // Kabul sonrası durum tamir tipine göre sunucuda belirlenir; fiyat sunucudaki tekliftir.
      if (!repair.estimatedPrice) return NextResponse.json({ error: "Henüz fiyat teklifi yok." }, { status: 400 });
      status = acceptedStatusFor(repair.repairType);
      set.finalPrice = repair.estimatedPrice;
    } else if (status === "shipped_to_shop") {
      if (repair.repairType !== "cargo") {
        return NextResponse.json({ error: "Bu tamir kargo ile gönderim için oluşturulmadı." }, { status: 400 });
      }
      const code = typeof body.customerTrackingCode === "string" ? body.customerTrackingCode.trim().slice(0, 64) : "";
      if (code) set.customerTrackingCode = code;
    } else if (status === "customer_counter_offer") {
      // Karşı teklif fiyat içerdiği için sadece counterOfferRepairPrice action'ı üzerinden yapılabilir.
      return NextResponse.json({ error: "Karşı teklif bu uç noktadan gönderilemez." }, { status: 400 });
    }

    const updated = await transitionRepair({
      repair,
      actor: "customer",
      userId: user.id,
      to: status,
      set,
      audit: { action: "CUSTOMER_REPAIR_STATUS", details: `Tamir #${repairId} müşteri tarafından '${status}' durumuna alındı.` },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof RepairTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[STATUS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
