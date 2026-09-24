import { db } from "@/lib/db";
import { orders, repairs, users } from "@/lib/db/schema";
import { eq, desc, ne, gte, and } from "drizzle-orm";
import { 
  Activity, 
  CircleDollarSign, 
  Wrench, 
  Package, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Inbox,
  Sparkles,
  Percent
} from "lucide-react";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";
import Link from "next/link";
import AdminChartWrapper from "./AdminChartWrapper";

export const dynamic = "force-dynamic";

const REPAIR_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Beklemede", color: "bg-amber-100 text-amber-700" },
  diagnosing: { label: "Arıza Tespiti", color: "bg-blue-100 text-blue-700" },
  awaiting_customer_approval: { label: "Onay Bekliyor", color: "bg-purple-100 text-purple-700" },
  customer_counter_offer: { label: "Pazarlık", color: "bg-orange-100 text-orange-700" },
  awaiting_shipment: { label: "Kargo Bekleniyor", color: "bg-pink-100 text-pink-700" },
  shipped_to_shop: { label: "Kargoda", color: "bg-cyan-100 text-cyan-700" },
  in_progress: { label: "İşlemde", color: "bg-indigo-100 text-indigo-700" },
  completed: { label: "Tamamlandı", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-700" },
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const role = (session?.user as any)?.role || "customer";
  const isAdmin = role === "admin";
  const isTech = role === "technician";
  const currentUserId = session?.user?.id || "";

  // 1. Common Dashboard Data Boundaries
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // Helper to parse price strings with commas (e.g. "5000,00")
  const parsePrice = (val: any) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const s = val.toString().replace(",", ".");
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  // Default values
  let totalRevenue = 0;
  let totalPartsCost = 0;
  let totalLaborCost = 0;
  let totalCargoCost = 0;
  let netProfit = 0;
  let activeRepairs = 0;
  let newOrders = 0;
  let totalUsers = 0;
  let displayRecentRepairs: any[] = [];
  let displayRecentOrders: any[] = [];
  let allOrdersInPeriod: any[] = [];
  let allRepairsInPeriod: any[] = [];

  if (isAdmin) {
    // Admin Global Metrics - Fetch all concurrently via Promise.all
    const [
      recentOrders,
      recentRepairs,
      allOrders,
      allRepairs,
      activeRepairsResult,
      newOrdersResult,
      usersResult,
      ordersInPeriod,
      repairsInPeriod
    ] = await Promise.all([
      db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        limit: 5,
        with: { user: true }
      }),
      db.query.repairs.findMany({
        orderBy: [desc(repairs.createdAt)],
        limit: 5,
        with: { user: true }
      }),
      db.select({ totalAmount: orders.totalAmount }).from(orders).where(ne(orders.status, 'cancelled')),
      db.select({
        finalPrice: repairs.finalPrice,
        partsCost: repairs.partsCost,
        repairType: repairs.repairType,
        status: repairs.status
      }).from(repairs),
      db.select({ count: sql<number>`count(*)` }).from(repairs).where(ne(repairs.status, 'completed')),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(gte(orders.createdAt, yesterday)),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({
        id: orders.id,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt
      }).from(orders).where(
        and(
          ne(orders.status, 'cancelled'),
          gte(orders.createdAt, sixMonthsAgo)
        )
      ),
      db.select({
        id: repairs.id,
        status: repairs.status,
        finalPrice: repairs.finalPrice,
        partsCost: repairs.partsCost,
        laborCost: repairs.laborCost,
        repairType: repairs.repairType,
        technicianId: repairs.technicianId,
        createdAt: repairs.createdAt
      }).from(repairs).where(
        gte(repairs.createdAt, sixMonthsAgo)
      )
    ]);

    displayRecentOrders = recentOrders;
    displayRecentRepairs = recentRepairs;
    allOrdersInPeriod = ordersInPeriod;
    allRepairsInPeriod = repairsInPeriod;

    let orderRevenue = 0;
    for (const order of allOrders) {
      orderRevenue += parsePrice(order.totalAmount);
    }

    let repairRevenue = 0;
    let repairPartsCost = 0;
    let repairCargoCost = 0;
    let repairLaborCost = 0;

    for (const rep of allRepairs) {
      const price = parsePrice(rep.finalPrice);
      const parts = parsePrice(rep.partsCost);
      const cargo = rep.repairType === "cargo" ? 150 : 0;

      if (rep.status === "completed") {
        repairRevenue += price;
        repairPartsCost += parts;
        repairCargoCost += cargo;

        const remainingProfit = price - parts - cargo;
        if (remainingProfit > 0) {
          repairLaborCost += remainingProfit / 2;
        }
      } else {
        repairPartsCost += parts;
      }
    }

    totalRevenue = orderRevenue + repairRevenue;
    totalPartsCost = repairPartsCost;
    totalCargoCost = repairCargoCost;
    totalLaborCost = repairLaborCost;
    netProfit = totalRevenue - totalPartsCost - totalCargoCost - totalLaborCost;

    activeRepairs = activeRepairsResult[0]?.count || 0;
    newOrders = newOrdersResult[0]?.count || 0;
    totalUsers = usersResult[0]?.count || 0;

  } else if (isTech) {
    // Technician Personalized Metrics - Fetch concurrently via Promise.all
    const [
      recentRepairs,
      activeRepairsResult,
      myRepairs,
      repairsInPeriod
    ] = await Promise.all([
      db.query.repairs.findMany({
        where: eq(repairs.technicianId, currentUserId),
        orderBy: [desc(repairs.createdAt)],
        limit: 5,
        with: { user: true }
      }),
      db.select({
        count: sql<number>`count(*)`
      }).from(repairs).where(
        and(
          eq(repairs.technicianId, currentUserId),
          ne(repairs.status, 'completed')
        )
      ),
      db.select({
        finalPrice: repairs.finalPrice,
        partsCost: repairs.partsCost,
        repairType: repairs.repairType,
        status: repairs.status
      }).from(repairs).where(eq(repairs.technicianId, currentUserId)),
      db.select({
        id: repairs.id,
        status: repairs.status,
        finalPrice: repairs.finalPrice,
        partsCost: repairs.partsCost,
        laborCost: repairs.laborCost,
        repairType: repairs.repairType,
        technicianId: repairs.technicianId,
        createdAt: repairs.createdAt
      }).from(repairs).where(
        gte(repairs.createdAt, sixMonthsAgo)
      )
    ]);

    displayRecentRepairs = recentRepairs;
    activeRepairs = activeRepairsResult[0]?.count || 0;
    allRepairsInPeriod = repairsInPeriod;

    let repairRevenue = 0;
    let repairPartsCost = 0;
    let repairCargoCost = 0;
    let repairLaborCost = 0;

    for (const rep of myRepairs) {
      const price = parsePrice(rep.finalPrice);
      const parts = parsePrice(rep.partsCost);
      const cargo = rep.repairType === "cargo" ? 150 : 0;

      if (rep.status === "completed") {
        repairRevenue += price;
        repairPartsCost += parts;
        repairCargoCost += cargo;

        const remainingProfit = price - parts - cargo;
        if (remainingProfit > 0) {
          repairLaborCost += remainingProfit / 2;
        }
      } else {
        repairPartsCost += parts;
      }
    }

    totalRevenue = repairRevenue;
    totalPartsCost = repairPartsCost;
    totalCargoCost = repairCargoCost;
    totalLaborCost = repairLaborCost; // Hak ediş
    netProfit = totalRevenue - totalPartsCost - totalCargoCost - totalLaborCost; // Net profit generated for shop
  }

  // Generate last 6 months placeholder array
  const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const monthlyStats: Array<{
    label: string;
    year: number;
    monthIndex: number;
    ciro: number;
    kar: number;
    kazanc: number;
  }> = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    monthlyStats.push({
      label: monthNames[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      ciro: 0,
      kar: 0,
      kazanc: 0
    });
  }

  for (const order of allOrdersInPeriod) {
    if (!isAdmin) break; // Only admins see store order revenue
    const orderDate = new Date(order.createdAt);
    const m = monthlyStats.find(x => x.year === orderDate.getFullYear() && x.monthIndex === orderDate.getMonth());
    if (m) {
      const c = parsePrice(order.totalAmount);
      m.ciro += c;
      m.kar += c;
    }
  }

  for (const rep of allRepairsInPeriod) {
    const repDate = new Date(rep.createdAt);
    const m = monthlyStats.find(x => x.year === repDate.getFullYear() && x.monthIndex === repDate.getMonth());
    if (m) {
      const price = parsePrice(rep.finalPrice);
      const parts = parsePrice(rep.partsCost);
      const cargo = rep.repairType === "cargo" ? 150 : 0;
      
      const remainingProfit = price - parts - cargo;
      const labor = remainingProfit > 0 ? remainingProfit / 2 : 0;
      const netShopProfit = remainingProfit - labor;

      if (isAdmin) {
        if (rep.status === "completed") {
          m.ciro += price;
          m.kar += netShopProfit;
        } else {
          m.kar -= parts;
        }
      } else if (isTech && rep.technicianId === currentUserId) {
        if (rep.status === "completed") {
          m.ciro += price;
          m.kazanc += labor;
        }
      }
    }
  }

  // Calculate profit margin percentage
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 border border-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {isTech ? "Teknisyen Performans ve Finans Paneli" : "Genel Yönetim ve Finans Merkezi"}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {isTech ? "Kişisel onarımlarınız, hak ettiğiniz işçilikler ve maliyet analizleri." : "Dükkan cirosu, net kar, yedek parça maliyetleri ve genel operasyonlar."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tmkontrols/mesajlar" className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors">
            <Inbox className="w-4 h-4 text-indigo-500" />
            Mesaj Kutusu
          </Link>
          <Link href="/tmkontrols/tamirler" className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-colors">
            <Wrench className="w-4 h-4" />
            Onarım Talepleri
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue (Ciro) */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-400/20 transition-colors" />
          <div className="flex items-start justify-between relative">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {isTech ? "Toplam Tamir Cirom" : "Toplam Ciro"}
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {Number(totalRevenue).toLocaleString('tr-TR')}<span className="text-blue-500 text-xl font-bold">₺</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <CircleDollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/50 w-max px-2.5 py-1.5 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" /> {isTech ? "Bitirdiğim Cihazlardan" : "Dükkan Genel Ciro"}
          </div>
        </div>

        {/* Card 2: Cost or Earnings */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-400/20 transition-colors" />
          <div className="flex items-start justify-between relative">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {isTech ? "Kazanılan İşçiliğim" : "Toplam Gider (Maliyet)"}
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {Number(isTech ? totalLaborCost : (totalPartsCost + totalCargoCost + totalLaborCost)).toLocaleString('tr-TR')}<span className="text-amber-500 text-xl font-bold">₺</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50/50 w-max px-2.5 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" /> 
            {isTech ? "Hak Ettiğim Hak Ediş" : `Parça: ${totalPartsCost.toLocaleString('tr-TR')}₺ | Kargo: ${totalCargoCost.toLocaleString('tr-TR')}₺ | İşçilik: ${totalLaborCost.toLocaleString('tr-TR')}₺`}
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-400/20 transition-colors" />
          <div className="flex items-start justify-between relative">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {isTech ? "Dükkana Kazandırdığım" : "Net Kar"}
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {Number(netProfit).toLocaleString('tr-TR')}<span className="text-emerald-500 text-xl font-bold">₺</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/50 w-max px-2.5 py-1.5 rounded-lg">
            <Percent className="w-3.5 h-3.5" /> Kar Marjı: %{profitMargin.toFixed(1)}
          </div>
        </div>

        {/* Card 4: Active Operations */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-400/20 transition-colors" />
          <div className="flex items-start justify-between relative">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Süreçteki Cihazlarım
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {activeRepairs}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50/50 w-max px-2.5 py-1.5 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" /> Onarım & Teslimat Bekleyen
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Financial Line Chart (SVG) */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 p-6 shadow-[0_8px_30px_rgba(37,99,235,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Mali Analiz ve Performans Trendi</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Son 6 aylık ciro ve kazanç/kar oranlarının görselleşimi.</p>
              </div>
              <div className="flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Ciro
                </span>
                <span className={`flex items-center gap-1.5 ${isTech ? 'text-amber-500' : 'text-emerald-500'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isTech ? 'bg-amber-500' : 'bg-emerald-500'}`} /> {isTech ? "İşçiliğim" : "Net Kar"}
                </span>
              </div>
            </div>

            {/* Recharts Area */}
            <AdminChartWrapper data={monthlyStats} isTech={isTech} />
          </div>
        </div>

        {/* Son Tamir Talepleri Listesi */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/40">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest text-slate-500">
                {isTech ? "Onarımlarım" : "Son Tamir Talepleri"}
              </h2>
              <Link href="/tmkontrols/tamirler" className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                Hepsi
              </Link>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Cihaz</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Müşteri</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Fiyat</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {displayRecentRepairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-800">
                        <Link href={`/tmkontrols/tamirler/${repair.id}`} className="hover:text-blue-600 transition-colors">
                          {repair.deviceModel}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-500">{(repair as any).user?.name || "Bilinmiyor"}</td>
                      <td className="px-4 py-3 font-black text-slate-800 text-xs">
                        {repair.finalPrice ? `${parseFloat(repair.finalPrice).toLocaleString('tr-TR')} ₺` : repair.estimatedPrice ? `${parseFloat(repair.estimatedPrice).toLocaleString('tr-TR')} ₺` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 text-[9px] font-black rounded-md ${REPAIR_STATUS_MAP[repair.status]?.color || "bg-slate-100 text-slate-700"}`}>
                          {REPAIR_STATUS_MAP[repair.status]?.label || repair.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {displayRecentRepairs.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400 font-medium">Atanmış talep bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 gap-8">
          {/* Son Mağaza Siparişleri - Sadece Admin için */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(37,99,235,0.06)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/40">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest text-slate-500">Son Ürün Siparişleri</h2>
              <Link href="/tmkontrols/siparisler" className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                Siparişleri Yönet
              </Link>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sipariş No</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Müşteri</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ücret</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {displayRecentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">#ORD-{order.id.toString().padStart(4, "0")}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{(order as any).user?.name || "Bilinmiyor"}</td>
                      <td className="px-6 py-4 font-black text-slate-800">{order.totalAmount} ₺</td>
                      <td className="px-6 py-4 font-medium text-slate-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                    </tr>
                  ))}
                  {displayRecentOrders.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-medium">Sipariş bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
