"use client";

import { useState } from "react";
import { Key, Save } from "lucide-react";
import { saveSettings } from "./actions";
import toast from "react-hot-toast";

export default function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const [formData, setFormData] = useState({
    siteTitle: initialData.siteTitle || "Telefon Mühendisi",
    contactPhone: initialData.contactPhone || "+905449456417",
    maintenanceMode: initialData.maintenanceMode || "false",
    notifyEmail: initialData.notifyEmail || "",
    defaultTechnicianEmail: initialData.defaultTechnicianEmail || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveSettings(formData);
    setLoading(false);
    
    if (res.success) {
      toast.success("Sistem ayarları güncellendi.");
    } else {
      toast.error(res.error || "Hata oluştu.");
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)]">
      <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <Key className="w-5 h-5 text-indigo-500" />
        Değişkenler ve Konfigürasyon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
         <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Site Başlığı</label>
            <input 
              type="text" 
              value={formData.siteTitle}
              onChange={(e) => setFormData({...formData, siteTitle: e.target.value})}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none" 
            />
         </div>
         <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">İletişim Numarası (WhatsApp)</label>
            <input 
              type="text" 
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none" 
            />
         </div>
         <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Bildirim E-postası (Yeni Talepler)</label>
            <input 
              type="email" 
              placeholder="destek@telefonmuhendisi.com"
              value={formData.notifyEmail}
              onChange={(e) => setFormData({...formData, notifyEmail: e.target.value})}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none" 
            />
            <p className="text-[11px] text-slate-500 mt-1">Yeni tamir, sipariş, cihaz satış talebi ve müşteri onay/pazarlık bildirimleri bu adrese gider. Boş bırakılırsa destek@telefonmuhendisi.com kullanılır.</p>
         </div>
         <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Varsayılan Teknisyen E-postası</label>
            <input 
              type="email" 
              placeholder="teknisyen@ornek.com"
              value={formData.defaultTechnicianEmail}
              onChange={(e) => setFormData({...formData, defaultTechnicianEmail: e.target.value})}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none" 
            />
            <p className="text-[11px] text-slate-500 mt-1">Yeni tamir talepleri otomatik olarak bu teknisyene atanır (hesap teknisyen rolünde olmalı).</p>
         </div>
         <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Bakım Modu (Siteyi Kapat)</label>
            <select 
              value={formData.maintenanceMode}
              onChange={(e) => setFormData({...formData, maintenanceMode: e.target.value})}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none"
            >
              <option value="false">Kapalı (Site Aktif)</option>
              <option value="true">Açık (Sadece Admin Girebilir)</option>
            </select>
         </div>
         <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50">
           {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />} 
           Ayarları Kaydet
         </button>
      </form>
    </div>
  );
}
