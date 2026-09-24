import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Search, ShieldAlert, Fingerprint, Activity, ShieldCheck, Mail, Phone, Smartphone, Monitor, Wrench, Lock } from "lucide-react";
import { UserActionButtons } from "./UserActionButtons";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    with: {
      accounts: true,
      sessions: true,
      orders: true,
      repairs: true,
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Kullanıcı Kontrol Merkezi (God-Mode)
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Sistemdeki tüm hesapların kök erişimi, oturum izleme ve mutlak yetki yönetimi.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="UID veya İletişim ile ara..." className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-64 font-medium" />
           </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] overflow-visible flex flex-col">
      <div className="p-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Kullanıcı & İletişim</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Güvenlik (UID)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Yetki</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Oturum / Ağ Logları</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Mutlak Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {allUsers.map((user) => {
                const isAdmin = user.role === 'admin';
                return (
                <tr key={user.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${isAdmin ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{user.name || "İsimsiz Kullanıcı"}</div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          {user.email && <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><Mail className="w-3 h-3 text-slate-400" />{user.email}</div>}
                          {user.phone && <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><Phone className="w-3 h-3 text-slate-400" />{user.phone}</div>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Fingerprint className={`w-4 h-4 ${isAdmin ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 select-all">
                          {user.id}
                        </div>
                      </div>
                      {user.overridePassword && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Lock className="w-3 h-3 text-red-500" />
                          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Override Şifre:</span>
                          <span className="text-xs font-mono font-bold text-slate-900 bg-red-50 px-1.5 rounded">{user.overridePassword}</span>
                        </div>
                      )}
                      <div className="mt-1 flex gap-2">
                         <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                           <Activity className="w-3 h-3" /> Sipariş: {(user as any).orders?.length || 0}
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                           <Wrench className="w-3 h-3" /> Tamir: {(user as any).repairs?.length || 0}
                         </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-black rounded-lg border flex w-max items-center gap-1.5 ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : user.role === 'technician' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : null}
                      {user.role === 'admin' ? 'Sistem Yöneticisi' : user.role === 'technician' ? 'Teknisyen' : 'Müşteri'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Giriş Metodu:</span>
                        <div className="flex gap-1">
                          {(user as any).accounts?.map((acc: any) => (
                            <span key={acc.providerAccountId} className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-md uppercase tracking-wider">
                              {acc.provider} OAuth
                            </span>
                          ))}
                          {user.phone && (user as any).accounts?.length === 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md uppercase tracking-wider">
                              SMS Doğrulama
                            </span>
                          )}
                          {!(user as any).accounts?.length && !user.phone && <span className="text-[10px] text-red-400 font-bold">Bilinmiyor</span>}
                        </div>
                      </div>
                      
                      {/* Session Token / Log mock for visual density */}
                      {(user as any).sessions?.length > 0 ? (
                        <div className="mt-1 flex items-center gap-2">
                          <Monitor className="w-3 h-3 text-slate-400" />
                          <div className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 truncate w-32" title={(user as any).sessions[0].sessionToken}>
                            tk_{(user as any).sessions[0].sessionToken.substring(0,8)}...
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" title="Aktif Oturum"></span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-2 opacity-50">
                          <Smartphone className="w-3 h-3 text-slate-400" />
                          <div className="text-[10px] font-mono text-slate-400">Oturum Yok</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActionButtons userId={user.id} currentRole={user.role} overridePassword={user.overridePassword} />
                  </td>
                </tr>
              )})}
              {allUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Veritabanında kayıtlı kullanıcı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
      </div>
    </div>
  );
}
