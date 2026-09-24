"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Package, Clock, Phone } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: Phone, label: "1. Başvur", desc: "Online form veya telefon", image: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=600&q=80" },
  { icon: Package, label: "2. Gönder", desc: "Kargo ücretsiz", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=600&q=80" },
  { icon: Zap, label: "3. Tamir", desc: "Uzman ekibimiz çözüyor", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80" },
  { icon: Clock, label: "4. Teslim", desc: "48 saatte kapıda", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80" },
];

export function HowItWorksSection() {
  return (
    <section className="bg-transparent py-24" aria-label="Nasıl çalışır">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="section-label">
            Süreç
          </span>
          <h2 className="section-title">Nasıl çalışır?</h2>
          <p className="section-subtitle mx-auto">4 adımda profesyonel tamir hizmeti</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col h-72 bg-slate-100 border border-slate-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)]"
              >
                {/* Hover Image Reveal */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-0 scale-110 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 z-0" 
                  style={{ backgroundImage: `url(${step.image})` }}
                />
                {/* Dark overlay for text readability when image is shown */}
                <div className="absolute inset-0 bg-slate-100/0 group-hover:bg-slate-100/60 transition-colors duration-500 z-0" />

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 glass-panel border border-slate-200 rounded-2xl flex items-center justify-center shadow-glass-sm transition-all duration-500 group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:shadow-indigo-500/30">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors duration-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-200 transition-colors duration-500 uppercase tracking-widest block mb-1">
                      Adım {i + 1}
                    </span>
                    <p className="font-extrabold text-slate-900 text-xl group-hover:text-slate-900 transition-colors duration-500 mb-1">{step.label.split(". ")[1]}</p>
                    <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-700 transition-colors duration-500">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/tamir" className="btn-primary px-8 py-4 text-base shadow-xl shadow-zinc-900/10">
            Şimdi başvur
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
