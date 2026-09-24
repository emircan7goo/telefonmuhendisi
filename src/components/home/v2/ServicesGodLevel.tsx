"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Smartphone, Battery, Droplets, Cpu } from "lucide-react";

function LiquidRippleCard({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseDown(e: React.MouseEvent) {
    let { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
    if (onClick) onClick();
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      className={`relative overflow-hidden group glass-panel transition-all duration-500 cursor-pointer ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bg-white/30 rounded-full w-32 h-32 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export function ServicesGodLevel() {
  return (
    <section className="relative py-24 z-10">
      <div className="container-custom">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Mükemmel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Teşhis.</span></h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">En yaygın arızalar için donanım tabanlı çözümler ve orijinal parça garantisi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Kırık Ekran */}
          <LiquidRippleCard className="h-80 p-8 flex flex-col justify-end">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path 
                  d="M20 0 L40 50 L10 100 M40 50 L80 20 M40 50 L90 80 M60 50 L100 60" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="0.5" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                  className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </svg>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-auto text-slate-900 group-hover:text-blue-600 transition-colors">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ekran Değişimi</h3>
            <p className="text-slate-600 text-sm">Orijinal kalitede OLED ekran değişimi ve True Tone aktarımı.</p>
          </LiquidRippleCard>

          {/* Card 2: Batarya */}
          <LiquidRippleCard className="h-80 p-8 flex flex-col justify-end">
             <div className="absolute top-8 right-8 w-12 h-24 border-2 border-white/20 rounded-lg p-1 flex flex-col-reverse group-hover:border-neon-purple/50 transition-colors">
               <div className="w-full h-2 bg-white/20 rounded-t-sm absolute -top-2 left-0" />
               <motion.div 
                 initial={{ height: "10%", backgroundColor: "#ef4444" }}
                 whileHover={{ height: "100%", backgroundColor: "#00f5d4" }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="w-full rounded-md shadow-[0_0_15px_rgba(0,245,212,0.5)]"
               />
             </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-auto text-slate-900 group-hover:text-indigo-600 transition-colors">
              <Battery className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Batarya Değişimi</h3>
            <p className="text-slate-600 text-sm">%100 pil sağlığı, orijinal kapasite ve ısı testleri ile güvenli değişim.</p>
          </LiquidRippleCard>

          {/* Card 3: Sıvı Teması */}
          <LiquidRippleCard className="h-80 p-8 flex flex-col justify-end relative overflow-hidden">
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-cyan/20 blur-2xl rounded-full mix-blend-screen animate-blob" />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-neon-cyan/30 blur-xl rounded-full mix-blend-screen animate-blob animation-delay-2000" />
             </div>
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-auto text-slate-900 group-hover:text-blue-600 transition-colors relative z-10"
             >
              <Droplets className="w-8 h-8" />
            </motion.div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sıvı Hasarı</h3>
              <p className="text-slate-600 text-sm">Özel kimyasallar ve ultrasonik yıkama makinesi ile oksitlenme temizliği.</p>
            </div>
          </LiquidRippleCard>

        </div>
      </div>
    </section>
  );
}
