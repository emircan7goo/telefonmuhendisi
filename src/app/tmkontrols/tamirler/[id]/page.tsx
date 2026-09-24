import { db } from "@/lib/db";
import { repairs, repairMessages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminChat } from "./AdminChat";
import TechnicianPanel from "./TechnicianPanel";
import { notFound } from "next/navigation";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { contactUserColumns, publicUserColumns } from "@/lib/db/safe-columns";
import { canAccessRepair, getSessionUser } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RepairDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const repairId = parseInt(resolvedParams.id);
  if (isNaN(repairId)) return notFound();

  const viewer = await getSessionUser();
  if (!viewer) redirect("/tmkontrols-giris");

  const repairResult = await db.query.repairs.findFirst({
    where: eq(repairs.id, repairId),
    with: {
      user: { columns: contactUserColumns },
      messages: {
        orderBy: [asc(repairMessages.createdAt)],
        with: { user: { columns: publicUserColumns } }
      }
    }
  });

  // Teknisyen başkasına atanmış bir kaydı göremez (varlığını da öğrenemez).
  if (!repairResult || !canAccessRepair(viewer, repairResult)) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/tmkontrols/tamirler" className="p-2 bg-white/60 rounded-xl hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Talep #{repairResult.id} Detayları & İletişim
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Cihaz bilgileri, yönetici paneli ve müşteri ile doğrudan iletişim kanalı.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sol Taraf: Cihaz Bilgisi & Teknisyen Kontrol Paneli */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-6 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cihaz & Arıza</div>
            <div className="font-bold text-slate-900 text-lg leading-tight">{repairResult.deviceModel}</div>
            <div className="text-xs font-mono text-slate-500 mt-2">IMEI: {repairResult.imei || "Belirtilmedi"}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Onarım Türü: {repairResult.repairType === "cargo" ? "Kargo ile" : repairResult.repairType === "instore" ? "Yerinde / Dükkanda" : "Uzaktan Destek"}</div>
            
            <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Müşteri Şikayeti & Görseller</div>
            <div className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
              {repairResult.issueDescription}
            </div>
            
            {(() => {
              const customerPhotos = repairResult.messages
                .filter((m: any) => m.userId === repairResult.userId && m.imageUrl && m.message === "Müşteri tarafından yüklenen arıza görseli.")
                .map((m: any) => m.imageUrl);
                
              if (customerPhotos.length > 0) {
                return (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {customerPhotos.map((photo: string, idx: number) => (
                      <ImageViewer 
                        key={idx}
                        src={photo} 
                        alt={`Müşteri Görseli ${idx + 1}`} 
                        className="rounded-xl border border-slate-200 aspect-square"
                      />
                    ))}
                  </div>
                );
              }
              return null;
            })()}
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tahmini Fiyat</div>
              <div className="text-2xl font-black text-slate-900">{repairResult.estimatedPrice || 0} ₺</div>
            </div>
          </div>

          <TechnicianPanel
            repairId={repairResult.id}
            repairType={repairResult.repairType}
            initialStatus={repairResult.status}
            initialNotes={repairResult.notes || ""}
            initialFinalPrice={repairResult.finalPrice || repairResult.estimatedPrice || ""}
            initialPartsCost={repairResult.partsCost || ""}
            initialLaborCost={repairResult.laborCost || ""}
            initialRepairImage={repairResult.repairImage}
          />
        </div>

        {/* Sağ Taraf: Chat Modülü */}
        <div className="md:col-span-2">
          <AdminChat 
            repairId={repairResult.id} 
            initialMessages={repairResult.messages.map((m: any) => ({ ...m, createdAt: m.createdAt?.toISOString() }))} 
            customer={repairResult.user ?? null} 
          />
        </div>

      </div>
    </div>
  );
}
