import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders, repairs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HesabimPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris");
  }

  // Fetch user's orders and repairs
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id as string),
    orderBy: [desc(orders.createdAt)],
    limit: 5,
  });

  const userRepairs = await db.query.repairs.findMany({
    where: eq(repairs.userId, session.user.id as string),
    orderBy: [desc(repairs.createdAt)],
    limit: 5,
  });

  return (
    <div className="min-h-screen bg-zinc-50/30 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">Hesabım</h1>
          <p className="text-slate-500">Hoş geldin, {session.user.name || session.user.email || "Değerli Müşterimiz"}.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">{session.user.name || "Kullanıcı"}</div>
                  <div className="text-sm text-slate-500 truncate max-w-[150px]">{session.user.email}</div>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 bg-zinc-50 text-zinc-900 rounded-xl font-medium">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Genel Bakış
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-600 rounded-xl font-medium transition-colors">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Siparişlerim
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-600 rounded-xl font-medium transition-colors">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Tamir Kayıtlarım
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-600 rounded-xl font-medium transition-colors">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Çıkış Yap
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Repairs Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900">Aktif Tamir Süreçleri</h2>
                <Link href="/tamir" className="text-sm font-medium text-primary-600 hover:text-primary-700">Yeni Talep</Link>
              </div>

              {userRepairs.length > 0 ? (
                <div className="space-y-4">
                  {userRepairs.map((repair) => (
                    <div key={repair.id} className="p-4 border border-zinc-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="font-semibold text-zinc-900">{repair.deviceModel}</div>
                        <div className="text-sm text-slate-500">Kayıt: {repair.createdAt.toLocaleDateString('tr-TR')}</div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                          İşlemde
                        </span>
                        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Detay</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <p className="text-slate-500 mb-4">Aktif bir cihaz tamir kaydınız bulunmuyor.</p>
                  <Link href="/tamir" className="inline-flex items-center justify-center h-10 px-6 font-medium bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
                    Tamir Talebi Oluştur
                  </Link>
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900">Son Siparişler</h2>
                <Link href="/urunler" className="text-sm font-medium text-primary-600 hover:text-primary-700">Alışverişe Devam Et</Link>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="p-4 border border-zinc-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="font-semibold text-zinc-900">Sipariş #{order.id}</div>
                        <div className="text-sm text-slate-500">{order.createdAt.toLocaleDateString('tr-TR')}</div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="font-bold text-zinc-900">{order.totalAmount} ₺</div>
                        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Fatura Al</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <p className="text-slate-500 mb-4">Henüz hiç sipariş vermediniz.</p>
                  <Link href="/urunler" className="inline-flex items-center justify-center h-10 px-6 font-medium bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
                    Ürünleri İncele
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
