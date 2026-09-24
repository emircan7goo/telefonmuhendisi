"use server";

import { db } from "@/lib/db";
import { users, sessions, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { requestPasswordReset } from "@/app/(auth)/sifremi-unuttum/actions";

// users.updatedAt güvenlik damgası olarak kullanılır: bu tarihten önce açılmış
// oturumlar auth.ts içindeki jwt callback'inde geçersiz sayılır.

export async function banUser(userId: string) {
  const admin = await requireAdmin();
  await db.update(users).set({ role: "banned", updatedAt: new Date() }).where(eq(users.id, userId));
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
  const admin = await requireAdmin();
  await db.update(users).set({ updatedAt: new Date() }).where(eq(users.id, userId));
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
  const admin = await requireAdmin();
  if (!["admin", "technician", "customer"].includes(newRole)) {
    throw new Error("Geçersiz yetki tipi.");
  }
  await db.update(users).set({ role: newRole, updatedAt: new Date() }).where(eq(users.id, userId));
  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "CHANGE_ROLE",
    target: userId,
    details: `Kullanıcı yetkisi '${newRole}' olarak güncellendi.`
  });
  revalidatePath("/tmkontrols/users");
  return { success: true };
}

export async function sendPasswordResetLink(userId: string) {
  const admin = await requireAdmin();
  const target = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, email: true },
  });
  if (!target?.email) {
    throw new Error("Bu kullanıcının kayıtlı bir e-posta adresi yok.");
  }

  const result = await requestPasswordReset(target.email);
  if (!result.success) {
    throw new Error(result.error || "Sıfırlama bağlantısı gönderilemedi.");
  }

  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "SEND_PASSWORD_RESET",
    target: userId,
    details: "Yönetici tarafından şifre sıfırlama bağlantısı gönderildi."
  });
  return { success: true };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
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
