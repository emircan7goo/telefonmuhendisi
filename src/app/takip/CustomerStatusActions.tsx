"use client";

import { useState } from "react";
import { Check, Truck, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { acceptedStatusFor, normalizeRepairStatus } from "@/lib/repair-status";

export function CustomerStatusActions({ 
  repairId, 
  status, 
  repairType,
  finalPrice, 
  onRefresh 
}: { 
  repairId: number, 
  status: string, 
  repairType?: string,
  finalPrice: string | null, 
  onRefresh: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const current = normalizeRepairStatus(status);

  const handleApproveQuote = async () => {
    setLoading(true);
    try {
      const nextStatus = acceptedStatusFor(repairType || "");
      const res = await fetch(`/api/repairs/${repairId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error);
      toast.success(repairType === "cargo" ? "Teklifi onayladınız! Lütfen kargo adımlarını takip edin." : "Teklifi onayladınız! Onarım işlemi başlıyor.");
      onRefresh();
    } catch (err: any) {
      toast.error(err?.message || "İşlem sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleShipToShop = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/repairs/${repairId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "shipped_to_shop", customerTrackingCode: trackingCode })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error);
      toast.success("Kargoya verme bilginiz teknisyene iletildi.");
      onRefresh();
    } catch (err: any) {
      toast.error(err?.message || "İşlem sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (current === "awaiting_customer_approval" && finalPrice) {
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 mt-6">
        <p className="text-orange-800 text-sm text-center font-medium">
          Teknisyenimiz <strong className="font-black text-lg">{finalPrice} TL</strong> teklif sundu. Kabul ediyor musunuz?
        </p>
        <button 
          disabled={loading}
          onClick={handleApproveQuote}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Teklifi Onayla
        </button>
      </div>
    );
  }

  if (current === "customer_agreed") {
    return (
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mt-6 space-y-4">
        <div className="text-center space-y-1">
          <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-black text-blue-900 text-base">Cihazınızı Kargolama Zamanı</h3>
          <p className="text-xs text-blue-700 max-w-sm mx-auto">
            Lütfen cihazınızı güzelce paketleyip aşağıdaki adrese gönderin. Gönderdikten sonra takip kodunu girerek bize bildirin.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-800">Alıcı: Semih İletişim (Telefon Mühendisi)</span>
            <span className="text-slate-600">Adres: 4 Temmuz Mahallesi, İnönü Caddesi No:2, Karamürsel / Kocaeli</span>
            <span className="text-slate-600 font-medium">Yurtiçi Kargo - Normal Gönderim</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Kargo Takip Kodu (İsteğe bağlı)" 
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            disabled={loading}
            onClick={handleShipToShop}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kargoya Verdim"}
          </button>
        </div>
      </div>
    );
  }

  if (current === "shipped_to_shop") {
    return (
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center gap-4 mt-6">
        <Truck className="w-6 h-6 text-indigo-600 shrink-0" />
        <p className="text-indigo-800 text-xs md:text-sm font-medium">
          Cihazınızın kargosu dükkana ulaşması bekleniyor. Ulaştığında onarım işlemi başlayacaktır.
        </p>
      </div>
    );
  }

  if (current === "pending_payment") {
    return (
      <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl mt-6 space-y-4">
        <div className="text-center space-y-1">
          <CreditCard className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <h3 className="font-black text-teal-900 text-base">Onarım Tamamlandı! Ödeme Bekleniyor</h3>
          <p className="text-xs text-teal-700 max-w-sm mx-auto">
            Cihazınızın onarımı başarıyla tamamlandı. Aşağıdaki IBAN hesabına <strong className="font-bold">{finalPrice} TL</strong> tutarını gönderdikten sonra cihazınız kargoya verilecektir.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm text-sm">
          <div className="flex flex-col gap-2 text-center">
            <span className="font-black tracking-widest text-lg text-slate-800">TR24 0006 7010 0000 0075 2059 00</span>
            <span className="text-slate-600 font-bold">Alıcı: Emircan Derbent</span>
            <span className="text-teal-600 text-xs font-medium">Açıklamaya adınızı veya Sipariş Kodunuzu (#TM-{repairId}) yazmayı unutmayın.</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
