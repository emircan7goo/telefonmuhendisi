"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { Battery, Cpu, Smartphone } from "lucide-react";

interface XRayPhoneProps {
  scrollProgress: MotionValue<number>;
}

export function XRayPhone({ scrollProgress }: XRayPhoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activePart, setActivePart] = useState<"none" | "battery" | "screen" | "logic">("none");

  // Determine if we are in X-Ray mode based on scroll progress (0.2 to 0.5 is Scene 2)
  const [isXRay, setIsXRay] = useState(false);

  useEffect(() => {
    return scrollProgress.onChange((latest) => {
      // If we are deep enough into Scene 2, trigger X-Ray
      setIsXRay(latest > 0.25 && latest < 0.45);
    });
  }, [scrollProgress]);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const rotateX = mousePos.y * -30; // Max 15 deg
  const rotateY = mousePos.x * 30;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
      
      {/* 3D Phone Container */}
      <div 
        ref={containerRef}
        className="relative w-[300px] h-[600px] perspective-[1000px]"
      >
        <motion.div
          animate={{
            rotateX: isXRay ? 20 : rotateX,
            rotateY: isXRay ? -30 : rotateY,
            rotateZ: isXRay ? -10 : 0,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full h-full relative transform-style-3d"
        >
          {/* Back Chassis */}
          <motion.div 
            className="absolute inset-0 rounded-[3rem] border border-white/20 bg-gradient-to-br from-zinc-800 to-black shadow-2xl"
            animate={{ 
              opacity: isXRay ? 0.3 : 1,
              translateZ: isXRay ? -50 : 0
            }}
          />

          {/* Internals (Logic Board & Battery) */}
          <motion.div 
            className="absolute inset-4 rounded-[2rem] border border-slate-200 bg-[#0a0a0f] flex flex-col gap-2 p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isXRay ? 1 : 0, translateZ: isXRay ? 0 : 0 }}
          >
             {/* Camera Module */}
             <div className="w-16 h-16 rounded-2xl bg-black border border-slate-200 absolute top-4 right-4 flex p-1 gap-1 flex-wrap">
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
                <div className="w-4 h-4 rounded-full bg-slate-100 mt-1" />
             </div>

             {/* Logic Board */}
             <div 
                className={`w-[60%] h-[35%] rounded-xl border-2 transition-colors duration-500 flex items-center justify-center
                            ${activePart === "logic" ? "border-neon-cyan bg-neon-cyan/20 shadow-neon-cyan" : "border-slate-200 bg-slate-100"}`}
             >
                <Cpu className={`w-8 h-8 ${activePart === "logic" ? "text-blue-600" : "text-slate-900/20"}`} />
             </div>

             {/* Battery */}
             <div 
                className={`w-full h-[55%] rounded-xl border-2 transition-colors duration-500 mt-auto flex items-center justify-center
                            ${activePart === "battery" ? "border-neon-purple bg-neon-purple/20 shadow-neon-purple" : "border-slate-200 bg-slate-100"}`}
             >
                <Battery className={`w-12 h-12 ${activePart === "battery" ? "text-indigo-600" : "text-slate-900/20"}`} />
                <span className={`absolute font-black tracking-widest text-2xl opacity-20 ${activePart === "battery" ? "text-indigo-600 opacity-50" : "text-slate-900"}`}>4500 mAh</span>
             </div>
          </motion.div>

          {/* Display Glass */}
          <motion.div 
            className="absolute inset-0 rounded-[3rem] border border-white/30 backdrop-blur-md overflow-hidden flex items-center justify-center"
            animate={{ 
              translateZ: isXRay ? 80 : 0,
              opacity: isXRay ? 0.4 : 1,
              background: isXRay ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)"
            }}
          >
            {/* Screen Content (Hidden in XRay) */}
            <motion.div animate={{ opacity: isXRay ? 0 : 1 }} className="w-full h-full bg-[#030305] flex flex-col">
               <div className="h-6 w-32 bg-black mx-auto mt-2 rounded-b-xl" /> {/* Notch */}
               <div className="flex-1 flex flex-col items-center justify-center gap-4">
                 <div className="text-4xl font-light text-slate-900">09:41</div>
                 <div className="w-48 h-48 rounded-full border border-slate-200 bg-gradient-to-tr from-neon-purple/20 to-neon-cyan/20 blur-xl" />
               </div>
            </motion.div>

            {/* X-Ray Highlight Overlay */}
            {activePart === "screen" && (
              <div className="absolute inset-0 border-4 border-neon-cyan bg-neon-cyan/10 shadow-[inset_0_0_50px_rgba(0,245,212,0.5)] z-20" />
            )}
          </motion.div>

        </motion.div>
      </div>

      {/* Interactive Menu (X-Ray Controls) */}
      <motion.div 
        className="w-full md:w-80 flex flex-col gap-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isXRay ? 1 : 0, x: isXRay ? 0 : 50 }}
      >
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sorun Nerede?</h2>
          <p className="text-slate-600">Arızalı parçayı seçin, anında fiyat alın.</p>
        </div>

        {[
          { id: "screen", label: "Ekran Kırıldı", icon: Smartphone, color: "neon-cyan" },
          { id: "battery", label: "Batarya Çabuk Bitiyor", icon: Battery, color: "neon-purple" },
          { id: "logic", label: "Cihaz Açılmıyor", icon: Cpu, color: "neon-pink" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activePart === item.id;
          return (
            <button
              key={item.id}
              onMouseEnter={() => setActivePart(item.id as any)}
              onMouseLeave={() => setActivePart("none")}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left
                         ${isActive ? "border-white/30 bg-slate-200 scale-105" : "border-slate-200 bg-slate-100 hover:bg-slate-200"}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                              ${isActive ? "bg-white text-[#030305]" : "bg-slate-200 text-slate-900"}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.label}</h3>
                <p className="text-xs text-slate-600">Orijinal parça ile değişim</p>
              </div>
            </button>
          );
        })}
      </motion.div>

    </div>
  );
}
