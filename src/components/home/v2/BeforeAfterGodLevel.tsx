"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { GripVertical } from "lucide-react";
import Image from "next/image";

export function BeforeAfterGodLevel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderPosition = useMotionValue(50); // 0 to 100

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    sliderPosition.set(percentage);
  }

  const clipPath = useTransform(sliderPosition, (val) => `inset(0 ${100 - val}% 0 0)`);
  const leftPos = useTransform(sliderPosition, (val) => `${val}%`);

  return (
    <section className="py-24 relative z-10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Büyüye <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tanık Olun.</span>
          </h2>
          <p className="text-slate-600 font-medium">Ortadaki çizgiyi kaydırarak dönüşümü kendi gözlerinizle görün.</p>
        </div>

        <div 
          ref={containerRef}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          onPointerMove={handlePointerMove}
          className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden cursor-ew-resize touch-none select-none shadow-2xl border border-slate-200 bg-slate-100"
        >
          {/* AFTER Image (Background - Clean Phone) */}
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600&q=80" 
              alt="Tamir Edilmiş Sağlam Telefon" 
              fill 
              className="object-cover object-center pointer-events-none" 
            />
            <div className="absolute top-6 right-6 px-4 py-2 bg-slate-200 backdrop-blur-md rounded-full border border-white/20 text-slate-900 font-bold text-sm z-0">
              Sonrası
            </div>
          </div>

          {/* BEFORE Image (Foreground - Broken Phone - Clipped) */}
          <motion.div 
            className="absolute inset-0 w-full h-full z-10"
            style={{ clipPath }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1525598912003-663126343e1f?w=1600&q=80" 
              alt="Kırık Telefon" 
              fill 
              className="object-cover object-center pointer-events-none filter grayscale contrast-125" 
            />
            <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-slate-200 text-slate-900 font-bold text-sm">
              Öncesi
            </div>
          </motion.div>

          {/* Slider Handle */}
          <motion.div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            style={{ left: leftPos, x: "-50%" }}
          >
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <GripVertical className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
