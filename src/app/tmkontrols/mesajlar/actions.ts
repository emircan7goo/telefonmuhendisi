"use server";

import { db } from "@/lib/db";
import { repairMessages, repairs } from "@/lib/db/schema";
import { claimFor, requireRepairAccess } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function sendInboxMessage(repairId: number, message: string, imageUrl: string | null = null) {
  const { user, repair } = await requireRepairAccess(repairId, { staffOnly: true });

  if (!message && !imageUrl) {
    throw new Error("Mesaj veya görsel boş olamaz.");
  }

  // Save the chat message
  await db.insert(repairMessages).values({
    repairId,
    userId: user.id,
    message: message || null,
    imageUrl: imageUrl || null,
  });

  // Touch the repair record's updatedAt timestamp to bump it in sorting
  await db.update(repairs)
    .set({ ...claimFor(user, repair), updatedAt: new Date() })
    .where(eq(repairs.id, repairId));

  revalidatePath("/tmkontrols/mesajlar");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  revalidatePath("/takip");
  return { success: true };
}
