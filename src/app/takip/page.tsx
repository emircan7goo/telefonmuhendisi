"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Microscope, 
  Wrench, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  Camera, 
  Lock, 
  User, 
  Plus, 
  Loader2, 
  ShoppingBag, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  MapPin, 
  CreditCard 
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CustomerChatBox } from "./CustomerChatBox";
import { CustomerStatusActions } from "./CustomerStatusActions";
import { repairStatusMeta } from "@/lib/repair-status";

type Repair = {
  id: number;
  deviceModel: string;
  issueDescription: string;
  status: string;
  repairType: string;
  estimatedPrice: string | null;
  finalPrice: string | null;
  notes: string | null;
  repairImage: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: any[];
};

type Order = {
  id: number;
  status: string;
  totalAmount: string;
  shippingAddress: any;
  createdAt: string;
};

const STAGES = [
  { title: "Talep & Fiyat", icon: Package, desc: "Talebiniz alındı, ön teklif bekleniyor/onaylandı." },
  { title: "Kargo & Teslimat", icon: Truck, desc: "Cihazınız kargoda veya merkezimize ulaştı." },
  { title: "Net Arıza Tespiti", icon: Microscope, desc: "Cihaz fiziksel olarak inceleniyor." },
  { title: "Ameliyatta (Masada)", icon: Wrench, desc: "Onarım işlemi titizlikle sürüyor.", hasPhoto: true },
  { title: "Teslim / Tamamlandı", icon: CheckCircle2, desc: "İşlem bitti, cihaz size gönderildi veya teslim edildi." }
];

const getStatusIndex = (status: string) => repairStatusMeta(status).stage;

const getStatusBadge = (status: string) => {
  const meta = repairStatusMeta(status);
  return { text: meta.customerLabel, color: meta.badge };
};

function TakipPageContent() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"repairs" | "orders">("repairs");
  const [repairsList, setRepairsList] = useState<Repair[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [expandedRepairId, setExpandedRepairId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");

  // Fetch user's data from API
  const fetchData = async (showLoading = true) => {
    if (!session) return;
    if (showLoading) setLoadingData(true);
    try {
      const res = await fetch("/api/user/repairs");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRepairsList(data.repairs || []);
      setOrdersList(data.orders || []);
      
      // Auto expand specific repair if code parameter exists, else expand first
      const codeId = codeParam ? parseInt(codeParam) : null;
      if (codeId && data.repairs && data.repairs.some((r: Repair) => r.id === codeId)) {
        setExpandedRepairId(codeId);
      } else if (data.repairs && data.repairs.length > 0 && !expandedRepairId) {
        setExpandedRepairId(data.repairs[0].id);
      }
    } catch {
      toast.error("Verileriniz yüklenirken bir sorun oluştu.");
    } finally {
      if (showLoading) setLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData(true);
    }
  }, [status]);



  // Auth Status Loading Screen
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold text-sm">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Not Logged In - Gateway UI
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center">
        <div className="container mx-auto px-6 max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 text-center"
          >
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Oturum Açmanız Gerekiyor</h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
              Telefon Mühendisi servisindeki onarım süreçlerinizi canlı izlemek veya mağaza siparişlerinizi görüntülemek için lütfen hesabınıza giriş yapın.
            </p>

            <div className="flex flex-col gap-3">
              <Link 
                href={`/giris?callbackUrl=/takip`} 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/10"
              >
                Giriş Yap <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/kayit" 
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
              >
                Hesap Oluştur
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Onarım & Sipariş Takibi</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Giriş yaptınız. Cihazlarınızın anlık durumunu ve geçmiş siparişlerinizi buradan şeffafça takip edebilirsiniz.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex gap-1 shadow-sm">
            <button 
              onClick={() => setActiveTab("repairs")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-colors ${
                activeTab === "repairs" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              Cihaz Onarımlarım ({repairsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-colors ${
                activeTab === "orders" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              Siparişlerim ({ordersList.length})
            </button>
          </div>
        </div>

        {/* LOADING DATA SKELETON */}
        {loadingData && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white h-24 rounded-3xl border border-slate-200/60 animate-pulse" />
            ))}
          </div>
        )}

        {/* TAB CONTENTS */}
        {!loadingData && (
          <div className="space-y-6">
            
            {/* ── REPAIRS TAB ── */}
            {activeTab === "repairs" && (
              <>
                {repairsList.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 p-10 text-center rounded-3xl shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Cpu className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg mb-1">Onarımda Cihazınız Bulunmuyor</h3>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mb-6">
                      Sistemimizde kayıtlı bir onarım talebiniz görünmemektedir. Hemen yeni bir onarım kaydı oluşturmak için aşağıdaki butonu kullanabilirsiniz.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Link 
                        href="/tamir" 
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                      >
                        Yeni Tamir Talebi Oluştur
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repairsList.map(repair => {
                      const isExpanded = expandedRepairId === repair.id;
                      const badge = getStatusBadge(repair.status);
                      const currentStatusIndex = getStatusIndex(repair.status);

                      return (
                        <div 
                          key={repair.id}
                          className="bg-white border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden"
                        >
                          {/* Card Header (Expandable Toggle) */}
                          <div 
                            onClick={() => setExpandedRepairId(isExpanded ? null : repair.id)}
                            className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-mono font-black text-slate-400 block uppercase tracking-wider mb-1">Onarım Kodu: #TM-{repair.id}</span>
                              <h3 className="font-extrabold text-slate-900 text-base md:text-lg truncate">{repair.deviceModel}</h3>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{repair.issueDescription}</p>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black tracking-wide uppercase ${badge.color}`}>
                                {badge.text}
                              </span>
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                          </div>

                          {/* Card Body - Timeline and Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-slate-100 overflow-hidden bg-slate-50/20"
                              >
                                <div className="p-6 md:p-8 space-y-8">
                                  
                                  {/* Progress Visual Tracker */}
                                  <div className="relative pt-4 pb-4">
                                    {/* Line backgrounds */}
                                    {/* Mobile Line Background */}
                                    <div className="absolute top-0 bottom-0 left-[23px] w-1 bg-slate-100 rounded-full md:hidden" />
                                    {/* Desktop Line Background */}
                                    <div className="absolute top-[24px] left-0 right-0 h-1 bg-slate-100 rounded-full hidden md:block" />
                                    
                                    {/* Desktop Animated Line */}
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(currentStatusIndex / (STAGES.length - 1)) * 100}%` }}
                                      className="absolute top-[24px] left-0 h-1 bg-blue-600 rounded-full origin-left hidden md:block" 
                                      transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                    
                                    {/* Mobile Animated Line */}
                                    <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: `${(currentStatusIndex / (STAGES.length - 1)) * 100}%` }}
                                      className="absolute top-0 left-[23px] w-1 bg-blue-600 rounded-full origin-top md:hidden" 
                                      transition={{ duration: 1, ease: "easeOut" }}
                                    />

                                    {/* Steps */}
                                    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 relative z-10">
                                      {STAGES.map((stage, idx) => {
                                        const isCompleted = idx < currentStatusIndex;
                                        const isCurrent = idx === currentStatusIndex;
                                        const Icon = stage.icon;

                                        return (
                                          <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1 relative">
                                            {/* Step Circle */}
                                            <div className={`w-12 h-12 min-w-[3rem] min-h-[3rem] rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                              isCompleted ? "bg-blue-600 border-blue-100 text-white" : 
                                              isCurrent ? "bg-white border-blue-600 text-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" : 
                                              "bg-white border-slate-100 text-slate-300"
                                            }`}>
                                              <Icon className="w-5 h-5" />
                                            </div>

                                            {/* Step Title/Desc */}
                                            <div className="pt-1 md:pt-0 md:text-center text-left flex-1">
                                              <h4 className={`font-black text-sm mb-1 ${isCurrent || isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                                                {stage.title}
                                              </h4>
                                              <p className="text-[11px] text-slate-500 md:block leading-relaxed max-w-[150px] mx-auto">{stage.desc}</p>
                                              
                                              {/* Photo verification popup */}
                                              {isCurrent && stage.hasPhoto && (
                                                <motion.div 
                                                  initial={{ opacity: 0, scale: 0.95 }}
                                                  animate={{ opacity: 1, scale: 1 }}
                                                  className="mt-3 p-1.5 bg-white border border-slate-200 rounded-xl w-[180px] md:w-[200px] md:-ml-8 shadow-md relative group cursor-pointer"
                                                >
                                                  <img 
                                                    src={repair.repairImage || "https://images.unsplash.com/photo-1597740985671-2a8a3b8050ce?auto=format&fit=crop&q=80&w=300"} 
                                                    alt="Servis Masası" 
                                                    className="w-full h-20 object-cover rounded-lg" 
                                                  />
                                                  <p className="text-[10px] text-slate-500 font-bold text-center mt-1.5 flex items-center justify-center gap-1">
                                                    <Camera className="w-3.5 h-3.5 text-slate-400" /> Onarım Masası Canlı Kesit
                                                  </p>
                                                </motion.div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Detailed notes */}
                                  <div className="bg-white border border-slate-200/50 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">TEKNİSYEN NOTU</span>
                                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                        {repair.notes || "Cihazınız başarıyla laboratuvarımıza alınmıştır, arıza tespit süreci başlayacaktır."}
                                      </p>
                                    </div>
                                    <div className="w-full md:w-auto flex flex-col items-start md:items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 shrink-0">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">TAHMİNİ TUTAR</span>
                                      <span className="text-xl font-black text-slate-900 mt-1">
                                        {repair.finalPrice ? `${parseFloat(repair.finalPrice).toLocaleString("tr-TR")} ₺` : repair.estimatedPrice ? `${parseFloat(repair.estimatedPrice).toLocaleString("tr-TR")} ₺` : "Tespit Ediliyor..."}
                                      </span>
                                    </div>
                                  </div>

                                    {/* Actions for Status Workflow */}
                                    <CustomerStatusActions 
                                      repairId={repair.id} 
                                      status={repair.status} 
                                      repairType={repair.repairType}
                                      finalPrice={repair.finalPrice || repair.estimatedPrice} 
                                      onRefresh={() => fetchData(false)} 
                                    />

                                    {/* Chat Box */}
                                    <div className="bg-slate-100/50 border border-slate-200/50 rounded-2xl overflow-hidden mt-6 flex flex-col">
                                      <div className="p-4 border-b border-slate-200/50 bg-slate-100/80">
                                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                          <User className="w-4 h-4 text-blue-600" />
                                          Teknisyen ile İletişim
                                        </h4>
                                      </div>
                                      <div className="p-6 overflow-y-auto max-h-80 space-y-4 flex flex-col custom-scrollbar">
                                        {repair.messages?.map((msg: any) => {
                                          const isCustomer = msg.user?.role === "customer";
                                          return (
                                            <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-bold text-slate-500">{isCustomer ? 'Siz' : 'Teknisyen'}</span>
                                                <span className="text-[8px] font-mono text-slate-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                              </div>
                                              <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm ${isCustomer ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                                {msg.imageUrl && (
                                                  // eslint-disable-next-line @next/next/no-img-element
                                                  <img src={msg.imageUrl} alt="Chat Görseli" className="rounded-xl mb-2 max-h-48 object-cover" />
                                                )}
                                                {msg.message && <div>{msg.message}</div>}
                                              </div>
                                            </div>
                                          );
                                        })}
                                        {(!repair.messages || repair.messages.length === 0) && (
                                          <p className="text-center text-xs text-slate-400 font-medium py-4">Henüz bir mesaj bulunmuyor.</p>
                                        )}
                                      </div>
                                      <div className="p-4 bg-slate-50 border-t border-slate-200/50">
                                        <CustomerChatBox repairId={repair.id} onMessageSent={() => fetchData(false)} />
                                      </div>
                                    </div>

                                  </div>
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === "orders" && (
              <>
                {ordersList.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 p-10 text-center rounded-3xl shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg mb-1">Henüz Siparişiniz Bulunmuyor</h3>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mb-6">
                      Premium mağazamızdan satın aldığınız herhangi bir aksesuar veya kılıf bulunmamaktadır.
                    </p>
                    <Link 
                      href="/urunler" 
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      Mağazayı Keşfet
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordersList.map(order => (
                      <div 
                        key={order.id}
                        className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-black text-slate-400">Sipariş ID: #SP-{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              order.status === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              order.status === "shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {order.status === "delivered" ? "Teslim Edildi" :
                               order.status === "shipped" ? "Kargoda" : "Hazırlanıyor"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-2">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.shippingAddress?.city || "Kargo"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">ÖDENEN TUTAR</span>
                            <span className="text-lg font-black text-slate-900 mt-1 flex items-center gap-1">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              {parseFloat(order.totalAmount).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function TakipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold text-sm">Yükleniyor...</p>
        </div>
      </div>
    }>
      <TakipPageContent />
    </Suspense>
  );
}