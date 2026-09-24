import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders, repairs } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import SidebarNav from "./SidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !["admin", "technician"].includes((session.user as any).role)) {
    redirect("/tmkontrols-giris");
  }

  const role = (session.user as any).role;
  const isAdmin = role === "admin";
  const userName = (session.user as any).name || session.user?.email || "Kullanıcı";

  let pendingOrders = 0;
  let pendingRepairs = 0;

  const [ordersResult, repairsResult] = await Promise.all([
    isAdmin
      ? db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "pending"))
      : Promise.resolve([{ count: 0 }]),
    db.select({ count: sql<number>`count(*)` }).from(repairs).where(eq(repairs.status, "pending")),
  ]);

  pendingOrders = Number(ordersResult[0]?.count || 0);
  pendingRepairs = Number(repairsResult[0]?.count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 selection:bg-blue-600 selection:text-white">
      {/* SidebarNav handles: desktop sidebar + mobile header + mobile drawer + mobile bottom nav */}
      <SidebarNav
        isAdmin={isAdmin}
        pendingOrders={pendingOrders}
        pendingRepairs={pendingRepairs}
        userName={userName}
        userRole={role}
      />

      {/* Main content */}
      <main className="
        lg:ml-[260px]
        pt-14 lg:pt-0
        pb-20 lg:pb-0
        min-h-screen flex flex-col
      ">
        {/* Desktop top header */}
        <header className="hidden lg:flex h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100/80 items-center justify-between px-8 sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div>
            <h1 className="text-lg font-black text-slate-900">
              {isAdmin ? "Yönetim Merkezi" : "Teknisyen Portalı"}
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Hoş geldin {userName} — {isAdmin ? "sistem şu an kusursuz çalışıyor." : "bugün de mükemmel onarımlar seni bekliyor."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Siteyi Görüntüle ↗
            </a>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/tmkontrols-giris" });
            }}>
              <button
                type="submit"
                className="text-xs font-bold text-slate-500 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                Çıkış
              </button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
