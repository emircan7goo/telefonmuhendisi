"use server";

import { db } from "@/lib/db";
import { users, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Sadece Sistem Yöneticisi yetkisine sahiptir.");
  }
  return session.user;
}

export async function createTechnician(name: string, email: string, password: string) {
  const admin = await verifyAdmin();

  // Check if email exists
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    throw new Error("Bu e-posta adresi zaten kullanımda.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const [newUser] = await db.insert(users).values({
    name,
    email,
    passwordHash: hashedPassword,
    role: "technician",
  }).returning();

  await db.insert(auditLogs).values({
    userId: admin.id,
    action: "CREATE_TECHNICIAN",
    target: newUser.id,
    details: `${name} isimli yeni teknisyen kadroya eklendi.`
  });

  revalidatePath("/tmkontrols/teknisyenler");
  return { success: true };
}
