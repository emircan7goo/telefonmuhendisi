import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { repairs, orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Fetch repairs for this user
    const repairsData = await db.query.repairs.findMany({
      where: eq(repairs.userId, userId),
      orderBy: [desc(repairs.createdAt)],
      with: {
        messages: {
          orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          with: { user: true }
        }
      }
    });

    // Fetch orders for this user
    const ordersData = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      repairs: repairsData,
      orders: ordersData,
    });
  } catch (error: any) {
    console.error("Failed to fetch user repairs/orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

