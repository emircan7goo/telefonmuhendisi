"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Battery, Droplets, Wrench, ShieldCheck, Zap } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-[1400px] w-full mx-auto">
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-[minmax(180px,_auto)]">
          
          {/* Main Hero Card - Span 8 */}
          <motion.div 
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-8 lg:row-span-2 glass-panel p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group"
          >
            {/* Subtle glow inside card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/20 blur-[100px] rounded-full mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-100 backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Geleceğin Tamir Servisi</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tighter leading-[0.95] mb-6 text-slate-900">
                Telefonun <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sanata Dönüşsün.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mb-10 leading-relaxed">
                Kırık ekranlardan sıvı temasına, ölü bataryalardan anakart arızalarına kadar. 
                Premium hizmet, 6 ay garanti ve kusursuz müşteri deneyimi.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <MagneticWrapper>
                  <Link href="/tamir" className="btn-premium">
                    Hemen Tamir Ettir
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </MagneticWrapper>
                <MagneticWrapper>
                  <Link href="/urunler" className="btn-ghost-glow">
                    Aksesuar Keşfet
                  </Link>
                </MagneticWrapper>
              </div>
            </div>
          </motion.div>

          {/* Quick Stat / Trust Card - Span 4 */}
          <motion.div 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-4 glass-panel p-8 flex flex-col justify-between relative group overflow-hidden"
          >
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-cyan/20 blur-[60px] rounded-full" />
             
             <div className="mb-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-200 border border-slate-200 flex items-center justify-center mb-6 text-blue-600">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-bold text-slate-900 mb-2">10.000+</h3>
               <p className="text-sm text-slate-600 font-medium">Mutlu müşteri ve tamir edilen cihaz sayısı.</p>
             </div>
             <div className="flex -space-x-3 mt-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] bg-slate-200 flex items-center justify-center backdrop-blur-md">
                 <span className="text-xs font-bold text-slate-900">+5k</span>
               </div>
             </div>
          </motion.div>

          {/* Service Bento Mini 1 - Span 2 */}
          <motion.div 
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-2 glass-panel p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <Smartphone className="w-8 h-8 text-neon-pink mb-3 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="font-bold text-slate-900 text-sm">Ekran Değişimi</h4>
            <p className="text-xs text-slate-600 mt-1">Orijinal Parça</p>
          </motion.div>

          {/* Service Bento Mini 2 - Span 2 */}
          <motion.div 
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-2 glass-panel p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <Battery className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="font-bold text-slate-900 text-sm">Batarya Değişimi</h4>
            <p className="text-xs text-slate-600 mt-1">%100 Sağlık</p>
          </motion.div>

          {/* Service Bento Mini 3 - Span 4 */}
          <motion.div 
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-4 lg:col-start-9 glass-panel p-8 flex items-center justify-between relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-slate-900 mb-1">Aynı Gün Teslim</h3>
               <p className="text-sm text-slate-600 font-medium">Kurye ile kapınızdan alıyoruz.</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center backdrop-blur-md relative z-10 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
