"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export function AiAsistanSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Direct DOM — no re-render, no spring computation during scroll
    el.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    el.style.transition = "transform 0.12s ease-out";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      cardRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  };

  return (
    <section className="bg-transparent py-24 relative overflow-hidden" aria-label="AI Arıza Asistanı">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-5 py-2.5 mb-8 shadow-glass-sm">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-indigo-900">Gemini AI Destekli</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Arızanı yaz,
              <br />
              <span className="text-slate-600">anında teşhis al.</span>
            </h2>
            <p className="text-lg text-slate-600 font-semibold leading-relaxed mb-10">
              Telefon sorununuzu serbest dille anlatın. Yapay zeka asistanımız
              olası arızaları tespit edip tahmini fiyat aralığını saniyeler içinde verir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticWrapper>
                <Link href="/tamir" id="ai-asistan-cta" className="btn-primary px-8 py-4 w-full">
                  <Bot className="w-5 h-5" />
                  Asistanı Dene
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticWrapper>
              <MagneticWrapper>
                <Link href="/tamir" className="btn-secondary px-8 py-4 w-full">
                  Tamir Başvurusu
                </Link>
              </MagneticWrapper>
            </div>
          </div>

          {/* Right — 3D Tilt Chat preview */}
          <div className="relative" style={{ perspective: "1000px" }}>
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              className="bg-white/80 backdrop-blur-xl border-4 border-slate-200 rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgb(0,0,0,0.08)] lg:hover:shadow-[0_40px_100px_rgb(79,70,229,0.15)] transition-shadow duration-500"
            >
              {/* Device Frame Inner Border */}
              <div className="absolute inset-0 border-[8px] border-slate-2000 rounded-[2.2rem] pointer-events-none" style={{ transform: "translateZ(20px)" }} />

              <div style={{ transform: "translateZ(30px)" }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-glass-sm">
                    <Bot className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-base text-slate-900">Arıza Asistanı</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs font-semibold text-slate-600">Çevrimiçi</span>
                    </div>
                  </div>
                </div>

                {/* Chat */}
                <div className="space-y-4 text-sm mb-6">
                  <div className="bg-slate-100 border border-slate-200 rounded-[1.5rem] rounded-tl-md p-5 max-w-[85%] shadow-glass-sm">
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      Merhaba! Cihazınızla ilgili sorununuzu yazın, size yardımcı olayım. 🔧
                    </p>
                  </div>
                  <div className="bg-indigo-600 rounded-[1.5rem] rounded-tr-md p-5 ml-auto max-w-[85%] shadow-md shadow-indigo-600/20">
                    <p className="text-slate-900 font-medium leading-relaxed">
                      Telefonum suya düştü ve ekran açılmıyor
                    </p>
                  </div>
                  <div className="bg-slate-100 border border-slate-200 rounded-[1.5rem] rounded-tl-md p-5 max-w-[95%] shadow-glass-sm">
                    <p className="text-zinc-700 font-medium mb-4">
                      Anlıyorum. Muhtemel arızalar:
                    </p>
                    <div className="space-y-2.5">
                      {["OLED ekran hasarı", "Anakart su teması", "Batarya şişmesi"].map((item, i) => (
                        <div key={item} className="flex items-center gap-3 text-slate-700 text-[13px] font-semibold">
                          <span className="w-6 h-6 glass-panel border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 font-bold text-[11px] shadow-glass-sm">
                            {i + 1}
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 glass-panel border border-slate-200 rounded-2xl p-4 text-[13px] shadow-glass-sm flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Tahmini fiyat:</span>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">₺800 – ₺2.500</span>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 glass-panel border border-slate-200 rounded-full px-5 py-3.5 shadow-glass-sm">
                  <input
                    type="text"
                    placeholder="Sorununuzu yazın..."
                    className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-600 outline-none"
                    readOnly
                  />
                  <button className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-zinc-800 hover:-translate-y-0.5 transition-all shadow-md shadow-zinc-900/20" aria-label="Gönder">
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
