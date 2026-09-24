import { db } from "@/lib/db";
import { settings, auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { ShieldCheck, Server, Key, Save } from "lucide-react";

import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const allLogs = await db.query.auditLogs.findMany({
    orderBy: [desc(auditLogs.createdAt)],
    limit: 50,
    with: { user: true }
  });

  const allSettings = await db.query.settings.findMany();
  const initialData = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-600" />
            Sistem Ayarları & Sistem Geçmişi
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Global site ayarları, API anahtarları ve Audit (İşlem) logları.</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Settings Form */}
        <SettingsForm initialData={initialData} />

        {/* Audit Logs */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/80 bg-white/40">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Sistem Denetim Günlüğü (Audit Logs)
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 h-[400px] custom-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur z-10">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Zaman</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Kullanıcı / İşlem</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-mono text-slate-500 whitespace-nowrap">{log.createdAt.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 text-xs">{(log as any).user?.name || "Bilinmiyor"}</div>
                      <div className="text-[10px] font-black uppercase text-indigo-600 mt-0.5">{log.action}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {log.details}
                      <div className="text-[9px] text-slate-400 mt-1 font-mono uppercase">Hedef UID: {log.target}</div>
                    </td>
                  </tr>
                ))}
                {allLogs.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-12 text-center text-slate-500 font-medium">Henüz kayıtlı bir işlem yok. İlk banı atmayı deneyin!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
