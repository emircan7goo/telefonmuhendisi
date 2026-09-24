import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { repairMessages, repairs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher";
import { repairChannel } from "@/lib/pusher-channels";
import { canAccessRepair, getSessionUser } from "@/lib/authz";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const viewer = await getSessionUser();
    if (!viewer) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const repairId = parseInt(id);
    if (isNaN(repairId)) return new NextResponse("Invalid ID", { status: 400 });

    const repair = await db.query.repairs.findFirst({
      where: eq(repairs.id, repairId)
    });

    if (!repair) return new NextResponse("Not Found", { status: 404 });

    if (!canAccessRepair(viewer, repair)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const messages = await db.query.repairMessages.findMany({
      where: eq(repairMessages.repairId, repairId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)]
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const viewer = await getSessionUser();
    if (!viewer) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const repairId = parseInt(id);
    if (isNaN(repairId)) return new NextResponse("Invalid ID", { status: 400 });

    const body = await request.json();
    const { message, isSystemMessage } = body;

    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const repair = await db.query.repairs.findFirst({
      where: eq(repairs.id, repairId)
    });

    if (!repair) return new NextResponse("Not Found", { status: 404 });

    if (!canAccessRepair(viewer, repair)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const isAdmin = viewer.role === "admin";
    const userId = viewer.id;

    if (isSystemMessage && !isAdmin) {
       return new NextResponse("Sadece admin sistem mesajı atabilir.", { status: 403 });
    }

    const finalMessage = isSystemMessage ? `[SİSTEM]: ${message}` : message;

    const newMessage = await db.insert(repairMessages).values({
      repairId,
      userId,
      message: finalMessage,
    }).returning();

    // Trigger pusher event
    try {
      await pusherServer.trigger(repairChannel(repairId), "new-message", newMessage[0]);
    } catch (e) {
      console.error("Pusher error:", e);
    }

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
