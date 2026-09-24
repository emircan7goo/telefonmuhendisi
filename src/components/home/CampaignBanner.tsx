"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CampaignBanner() {
  return (
    <section className="section bg-[#F4F4F5] pt-0" aria-label="Kampanya">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 border border-indigo-500 p-10 md:p-16 shadow-[0_32px_80px_rgba(79,70,229,0.25)]"
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none will-change-[transform,opacity]"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none will-change-[transform,opacity]"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-glass-sm">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-[0.15em]">
                  Haziran Kampanyası
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                Ekran değişiminde
                <br />
                <span className="text-indigo-200">%25 indirim</span>
              </h2>
              <p className="text-indigo-100 text-lg max-w-md font-medium leading-relaxed">
                Tüm iPhone ve Samsung modelleri için geçerli. Sadece bu ay, stoklarla sınırlı.
              </p>
            </div>

            <div className="flex flex-col gap-4 flex-shrink-0">
              <Link
                href="/tamir/ekran"
                id="campaign-cta"
                className="inline-flex items-center justify-center gap-2 glass-panel text-indigo-600 font-extrabold px-8 py-4 rounded-full
                           hover:bg-slate-100 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg shadow-black/10"
              >
                Hemen başvur
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-indigo-200 text-xs text-center font-medium">
                Kampanya 30 Haziran&apos;da sona eriyor
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
