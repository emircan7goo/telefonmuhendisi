"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Cpu, Battery, Smartphone, ChevronRight } from "lucide-react";

export function InteractiveTeardown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate parallax offsets based on scroll
  // Top Layer (Screen) moves UP
  const screenY = useTransform(scrollYProgress, [0, 0.4, 1], [0, -120, -150]);
  // Middle Layer (Internals) moves slightly UP
  const boardY = useTransform(scrollYProgress, [0, 0.4, 1], [0, -40, -50]);
  // Bottom Layer (Chassis) moves DOWN
  const chassisY = useTransform(scrollYProgress, [0, 0.4, 1], [0, 40, 50]);

  // Fade in the text descriptions as the phone opens
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="h-[250vh] bg-zinc-950 relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden perspective-1000">
        
        <motion.div style={{ opacity }} className="absolute top-20 text-center z-50">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Cihazın İçi <span className="text-blue-500">Açıkça</span> Ortada</h2>
          <p className="text-gray-400 font-medium">Hangi parçanın değişeceğini görün. Şeffaflıkta son nokta.</p>
        </motion.div>

        {/* 3D Scene Wrapper */}
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          
          <motion.div 
            className="relative w-64 h-[500px]"
            // Isometric Tilt
            initial={{ rotateX: 60, rotateZ: -30, scale: 0.8 }}
            animate={{ rotateX: 60, rotateZ: -30, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            
            {/* 1. LAYER: SCREEN (TOP) */}
            <motion.div 
              style={{ y: screenY, zIndex: 30, transformStyle: "preserve-3d" }}
              onMouseEnter={() => setActiveLayer(1)}
              onMouseLeave={() => setActiveLayer(null)}
              className="absolute inset-0 w-full h-full rounded-[3rem] bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] cursor-pointer hover:bg-blue-900/40 transition-colors duration-300"
            >
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full border border-white/10" />
              
              {/* Tooltip */}
              <AnimatePresence>
                {activeLayer === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 50 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 left-full w-48 bg-white p-4 rounded-2xl shadow-xl rotateX-[-60deg] rotateZ-[30deg]"
                    style={{ transform: "rotateX(-60deg) rotateZ(30deg)" }} // Counteract isometric tilt to face user
                  >
                    <Smartphone className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-bold text-gray-900">Orijinal Ekran</h4>
                    <p className="text-xs text-gray-500 mb-2">OLED panel ve cam değişimi.</p>
                    <button className="text-xs font-bold text-blue-600 flex items-center">Teklif Al <ChevronRight className="w-3 h-3" /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 2. LAYER: LOGIC BOARD & BATTERY (MIDDLE) */}
            <motion.div 
              style={{ y: boardY, zIndex: 20, transformStyle: "preserve-3d" }}
              onMouseEnter={() => setActiveLayer(2)}
              onMouseLeave={() => setActiveLayer(null)}
              className="absolute top-2 left-2 right-2 bottom-2 rounded-[2.5rem] bg-zinc-900 shadow-2xl flex flex-col gap-2 p-2 cursor-pointer hover:border hover:border-emerald-500/50 transition-all duration-300"
            >
               {/* Logic Board */}
               <div className="h-32 w-full bg-emerald-950/80 rounded-2xl border border-emerald-800/50 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
                 <div className="w-12 h-12 bg-black rounded-lg border border-gray-800 flex items-center justify-center relative z-10 shadow-lg">
                   <span className="text-[6px] font-mono font-bold text-gray-500">A16 CPU</span>
                 </div>
               </div>

               {/* Battery */}
               <div className="flex-1 w-full bg-zinc-800/80 rounded-2xl border border-zinc-700/50 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 flex flex-col justify-around opacity-10">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-full h-px bg-white" />)}
                 </div>
                 <span className="font-black text-zinc-600 text-xl tracking-widest rotate-90">BATTERY</span>
               </div>

               {/* Tooltip */}
               <AnimatePresence>
                {activeLayer === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: -220 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 right-full w-48 bg-white p-4 rounded-2xl shadow-xl"
                    style={{ transform: "rotateX(-60deg) rotateZ(30deg)" }}
                  >
                    <div className="flex gap-2 mb-2">
                      <Battery className="w-6 h-6 text-green-600" />
                      <Cpu className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Batarya & Anakart</h4>
                    <p className="text-xs text-gray-500 mb-2">Hızlı tükenen pil veya anakart hasarları.</p>
                    <button className="text-xs font-bold text-blue-600 flex items-center">Teklif Al <ChevronRight className="w-3 h-3" /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 3. LAYER: CHASSIS (BOTTOM) */}
            <motion.div 
              style={{ y: chassisY, zIndex: 10, transformStyle: "preserve-3d" }}
              onMouseEnter={() => setActiveLayer(3)}
              onMouseLeave={() => setActiveLayer(null)}
              className="absolute inset-0 w-full h-full rounded-[3rem] bg-zinc-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-[6px] border-zinc-700/80 cursor-pointer hover:bg-zinc-700 transition-colors duration-300"
            >
              {/* Camera Bump */}
              <div className="absolute top-4 left-4 w-24 h-[110px] bg-zinc-900 rounded-3xl border border-zinc-700/50 p-2 flex flex-col justify-between shadow-inner">
                 <div className="w-10 h-10 rounded-full bg-black border-2 border-zinc-800 shadow-inner flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-indigo-900/40" />
                 </div>
                 <div className="w-10 h-10 rounded-full bg-black border-2 border-zinc-800 shadow-inner self-end flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-indigo-900/40" />
                 </div>
                 <div className="absolute bottom-6 left-3 w-8 h-8 rounded-full bg-black border-2 border-zinc-800 shadow-inner flex items-center justify-center">
                   <div className="w-3 h-3 rounded-full bg-indigo-900/40" />
                 </div>
                 <div className="absolute top-6 right-3 w-4 h-4 rounded-full bg-zinc-400" /> {/* Flash */}
              </div>

               {/* Tooltip */}
               <AnimatePresence>
                {activeLayer === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 50 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-1/4 left-full w-48 bg-white p-4 rounded-2xl shadow-xl"
                    style={{ transform: "rotateX(-60deg) rotateZ(30deg)" }}
                  >
                    <Smartphone className="w-6 h-6 text-zinc-800 mb-2" />
                    <h4 className="font-bold text-gray-900">Arka Cam & Kasa</h4>
                    <p className="text-xs text-gray-500 mb-2">Kırık arka cam Lazer makinesiyle değiştirilir.</p>
                    <button className="text-xs font-bold text-blue-600 flex items-center">Teklif Al <ChevronRight className="w-3 h-3" /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </motion.div>
        </div>

        {/* Scroll indicator fade out */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-gray-500"
        >
          <span className="text-xs font-bold tracking-widest uppercase mb-2">Parçalamak için kaydır</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-500 rounded-full" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
