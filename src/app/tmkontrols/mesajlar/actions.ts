"use server";

import { db } from "@/lib/db";
import { repairMessages, repairs } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function sendInboxMessage(repairId: number, message: string, imageUrl: string | null = null) {
  const session = await auth();
  if (!session?.user) throw new Error("Oturum bulunamadı.");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "technician") {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }

  if (!message && !imageUrl) {
    throw new Error("Mesaj veya görsel boş olamaz.");
  }

  // Save the chat message
  await db.insert(repairMessages).values({
    repairId,
    userId: session.user.id as string,
    message: message || null,
    imageUrl: imageUrl || null,
  });

  // Touch the repair record's updatedAt timestamp to bump it in sorting
  await db.update(repairs)
    .set({ updatedAt: new Date() })
    .where(eq(repairs.id, repairId));

  revalidatePath("/tmkontrols/mesajlar");
  revalidatePath(`/tmkontrols/tamirler/${repairId}`);
  revalidatePath("/takip");
  return { success: true };
}
