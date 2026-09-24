import { db } from "@/lib/db";
import { contactUserColumns, publicUserColumns } from "@/lib/db/safe-columns";
import { repairs, repairMessages } from "@/lib/db/schema";
import { desc, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { repairScopeFor } from "@/lib/authz";
import { redirect } from "next/navigation";
import Link from "next/link";
import InboxChatWindow from "./InboxChatWindow";
import { MessageSquare, Calendar, Sparkles } from "lucide-react";
import { repairStatusMeta } from "@/lib/repair-status";

export const dynamic = "force-dynamic";

export default async function UnifiedInboxPage({
  searchParams
}: {
  searchParams: Promise<{ repairId?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  if (!session?.user) return redirect("/tmkontrols-giris");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "technician") {
    return redirect("/giris");
  }

  const currentUserId = session.user.id || "";

  // Admin tümünü, teknisyen kendisine atanan ve atanmamış kayıtları görür
  const queryRepairs = await db.query.repairs.findMany({
    where: repairScopeFor({ id: currentUserId, role }),
    with: {
      user: { columns: contactUserColumns },
      messages: {
        orderBy: [asc(repairMessages.createdAt)],
        with: { user: { columns: publicUserColumns } }
      }
    },
    orderBy: [desc(repairs.updatedAt)]
  });

  const selectedRepairId = resolvedSearchParams.repairId ? parseInt(resolvedSearchParams.repairId) : null;
  const selectedRepair = queryRepairs.find(r => r.id === selectedRepairId) || queryRepairs[0];

  return (
    <div className="h-[calc(100vh-180px)] min-h-[500px] flex gap-6 max-w-6xl mx-auto">
      
      {/* Left Pane: Conversations List */}
      <div className="w-1/3 flex flex-col bg-white/40 border border-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm">
        
        {/* Header Search / Filter */}
        <div className="p-4 border-b border-slate-100 bg-white/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Sohbetler
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Aktif ve biten tamir talepleriniz.</p>
          </div>
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
            {queryRepairs.length} Aktif
          </span>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/50 custom-scrollbar">
          {queryRepairs.map((item) => {
            const isSelected = selectedRepair?.id === item.id;
            const lastMsg = item.messages[item.messages.length - 1];
            
            return (
              <Link
                key={item.id}
                href={`/tmkontrols/mesajlar?repairId=${item.id}`}
                className={`flex flex-col p-4 text-left transition-all ${
                  isSelected 
                    ? "bg-white border-l-4 border-blue-500 shadow-sm" 
                    : "hover:bg-white/40"
                }`}
              >
                {/* Row 1: Client and Date */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs truncate max-w-[140px]">
                    {item.user?.name || "İsimsiz Müşteri"}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.updatedAt).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Row 2: Device Model */}
                <div className="text-[11px] font-semibold text-slate-600 mt-1">
                  {item.deviceModel}
                </div>

                {/* Row 3: Message Snippet / Status */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">
                    {lastMsg 
                      ? (lastMsg.message || "📷 Görsel gönderdi") 
                      : "Sohbet başlatılmadı..."
                    }
                  </p>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${repairStatusMeta(item.status).badge}`}>
                    {repairStatusMeta(item.status).label}
                  </span>
                </div>

              </Link>
            );
          })}
          
          {queryRepairs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold">Atanmış Talep Bulunmuyor</p>
              <p className="text-[10px] text-slate-400 mt-1">Giriş yetkili hesabınızda kayıtlı herhangi bir onarım kaydı bulunmamaktadır.</p>
            </div>
          )}
        </div>

      </div>

      {/* Right Pane: Chat Window */}
      <div className="w-2/3 h-full">
        {selectedRepair ? (
          <InboxChatWindow
            repair={{
              id: selectedRepair.id,
              deviceModel: selectedRepair.deviceModel,
              status: selectedRepair.status,
              finalPrice: selectedRepair.finalPrice,
              estimatedPrice: selectedRepair.estimatedPrice,
              user: {
                name: selectedRepair.user?.name || "İsimsiz Müşteri",
                email: selectedRepair.user?.email || null
              }
            }}
            messages={selectedRepair.messages.map(m => ({
              id: m.id,
              userId: m.userId,
              message: m.message,
              imageUrl: m.imageUrl,
              createdAt: m.createdAt,
              user: {
                name: m.user?.name || "Kullanıcı",
                role: m.user?.role || "customer"
              }
            }))}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="h-full bg-white/40 border border-white/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-slate-400 space-y-4 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-500 shadow-sm">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Sohbet Seçin</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">İletişime geçmek ve süreç görselleri yüklemek için sol taraftan bir cihaz sohbeti seçin.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
