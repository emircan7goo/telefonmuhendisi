"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Ahmet Y.",
    rating: 5,
    text: "Telefonum suya düştüğünde umudum kesilmişti. 3 günde tertemiz geldi.",
    avatar: "AY",
    pos: "top-[10%] left-[5%]",
    delay: 0,
  },
  {
    name: "Selin K.",
    rating: 5,
    text: "Ekran kırıldı, en uygun fiyat burada. 6 ay garantisi de harika.",
    avatar: "SK",
    pos: "top-[40%] left-[2%]",
    delay: 1,
  },
  {
    name: "Mehmet D.",
    rating: 5,
    text: "Anakart arızasını başka servisler çözemedi. Burada anında çözdüler.",
    avatar: "MD",
    pos: "bottom-[15%] left-[8%]",
    delay: 2,
  },
  {
    name: "Fatma O.",
    rating: 5,
    text: "AI asistan çok pratik, anında fiyat aldım. Müthiş bir deneyim.",
    avatar: "FO",
    pos: "top-[15%] right-[5%]",
    delay: 1.5,
  },
  {
    name: "Can T.",
    rating: 5,
    text: "Yazılım sorunum uzaktan 30 dakikada çözüldü. Mükemmel hız.",
    avatar: "CT",
    pos: "top-[45%] right-[2%]",
    delay: 0.5,
  },
  {
    name: "Elif B.",
    rating: 5,
    text: "Aksesuar aldım, ertesi gün elimdeydi. Kaliteli ürünler.",
    avatar: "EB",
    pos: "bottom-[20%] right-[8%]",
    delay: 2.5,
  },
];

export function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="section-dark overflow-hidden relative" aria-label="Müşteri yorumları">
      <style>{`
        @keyframes float-phone { 0%, 100% { transform: translateY(-12px); } 50% { transform: translateY(12px); } }
        @keyframes floatCard0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatCard1 { 0%, 100% { transform: translateY(-6px); } 50% { transform: translateY(6px); } }
        @keyframes floatCard2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .phone-float { animation: float-phone 4s ease-in-out infinite; }
      `}</style>
      {/* Background blobs */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-4 block bg-indigo-500/10 inline-block px-3 py-1 rounded-full">
            Yorumlar
          </span>
          <h2 className="section-title" style={{ color: "#fafafa" }}>Müşterilerimiz ne diyor?</h2>
        </motion.div>

        {/* Floating Phone Showcase */}
        <div className="relative min-h-[600px] lg:min-h-[800px] flex items-center justify-center mt-12">
          
          {/* Central Levitating Phone */}
          <div
            className="phone-float relative z-20 w-[200px] h-[400px] sm:w-[260px] sm:h-[520px] lg:w-[320px] lg:h-[640px] drop-shadow-[0_30px_50px_rgba(79,70,229,0.2)]"
          >
            {/* Using a high-res placeholder phone from Unsplash */}
            <Image 
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" 
              alt="iPhone" 
              fill 
              className="object-cover rounded-[2.5rem] lg:rounded-[3.5rem] border-[6px] border-slate-200 shadow-2xl"
              priority
            />
          </div>

          {/* Glowing Aura behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-indigo-400/20 rounded-full pointer-events-none z-10" />

          {/* Floating Reviews (Desktop) */}
          {mounted && testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`hidden lg:flex absolute ${t.pos} z-30 flex-col w-[280px] bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-[0_20px_40px_rgb(0,0,0,0.06)]`}
              style={{
                animation: `floatCard${i % 3} ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${t.delay}s`,
              }}
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-200 text-sm font-semibold leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 shadow-glass-sm">
                  {t.avatar}
                </div>
                <span className="font-extrabold text-slate-900 text-xs">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Reviews Scroll (Visible only on small screens) */}
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar pb-6 mt-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 glass-panel border border-slate-200 rounded-[2rem] p-6 shadow-glass-sm"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-700 text-sm font-semibold leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                  {t.avatar}
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
