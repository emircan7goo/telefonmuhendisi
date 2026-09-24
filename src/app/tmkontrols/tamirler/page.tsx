import { db } from "@/lib/db";
import { repairs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Search, Wrench, CalendarClock, User } from "lucide-react";
import Link from "next/link";
import { RepairActionControls } from "./RepairActionControls";

export const dynamic = "force-dynamic";

export default async function AdminRepairsPage() {
  const allRepairs = await db.query.repairs.findMany({
    orderBy: [desc(repairs.createdAt)],
    limit: 50,
    columns: {
      id: true,
      userId: true,
      deviceModel: true,
      issueDescription: true,
      status: true,
      finalPrice: true,
      estimatedPrice: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            Teknik Servis Operasyonları
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Gelen cihaz onarım talepleri ve fiyat teklifleri.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Talep No, Model, İsim..." className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-64 font-medium" />
           </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] overflow-visible flex flex-col">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Talep & Müşteri</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cihaz & Arıza</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Durum</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fiyat Teklifi (₺)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {allRepairs.map((repair) => (
                <tr key={repair.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs shadow-sm">
                        #{repair.id}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{(repair as any).user?.name || "İsimsiz Kullanıcı"}</div>
                        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                           <CalendarClock className="w-3 h-3" /> {repair.createdAt.toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{repair.deviceModel}</div>
                    <div className="text-[10px] font-medium text-slate-500 mt-0.5 max-w-[200px] truncate" title={repair.issueDescription}>{repair.issueDescription}</div>
                  </td>
                  <RepairActionControls 
                    repairId={repair.id} 
                    status={repair.status} 
                    finalPrice={repair.finalPrice} 
                    estimatedPrice={repair.estimatedPrice} 
                  />
                  <td className="px-6 py-4 text-right">
                    <Link href={`/tmkontrols/tamirler/${repair.id}`} className="inline-block text-[11px] font-black uppercase text-amber-600 bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors">Detay & Chat</Link>
                  </td>
                </tr>
              ))}
              {allRepairs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Kayıtlı tamir talebi bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
