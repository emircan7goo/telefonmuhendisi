"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

const stats = [
  { value: 10000, suffix: "+", label: "Mutlu Müşteri" },
  { value: 50000, suffix: "+", label: "Tamamlanan Tamir" },
  { value: 4.9, suffix: "/5", label: "Müşteri Puanı", isDecimal: true },
  { value: 48, suffix: " sa", label: "Ort. Teslimat" },
];

function Counter({ value, suffix, isDecimal }: { value: number; suffix: string; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const duration = 1800;
          const steps = 80;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started, isDecimal]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : count.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="section-dark relative overflow-hidden" aria-label="İstatistikler">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-4 block bg-indigo-500/10 inline-block px-3 py-1 rounded-full">
            Rakamlarla biz
          </span>
          <TextReveal text="Güvenin somut kanıtları" className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center p-7 bg-slate-200 border border-white/[0.08] rounded-[2rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-400"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                <Counter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              </div>
              <p className="text-slate-600 text-sm font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
