"use client";

import { useState } from "react";
import { Wrench, CircleDollarSign, ClipboardList, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { updateRepairDetails } from "./actions";
import { REPAIR_STATUS_META, normalizeRepairStatus, staffStatusOptions } from "@/lib/repair-status";

interface TechnicianPanelProps {
  repairId: number;
  repairType: string;
  initialStatus: string;
  initialNotes: string;
  initialFinalPrice: string;
  initialPartsCost: string;
  initialLaborCost: string;
  initialRepairImage: string | null;
}

export default function TechnicianPanel({
  repairId,
  repairType,
  initialStatus,
  initialNotes,
  initialFinalPrice,
  initialPartsCost,
  initialLaborCost,
  initialRepairImage
}: TechnicianPanelProps) {
  const [savedStatus, setSavedStatus] = useState(normalizeRepairStatus(initialStatus));
  const [status, setStatus] = useState<string>(savedStatus);
  const [notes, setNotes] = useState(initialNotes || "");
  const [finalPrice, setFinalPrice] = useState(initialFinalPrice || "");
  const [partsCost, setPartsCost] = useState(initialPartsCost || "");
  const [repairImage, setRepairImage] = useState<string | null>(initialRepairImage);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic 50/50 profit split calculation
  const cargoCost = repairType === "cargo" ? 150 : 0;
  const priceNum = parseFloat(finalPrice) || 0;
  const partsNum = parseFloat(partsCost) || 0;
  const remainingProfit = priceNum - partsNum - cargoCost;
  const calculatedLabor = remainingProfit > 0 ? remainingProfit / 2 : 0;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Görsel yüklenemedi.");
      
      setRepairImage(data.url);
      toast.success("Canlı onarım resmi yüklendi!");
    } catch (err: any) {
      toast.error(err.message || "Görsel yükleme hatası.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateRepairDetails(repairId, {
        status,
        notes,
        finalPrice,
        partsCost,
        laborCost: calculatedLabor.toString(),
        repairImage
      });
      
      if (res.success) {
        setSavedStatus(normalizeRepairStatus(status));
        toast.success("Tamir detayları başarıyla güncellendi!");
      }
    } catch (err: any) {
      toast.error(err.message || "Güncelleme yapılırken hata oluştu.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-blue-500 animate-pulse" />
          Teknisyen Kontrol Paneli
        </div>
        <span className="text-[10px] font-bold text-slate-400">ID: #{repairId}</span>
      </div>

      {/* Durum Seçimi */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Cihaz Durumu</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {staffStatusOptions(savedStatus).map((value) => (
            <option key={value} value={value} className="font-semibold text-slate-700">
              {REPAIR_STATUS_META[value].label}
            </option>
          ))}
        </select>
      </div>

      {status === "shipped_to_shop" && (
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              const res = await updateRepairDetails(repairId, {
                status: "in_progress",
                notes, finalPrice, partsCost, laborCost: calculatedLabor.toString(), repairImage
              });
              if (res.success) {
                setStatus("in_progress");
                setSavedStatus("in_progress");
                toast.success("Kargo teslim alındı, onarıma başlandı!");
              }
            } catch (err: any) {
              toast.error(err.message || "Hata oluştu.");
            } finally {
              setSaving(false);
            }
          }}
          className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl py-3 font-black text-sm transition-colors border border-indigo-200 shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Kargodan Teslim Al & Onarıma Başla
        </button>
      )}

      {/* Fiyat & Maliyet Girişleri */}
      <div className="grid grid-cols-1 gap-4">
        
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Teklif / Son Fiyat (₺)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="Fiyat girin"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="button"
              disabled={saving || !finalPrice}
              onClick={async () => {
                setSaving(true);
                try {
                  const res = await updateRepairDetails(repairId, {
                    status: "awaiting_customer_approval",
                    notes, finalPrice, partsCost, laborCost: calculatedLabor.toString(), repairImage
                  });
                  if (res.success) {
                    setStatus("awaiting_customer_approval");
                    setSavedStatus("awaiting_customer_approval");
                    toast.success("Fiyat teklifi müşteriye sunuldu! Müşteri onayı bekleniyor.");
                  }
                } catch (err: any) {
                  toast.error(err.message || "Hata oluştu.");
                } finally {
                  setSaving(false);
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-3 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              Müşteriye Sun
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Yedek Parça (₺)</label>
            <input
              type="number"
              placeholder="Maliyet"
              value={partsCost}
              onChange={(e) => setPartsCost(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Hak Edişiniz (%50) (₺) {repairType === "cargo" && <span className="text-[9px] text-slate-400 font-medium">(150₺ Kargo Düşüldü)</span>}
            </label>
            <input
              type="text"
              readOnly
              value={calculatedLabor.toFixed(2)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-emerald-600 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Teknisyen Notu */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Teknisyen Notu</label>
        <div className="relative">
          <ClipboardList className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <textarea
            placeholder="Müşterinin takip ekranında göreceği detaylı not veya dükkan içi notları girin..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Onarım/Fotoğraf Uploader */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Canlı Süreç Resmi (Müşteri Takip)</label>
        
        {repairImage ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={repairImage} alt="Canlı süreç" className="w-full h-32 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setRepairImage(null)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md transition-colors"
            >
              Kaldır
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all hover:border-blue-400">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-500">Onarım Görseli Yükle</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG (Max 5MB)</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {/* Kaydet Butonu */}
      <button
        type="button"
        disabled={saving || uploading}
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl py-3.5 font-black text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Bilgileri Güncelle
          </>
        )}
      </button>

    </div>
  );
}
