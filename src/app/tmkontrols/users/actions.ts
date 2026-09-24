"use server";

import { db } from "@/lib/db";
import { users, sessions, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function verifyGodMode() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Sadece sistem yöneticileri (God Mode) bu işlemi yapabilir.");
  }
  return session.user;
}

export async function banUser(userId: string) {
  const admin = await verifyGodMode();
  await db.update(users).set({ role: "banned" }).where(eq(users.id, userId));
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "BAN_USER",
    target: userId,
    details: "Kullanıcı kalıcı olarak yasaklandı ve oturumu sonlandırıldı."
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}

export async function kickUser(userId: string) {
  const admin = await verifyGodMode();
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "KICK_USER",
    target: userId,
    details: "Kullanıcının mevcut oturumu zorla kapatıldı."
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}

export async function changeRole(userId: string, newRole: "admin" | "technician" | "customer") {
  const admin = await verifyGodMode();
  await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "CHANGE_ROLE",
    target: userId,
    details: `Kullanıcı yetkisi '${newRole}' olarak güncellendi.`
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}

export async function setOverridePassword(userId: string, newPassword: string) {
  const admin = await verifyGodMode();
  await db.update(users).set({ overridePassword: newPassword }).where(eq(users.id, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "SET_OVERRIDE_PASSWORD",
    target: userId,
    details: "Yönetici tarafından açık metin şifre ataması yapıldı."
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const admin = await verifyGodMode();
  // Önce oturumları sil
  await db.delete(sessions).where(eq(sessions.userId, userId));
  // Kullanıcıyı tamamen sil
  await db.delete(users).where(eq(users.id, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "DELETE_USER",
    target: userId,
    details: "Kullanıcı veritabanından kalıcı olarak silindi."
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}
