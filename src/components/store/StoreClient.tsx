"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function StoreClient() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(199,210,254,0.4)_0%,transparent_60%)] rounded-full pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(233,213,255,0.4)_0%,transparent_60%)] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
      >
        <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl mb-8 border border-white relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          <ShoppingBag className="w-10 h-10 text-blue-600 relative z-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] mb-6">
          <Sparkles className="w-4 h-4 text-blue-500" /> Büyük Açılış
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
          Çok <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Yakında</span>
        </h1>

        <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
          Mağazamız yepyeni arayüzü ve muhteşem ürünleriyle çok yakında sizlerle olacak. Sürpriz indirimler ve premium aksesuarlar için beklemede kalın!
        </p>

        <Link href="/">
          <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfaya Dön
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
