"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import Link from "next/link";

export function HeroGodLevel() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      
      {/* 3D Glass Objects Background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <motion.div 
           animate={{ rotate: 360, y: [0, -30, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-10 -left-20 w-96 h-96 border-[1px] border-neon-cyan/20 rounded-full"
           style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg)" }}
         />
         <motion.div 
           animate={{ rotate: -360, y: [0, 50, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute top-40 right-10 w-[500px] h-[500px] border-[1px] border-neon-purple/20 rounded-full"
           style={{ transformStyle: "preserve-3d", transform: "rotateX(65deg) rotateY(20deg)" }}
         />
         {/* Glass Abstract Shape */}
         <motion.div
           animate={{ y: [-10, 10, -10], rotateZ: [0, 5, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 right-1/4 w-64 h-64 bg-slate-100 backdrop-blur-3xl rounded-3xl border border-slate-200 shadow-glass-lg rotate-12 flex items-center justify-center overflow-hidden hidden md:flex"
         >
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
           <div className="w-1/2 h-1/2 rounded-full border-4 border-slate-200" />
         </motion.div>
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-slate-100 backdrop-blur-md mb-8 shadow-glass-sm"
        >
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan animate-pulse" />
          <span className="text-xs font-black text-slate-900 tracking-[0.2em] uppercase">Geleceğin Servis Ekosistemi</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.95] text-slate-900 mb-6"
        >
          Telefonun <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 selection:bg-transparent">Sanata Dönüşsün.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Awwwards kalitesinde teknik servis deneyimi. Uzay çağı hızında onarım, premium aksesuarlar ve kusursuz e-ticaret altyapısı.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <MagneticWrapper>
            <Link href="/tamir" className="btn-premium px-10 py-5 text-lg group">
              Tamir Başvurusu
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticWrapper>
          <MagneticWrapper>
            <Link href="/urunler" className="btn-ghost-glow px-10 py-5 text-lg group">
              <Zap className="w-5 h-5 mr-2 text-blue-600 group-hover:text-indigo-600 transition-colors" />
              Aksesuar Mağazası
            </Link>
          </MagneticWrapper>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-slate-500"
        >
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-blue-600" />
             <span className="text-sm font-bold">6 Ay Garantili</span>
           </div>
           <div className="w-1 h-1 rounded-full bg-zinc-700" />
           <div className="flex items-center gap-2">
             <span className="font-mono font-bold text-slate-900">10k+</span>
             <span className="text-sm font-bold">Mutlu Cihaz</span>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
