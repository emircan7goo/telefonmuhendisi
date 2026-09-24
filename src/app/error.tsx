"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center p-4 text-center font-sans antialiased">
      <div className="max-w-md w-full bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl shadow-rose-950/20">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Bir Hata Oluştu</h1>
        <p className="text-slate-400 text-xs mb-4">
          Sayfa yüklenirken bir sorun meydana geldi. Lütfen tekrar deneyin.
        </p>
        
        {error?.message && (
          <div className="p-3 mb-6 bg-slate-900/80 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-rose-300 break-words max-h-32 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow"
          >
            <RefreshCw className="w-4 h-4" /> Tekrar Dene
          </button>
          <Link 
            href="/dashboard" 
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4 text-slate-400" /> Paneli Yeniden Aç
          </Link>
        </div>
      </div>
    </div>
  );
}
