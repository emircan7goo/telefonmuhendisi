"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Award, Clock, Truck, Headphones } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Garantili Tamir",
    description: "Tüm tamir işlemlerimiz 6 ay garantiyle kapsanmaktadır. Memnun kalmazsanız tekrar bakıyoruz.",
  },
  {
    icon: Zap,
    title: "Aynı Gün Teslimat",
    description: "Çoğu tamir işlemi aynı gün tamamlanır. Bekletmiyoruz, zamanınıza saygı duyuyoruz.",
  },
  {
    icon: Award,
    title: "Orijinal Parçalar",
    description: "Yalnızca orijinal veya A+ kalite yedek parça kullanıyoruz. Kaliteden taviz yok.",
  },
  {
    icon: Clock,
    title: "Şeffaf Fiyatlandırma",
    description: "Gizli ücret yok. Tamir öncesi kesin fiyatı öğrenin, onaylayın, sonra ödeme yapın.",
  },
  {
    icon: Truck,
    title: "Kargo ile Tamir",
    description: "Türkiye'nin her yerine kargo ile tamir imkânı. Evinizden çıkmanıza gerek yok.",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    description: "WhatsApp ve canlı sohbet üzerinden 7 gün 24 saat destek hizmetimizden yararlanın.",
  },
];

export function WhyUsSection() {
  return (
    <section className="bg-transparent py-24 relative overflow-hidden" aria-label="Neden bizi seçmelisiniz">
      {/* Static ambient glows — no motion, no scroll hook */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 60%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)" }}
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">
              Neden biz?
            </span>
          </motion.div>
          <TextReveal text="Farkımızı yaşayın" className="section-title mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle mx-auto"
          >
            Müşteri güveni ve memnuniyeti her şeyden önce gelir.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="group flex flex-col gap-4 p-8 glass-panel border border-slate-200 rounded-[2rem] shadow-glass-sm hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:border-indigo-100 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center
                                group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-slate-600 group-hover:text-slate-900 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 mb-2 text-lg">{r.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{r.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
