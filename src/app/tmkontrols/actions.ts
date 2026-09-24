"use server";

import { db } from "@/lib/db";
import { orders, repairs } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function getAdminNotifications() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") return { orders: 0, repairs: 0 };

  try {
    const ordersResult = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'pending'));
    const repairsResult = await db.select({ count: sql<number>`count(*)` }).from(repairs).where(eq(repairs.status, 'pending'));

    return {
      orders: Number(ordersResult[0]?.count || 0),
      repairs: Number(repairsResult[0]?.count || 0)
    };
  } catch (error) {
    console.error(error);
    return { orders: 0, repairs: 0 };
  }
}
