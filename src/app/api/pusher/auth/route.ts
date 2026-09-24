import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { repairs } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { REPAIR_CHANNEL_PREFIX } from "@/lib/pusher-channels";
import { canAccessRepair, getSessionUser } from "@/lib/authz";

/**
 * Pusher private kanal yetkilendirmesi. Sadece tamirin sahibi, admin ve
 * tamire erişimi olan teknisyen `private-repair-{id}` kanalına abone olabilir.
 */
export async function POST(req: Request) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const socketId = form.get("socket_id");
  const channelName = form.get("channel_name");
  if (typeof socketId !== "string" || typeof channelName !== "string") {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  if (!channelName.startsWith(REPAIR_CHANNEL_PREFIX)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const repairId = Number(channelName.slice(REPAIR_CHANNEL_PREFIX.length));
  if (!Number.isInteger(repairId) || repairId <= 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const repair = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId),
    columns: { userId: true, technicianId: true },
  });
  if (!repair || !canAccessRepair(viewer, repair)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(pusherServer.authorizeChannel(socketId, channelName));
}
