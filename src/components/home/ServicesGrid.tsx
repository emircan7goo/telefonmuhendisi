"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, Package, Smartphone, Wifi, ShieldCheck, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Ekran Değişimi",
    desc: "iPhone, Samsung ve tüm Android modeller için orijinal veya A+ kalite ekran.",
    href: "/tamir/ekran",
    price: "₺850'den başlayan",
    tag: "En çok tercih",
  },
  {
    icon: ShieldCheck,
    title: "Batarya Değişimi",
    desc: "Düşen pil ömrüne son. Orijinal kapasitede yeni batarya, 6 ay garanti.",
    href: "/tamir/batarya",
    price: "₺350'den başlayan",
    tag: null,
  },
  {
    icon: Wifi,
    title: "Yazılım & Format",
    desc: "Donma, virüs, yavaşlama sorunları. Uzaktan veya mağazada çözüm.",
    href: "/tamir/yazilim",
    price: "₺200'den başlayan",
    tag: null,
  },
  {
    icon: Smartphone,
    title: "Su Hasarı Tamiri",
    desc: "Suya düşen cihazlar için profesyonel ultrasonic yıkama ve kurutma.",
    href: "/tamir/su-hasari",
    price: "₺300'den başlayan",
    tag: null,
  },
  {
    icon: Package,
    title: "Kargo ile Tamir",
    desc: "Türkiye'nin her yerine kargo ile gönder, tamir edilmiş olarak geri al.",
    href: "/tamir/kargo",
    price: "Ücretsiz kargo",
    tag: "Popüler",
  },
  {
    icon: Wrench,
    title: "Anakart Tamiri",
    desc: "Mikro lehim, BGA reballing, şarj soketi ve gelişmiş anakart onarımı.",
    href: "/tamir/anakart",
    price: "₺500'den başlayan",
    tag: null,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ServicesGrid() {
  return (
    <section className="section-dark relative overflow-hidden" aria-label="Hizmetlerimiz">
      {/* Static ambient glows — no scroll/motion, no z-fighting */}
      <div
        className="absolute top-0 left-0 w-[50vw] h-[50vh] pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh] pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 70%, rgba(139,92,246,0.1) 0%, transparent 60%)" }}
      />

      {/* Grid dots overlay */}
      <div className="absolute inset-0 grid-bg-dark opacity-100 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full mb-5">
              Hizmetler
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: "#fafafa" }}>
              Her soruna bir çözüm
            </h2>
            <p className="text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto" style={{ color: "#a1a1aa" }}>
              Profesyonel ekibimiz ve garantili hizmetimizle telefonunuzu ilk gününe döndürüyoruz.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="h-full"
              >
                <Link
                  href={s.href}
                  className="group flex flex-col h-full p-7 bg-white/[0.04] border border-white/[0.08] rounded-[1.75rem]
                             hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover glow top line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-t-[1.75rem]" />

                  {/* Top */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-13 h-13 w-[52px] h-[52px] bg-white/[0.06] border border-white/[0.1] rounded-2xl flex items-center justify-center
                                    group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors duration-300" />
                    </div>
                    <div className="flex items-center gap-2">
                      {s.tag && (
                        <span className="text-[10px] font-bold text-slate-600 bg-white/[0.08] border border-white/[0.1] px-2.5 py-1 rounded-full tracking-widest uppercase">
                          {s.tag}
                        </span>
                      )}
                      <ArrowUpRight className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all duration-300" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-xl mb-2.5 tracking-tight" style={{ color: "#fafafa" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed font-medium flex-1" style={{ color: "#71717a" }}>{s.desc}</p>

                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <span className="text-sm font-bold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full group-hover:bg-indigo-500/15 group-hover:text-indigo-300 transition-colors">
                      {s.price}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
