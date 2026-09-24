import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { repairMessages, repairs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { repairId, message, imageUrl } = await req.json();

    if (!repairId || (!message && !imageUrl)) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    const userId = session.user.id;

    // Verify ownership of the repair ticket
    const repair = await db.query.repairs.findFirst({
      where: and(eq(repairs.id, repairId), eq(repairs.userId, userId))
    });

    if (!repair) {
      return NextResponse.json({ error: "Bu işleme yetkiniz yok." }, { status: 403 });
    }

    const [newMsg] = await db.insert(repairMessages).values({
      repairId,
      userId,
      message: message || null,
      imageUrl: imageUrl || null,
    }).returning();

    // Trigger pusher event
    try {
      await pusherServer.trigger(`repair-${repairId}`, "new-message", newMsg);
    } catch (e) {
      console.error("Pusher error:", e);
    }

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
