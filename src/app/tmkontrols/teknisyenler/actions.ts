"use server";

import { db } from "@/lib/db";
import { users, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/email";
import { userEmailEquals } from "@/lib/db/user-email";

export async function createTechnician(name: string, rawEmail: string, password: string) {
  const admin = await requireAdmin();
  const email = normalizeEmail(rawEmail);
  if (!email) throw new Error("Geçerli bir e-posta adresi girin.");

  // Check if email exists
  const existing = await db.query.users.findFirst({ where: userEmailEquals(email) });
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
