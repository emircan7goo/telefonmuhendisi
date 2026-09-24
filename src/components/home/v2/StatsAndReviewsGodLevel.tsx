"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Star } from "lucide-react";

// Counter Component
function AnimatedCounter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  const springValue = useSpring(from, { damping: 50, stiffness: 100, mass: 1 });
  
  useEffect(() => {
    if (inView) {
      springValue.set(to);
    }
  }, [inView, springValue, to]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = Intl.NumberFormat("tr-TR").format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={nodeRef}>{from}</span>;
}

const REVIEWS = [
  { name: "Ahmet Y.", text: "Ekranda görüntü yoktu, 2 saatte halledip kargoladılar.", rating: 5 },
  { name: "Selin K.", text: "Batarya sağlığım %70'ti, orijinal pille değiştirdiler.", rating: 5 },
  { name: "Caner T.", text: "Anakart yandı dedikleri telefonu dirilttiler. Helal olsun.", rating: 5 },
  { name: "Ayşe B.", text: "Hem hızlı hem de güvenilir. Süreç boyunca bilgilendirildim.", rating: 5 },
  { name: "Murat D.", text: "İşçilikleri gerçekten çok temiz. Apple kalitesinde.", rating: 5 },
];

export function StatsAndReviewsGodLevel() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container-custom">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {[
            { label: "Başarılı Onarım", value: 12500, suffix: "+" },
            { label: "Müşteri Memnuniyeti", value: 99, suffix: "%" },
            { label: "Orijinal Yedek Parça", value: 45000, suffix: "+" },
            { label: "Yıllık Tecrübe", value: 15, suffix: "" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-8 text-center flex flex-col items-center justify-center">
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                <AnimatedCounter from={0} to={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Infinite Marquee Reviews */}
        <div className="text-center mb-12">
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
             Onlar Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Güvendi.</span>
           </h2>
        </div>

        <div className="relative w-full flex overflow-hidden mask-horizontal">
          <motion.div 
            className="flex gap-6 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* Double the array for seamless infinite scroll */}
            {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} className="w-[350px] inline-flex flex-col glass-panel p-6 rounded-3xl shrink-0 whitespace-normal">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-neon-cyan text-blue-600" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed flex-1">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-900">
                    {r.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{r.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
