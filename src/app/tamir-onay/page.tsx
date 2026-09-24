"use client";

import { useEffect, useState } from "react";
import { createRepairTicket } from "./actions";
import { CheckCircle2, Loader2, Wrench, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RepairConfirmationPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const processRepair = async () => {
      const savedDataStr = sessionStorage.getItem("pendingRepairRequest");
      if (!savedDataStr) {
        // Zaten işlenmiş veya direkt bu sayfaya girilmiş
        router.push("/profil");
        return;
      }

      try {
        const repairData = JSON.parse(savedDataStr);
        const res = await createRepairTicket(repairData);
        
        if (res.success) {
          sessionStorage.removeItem("pendingRepairRequest");
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(res.error || "Kayıt başarısız.");
        }
      } catch (e) {
        setStatus("error");
        setErrorMessage("Veri işlenirken bir hata oluştu.");
      }
    };

    processRepair();
  }, [router]);

  return (
    <div className="min-h-screen pt-32 pb-16 bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 max-w-lg w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
             <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
             <h2 className="text-2xl font-black text-slate-900 mb-2">Talebiniz İşleniyor...</h2>
             <p className="text-slate-500">Lütfen bekleyin, bilgileriniz sisteme kaydediliyor.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100">
               <CheckCircle2 className="w-12 h-12" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-4">Talebiniz Alındı!</h2>
             <p className="text-slate-600 mb-8 leading-relaxed">
               Teknik ekibimiz detayları inceleyip en kısa sürede cihazınız için <span className="font-bold text-slate-900">fiyat teklifi</span> belirleyecektir.
             </p>
             
             <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left mb-8">
               <div className="flex items-center gap-3 mb-2">
                 <Wrench className="w-5 h-5 text-blue-600" />
                 <h3 className="font-bold text-slate-800">Sıradaki Adım Ne Olacak?</h3>
               </div>
               <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                 <li>Yönetim merkezi talebinizi onaylayacak.</li>
                 <li>Müşteri panelinizde fiyat belirecek.</li>
                 <li>Fiyatı kabul ettiğiniz an işlemlere başlanacak.</li>
               </ul>
             </div>

             <Link href="/profil" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all block">
               Müşteri Paneline Git
             </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
               <span className="text-4xl font-black">!</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-2">Hata Oluştu</h2>
             <p className="text-slate-500 mb-8">{errorMessage}</p>
             <Link href="/tamir" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all block">
               Tekrar Dene
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
