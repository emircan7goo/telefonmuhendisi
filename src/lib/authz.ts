import { auth } from "@/auth";
import { db } from "@/lib/db";
import { repairs } from "@/lib/db/schema";
import { eq, isNull, or } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Merkezi yetkilendirme yardımcıları. Server action, route handler ve
 * server component'ler rol/sahiplik kontrolünü buradan yapmalı.
 */

export type AppRole = "admin" | "technician" | "customer";

export interface SessionUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
}

export class AuthzError extends Error {}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user as any;
  if (!user?.id || !user?.role || user.role === "banned") return null;
  return { id: user.id, role: user.role, name: user.name, email: user.email };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthzError("Oturum bulunamadı. Lütfen giriş yapın.");
  return user;
}

export async function requireRole(...roles: AppRole[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role as AppRole)) {
    throw new AuthzError("Bu işlemi yapmak için yetkiniz yok.");
  }
  return user;
}

export const requireAdmin = () => requireRole("admin");
export const requireStaff = () => requireRole("admin", "technician");

/** Sadece admin'e açık panel sayfaları için: teknisyeni ana ekrana yollar. */
export async function requireAdminPage(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/tmkontrols-giris");
  if (user.role !== "admin") redirect("/tmkontrols");
  return user;
}

type RepairOwnership = { userId: string; technicianId: string | null };

/**
 * Admin: tüm tamirler. Teknisyen: kendisine atanan veya henüz atanmamış tamirler.
 * Müşteri: sadece kendi tamirleri.
 */
export function canAccessRepair(user: SessionUser, repair: RepairOwnership): boolean {
  if (user.role === "admin") return true;
  if (user.role === "technician" && (repair.technicianId === user.id || repair.technicianId === null)) {
    return true;
  }
  return repair.userId === user.id;
}

/** Teknisyenin listeleyebileceği tamirler için where koşulu (admin için filtre yok). */
export function repairScopeFor(user: SessionUser) {
  if (user.role === "admin") return undefined;
  return or(eq(repairs.technicianId, user.id), isNull(repairs.technicianId));
}

/** Atanmamış bir tamirde işlem yapan teknisyen tamiri üstlenir. */
export function claimFor(user: SessionUser, repair: RepairOwnership): { technicianId?: string } {
  return user.role === "technician" && repair.technicianId === null ? { technicianId: user.id } : {};
}

export async function requireRepairAccess(repairId: number, opts: { staffOnly?: boolean } = {}) {
  const user = opts.staffOnly ? await requireStaff() : await requireUser();
  if (!Number.isInteger(repairId)) throw new AuthzError("Geçersiz tamir numarası.");

  const repair = await db.query.repairs.findFirst({ where: eq(repairs.id, repairId) });
  if (!repair) throw new AuthzError("Tamir kaydı bulunamadı.");
  if (!canAccessRepair(user, repair)) throw new AuthzError("Bu kayıt üzerinde yetkiniz yok.");

  return { user, repair };
}
