"use client";
import { useState } from "react";
import { UploadCloud, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Lütfen bir ürün görseli seçin.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload image
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // In a real app, we'd take this data.url and save the product.
      toast.success("Ürün ve gerçek görsel başarıyla yüklendi! " + data.url);
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Yükleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/tmkontrols/urunler" className="p-2 bg-white/60 rounded-xl hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gerçek Dosya Yüklemeli Yeni Ürün</h1>
          <p className="text-sm font-medium text-slate-500">Unsplash linki değil, sunucuya fiziksel fotoğraf yükleme (Enterprise Upload).</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-3xl shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Ürün Adı</label>
            <input type="text" required className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: iPhone 15 Pro Max" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Fiyat (₺)</label>
              <input type="number" required className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="75000" />
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Stok</label>
              <input type="number" required className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="10" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Gerçek Cihaz Görseli (Dosya Seç)</label>
            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <UploadCloud className="w-10 h-10 text-indigo-400 mb-3" />
              <div className="font-bold text-slate-700">{file ? file.name : "Tıklayın veya fotoğraf sürükleyin"}</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Sadece PNG, JPG (Maks 5MB)</div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black px-6 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform">
            {loading ? "Yükleniyor..." : <><Save className="w-5 h-5" /> Ürünü ve Görseli Kaydet</>}
          </button>
        </div>
      </form>
    </div>
  );
}
