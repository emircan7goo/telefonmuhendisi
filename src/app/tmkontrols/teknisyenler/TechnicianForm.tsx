"use client";

import { useState } from "react";
import { UserPlus, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { createTechnician } from "./actions";

export function TechnicianForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await createTechnician(name, email, password);
      toast.success("Teknisyen başarıyla oluşturuldu.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-3xl shadow-sm space-y-6">
      <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-indigo-500" />
        Yeni Teknisyen Ekle
      </h2>
      
      <div>
        <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Ad Soyad</label>
        <div className="relative">
          <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="name" type="text" required className="w-full bg-white/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: Ahmet Usta" />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">E-posta</label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="email" type="email" required className="w-full bg-white/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ahmet@telefonmuhendisi.com" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Giriş Şifresi</label>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="password" type="text" required className="w-full bg-white/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="123456" />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Teknisyen bu e-posta ve şifre ile giriş yapacak.</p>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black px-4 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform">
        {loading ? "Ekleniyor..." : "Teknisyeni Sisteme Ekle"}
      </button>
    </form>
  );
}
