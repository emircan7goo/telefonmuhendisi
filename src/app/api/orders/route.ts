import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  // Tüm siparişler müşteri bilgisi içerir — sadece admin görebilir
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
    });
    return NextResponse.json(allOrders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
