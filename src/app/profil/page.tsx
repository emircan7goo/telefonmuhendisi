import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders, repairs, orderItems, products, notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Package, Wrench, User, LogOut, ChevronRight, Truck, Settings, ShieldAlert, Bell } from "lucide-react";
import Link from "next/link";
import { FloatingUI } from "@/components/ui/FloatingUI";
import { signOut } from "@/auth";
import { RepairAcceptButton } from "./RepairAcceptButton";
import { normalizeRepairStatus, repairStatusMeta } from "@/lib/repair-status";
import { CustomerChat } from "@/components/ui/CustomerChat";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/giris");
  }

  const userId = session.user.id;
  if (!userId) {
    redirect("/giris");
  }

  // Fetch user orders with their items
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true
        }
      }
    }
  });

  // Fetch user repairs
  const userRepairs = await db.query.repairs.findMany({
    where: eq(repairs.userId, userId),
    orderBy: [desc(repairs.createdAt)],
  });

  // Fetch notifications safely
  let userNotifications: any[] = [];
  try {
    userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });
  } catch (e) {
    // Migration might not be run yet
  }

  // Status map for UI
  const orderStatusMap: Record<string, { label: string, color: string }> = {
    "pending": { label: "Ödeme Bekliyor", color: "text-amber-600 bg-amber-50" },
    "confirmed": { label: "Onaylandı", color: "text-blue-600 bg-blue-50" },
    "processing": { label: "Hazırlanıyor", color: "text-indigo-600 bg-indigo-50" },
    "shipped": { label: "Kargoya Verildi", color: "text-emerald-600 bg-emerald-50" },
    "delivered": { label: "Teslim Edildi", color: "text-slate-600 bg-slate-100" },
    "cancelled": { label: "İptal Edildi", color: "text-red-600 bg-red-50" },
  };


  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-slate-50">
      <FloatingUI />
      
      <div className="container-custom max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/20">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{session.user.name || "Değerli Müşterimiz"}</h2>
                  <p className="text-sm text-slate-500 font-medium">{(session.user as any).phone || session.user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="#siparisler" className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 font-bold transition-colors">
                  <div className="flex items-center gap-3"><Package className="w-5 h-5"/> Siparişlerim</div>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#tamirler" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-colors">
                  <div className="flex items-center gap-3"><Wrench className="w-5 h-5"/> Tamir Süreçlerim</div>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#ayarlar" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-colors">
                  <div className="flex items-center gap-3"><Settings className="w-5 h-5"/> Hesap Ayarları</div>
                  <ChevronRight className="w-4 h-4" />
                </a>
                {["admin", "technician"].includes((session.user as any).role) && (
                  <Link href="/tmkontrols" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-indigo-700 font-bold transition-colors">
                    <div className="flex items-center gap-3"><ShieldAlert className="w-5 h-5"/> Yönetim Paneli</div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>

              <hr className="my-6 border-slate-100" />
              
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors">
                  <LogOut className="w-5 h-5" /> Çıkış Yap
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Bildirimler Section */}
            {userNotifications.length > 0 && (
              <section id="bildirimler" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-amber-500" /> Bildirimler
                </h2>
                <div className="space-y-3">
                  {userNotifications.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-xl border ${notif.isRead ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-200'} flex items-start gap-4`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-200 text-slate-500' : 'bg-amber-200 text-amber-600'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-2">{notif.createdAt.toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Orders Section */}
            <section id="siparisler" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" /> Siparişlerim
              </h2>
              
              {userOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Henüz Siparişiniz Yok</h3>
                  <p className="text-slate-500 mb-6">Mühendis onaylı premium ürünlerimizi keşfetmek ister misiniz?</p>
                  <Link href="/urunler" className="inline-flex px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">
                    Mağazayı Gez
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            Sipariş No: #{order.id.toString().padStart(6, '0')}
                          </p>
                          <p className="text-sm text-slate-600 font-medium">
                            {order.createdAt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(parseFloat(order.totalAmount as any))}
                          </p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${orderStatusMap[order.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                            {orderStatusMap[order.status]?.label || order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 shrink-0">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 line-clamp-1">{item.product?.name || "Bilinmeyen Ürün"}</h4>
                              <p className="text-sm text-slate-500 font-medium">{item.quantity} Adet</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-blue-50/50 p-4 rounded-xl">
                          <div className="flex items-center gap-3 text-blue-800 font-medium">
                            <Truck className="w-5 h-5 text-blue-600" /> Kargo Takip No:
                          </div>
                          <span className="font-black text-blue-900 tracking-wider">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Repairs Section */}
            <section id="tamirler" className="scroll-mt-32 pt-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-indigo-600" /> Tamir Süreçlerim
              </h2>

              {userRepairs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Serviste Cihazınız Yok</h3>
                  <p className="text-slate-500 mb-6">Arızalı bir cihazınız varsa ücretsiz ön fiyatlandırma alabilirsiniz.</p>
                  <Link href="/tamir" className="inline-flex px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md">
                    Tamir Talebi Oluştur
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userRepairs.map(repair => (
                    <div key={repair.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-200 transition-colors group relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                            Talep #{repair.id.toString().padStart(5, '0')}
                          </p>
                          <h4 className="font-bold text-slate-900 text-lg">{repair.deviceModel}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${repairStatusMeta(repair.status).badge}`}>
                          {repairStatusMeta(repair.status).customerLabel}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {repair.issueDescription}
                      </p>

                      {/* Fiyat Onay Kısmı */}
                      {normalizeRepairStatus(repair.status) === "awaiting_customer_approval" && repair.estimatedPrice && (
                        <RepairAcceptButton repairId={repair.id} price={repair.estimatedPrice} />
                      )}

                      {/* Onaylanmış Kargo veya WhatsApp Mesajı */}
                      {normalizeRepairStatus(repair.status) === "customer_agreed" && repair.repairType === "cargo" && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="text-xs font-black uppercase text-slate-400 mb-1">Kargo Gönderim Bilgileri</div>
                          <div className="text-sm font-medium text-slate-700">Firma: <span className="font-bold">Yurtiçi Kargo</span></div>
                          <div className="text-sm font-medium text-slate-700">Alıcı: <span className="font-bold">Semih İletişim</span></div>
                          <div className="text-sm font-medium text-slate-700 mt-1">Anlaşma Kodu: <span className="text-blue-600 font-black">123 456 789</span></div>
                        </div>
                      )}

                      {(repair.status === "in_progress" || repair.status === "completed") && repair.repairType === "remote" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="text-xs font-black uppercase text-green-600 mb-1">Uzaktan Bağlantı İle Onarım</div>
                          <p className="text-sm font-medium text-green-800 mb-3">Yazılım onarımı için lütfen bilgisayarınıza geçin ve teknisyenimize bağlanın.</p>
                          <a href="https://wa.me/905449456417?text=Merhaba,%20yazılım%20işlemim%20için%20hazırım." target="_blank" rel="noreferrer" className="inline-block w-full text-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 rounded-lg transition-colors">
                            WhatsApp'tan Ulaşın
                          </a>
                        </div>
                      )}

                      {/* Müşteri ↔ Teknisyen mesajlaşma */}
                      <CustomerChat repairId={repair.id} currentUserId={userId} />

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-500">
                          {repair.createdAt.toLocaleDateString('tr-TR')}
                        </div>
                        <Link href={`/takip?code=${repair.id}`} className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                          Detay <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
