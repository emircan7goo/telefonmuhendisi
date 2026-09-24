"use client";

import { useState } from "react";

export default function TamirTakipPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) return;

    setLoading(true);
    // Mocking an API call to track repair status
    setTimeout(() => {
      setStatus({
        model: "iPhone 13 Pro Max",
        issue: "Ekran Değişimi",
        date: new Date().toLocaleDateString('tr-TR'),
        currentStep: 2,
        steps: [
          { id: 1, title: "Cihaz Teslim Alındı", desc: "Kargo ile merkezimize ulaştı.", completed: true },
          { id: 2, title: "Arıza Tespiti", desc: "Teknisyenlerimiz inceleme yapıyor.", completed: true },
          { id: 3, title: "Onarım İşlemi", desc: "Parça değişimi ve onarım", completed: false },
          { id: 4, title: "Kalite Kontrol", desc: "Test ediliyor.", completed: false },
          { id: 5, title: "Kargoya Verildi", desc: "Size ulaştırılmak üzere kargoda.", completed: false },
        ]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 mb-4">Tamir Takip Sistemi</h1>
          <p className="text-slate-500 text-lg">
            Takip kodunuzu veya telefon numaranızı girerek cihazınızın anlık durumunu öğrenin.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Takip Kodu (Örn: REP-2026-X8)" 
              className="input flex-1 h-14 text-lg"
            />
            <button 
              type="submit"
              disabled={loading || !trackingNumber}
              className="h-14 px-8 bg-primary-600 hover:bg-primary-700 text-slate-900 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sorgulanıyor..." : "Sorgula"}
            </button>
          </form>
        </div>

        {status && (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-zinc-100 mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{status.model}</h2>
                <div className="text-primary-600 font-medium">{status.issue}</div>
              </div>
              <div className="text-slate-500 text-sm font-medium px-4 py-2 bg-zinc-50 rounded-lg">
                Kayıt Tarihi: {status.date}
              </div>
            </div>

            <div className="relative">
              {status.steps.map((step: any, index: number) => (
                <div key={step.id} className="flex gap-6 relative mb-8 last:mb-0">
                  {/* Line */}
                  {index !== status.steps.length - 1 && (
                    <div className={`absolute left-5 top-10 bottom-[-2rem] w-0.5 ${step.completed ? "bg-primary-600" : "bg-zinc-200"}`}></div>
                  )}
                  
                  {/* Dot */}
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${
                      step.completed 
                        ? "border-primary-600 text-primary-600" 
                        : "border-zinc-200 text-slate-600"
                    }`}>
                      {step.completed ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-1.5 flex-1">
                    <h3 className={`font-bold text-lg ${step.completed ? "text-zinc-900" : "text-slate-500"}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 ${step.completed ? "text-zinc-600" : "text-slate-600"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-zinc-100 flex justify-between items-center bg-zinc-50 p-6 rounded-2xl">
              <div>
                <div className="text-sm text-slate-500 mb-1">Müşteri Temsilcisi</div>
                <div className="font-semibold text-zinc-900">+90 850 555 55 55</div>
              </div>
              <button className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 transition-colors shadow-sm text-sm">
                Canlı Destek
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
