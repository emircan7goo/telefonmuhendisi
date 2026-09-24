"use client";

import { motion } from "framer-motion";
import { Play, Activity, Camera, Eye } from "lucide-react";

export function LiveOperationDesk() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_60%)] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Şeffaf Servis Anlayışı</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Her Ay Yüzlerce Cihazı,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Milyonların Önünde Onarıyoruz.
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
              Telefon Mühendisi olarak kapalı kapılar ardında çalışmıyoruz. Bize emanet ettiğiniz cihazların onarım aşamalarını, kullandığımız mikroskobik teknikleri ve 1. sınıf işçiliğimizi YouTube kanalımızda tüm şeffaflığıyla paylaşıyoruz. Abone olun ve bu mucizelere siz de şahit olun!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.youtube.com/@telefonmuhendisi" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] group hover:scale-105">
                <Play className="w-5 h-5 fill-current" />
                Kanalıma Abone Ol
              </a>
            </div>

          </div>

          {/* Video Player Mockup -> Linked to YouTube */}
          <div className="w-full lg:w-1/2 relative">
            <a href="https://www.youtube.com/watch?v=b8BL8aN2spU" target="_blank" rel="noopener noreferrer" className="block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_80px_rgba(220,38,38,0.15)] aspect-video group cursor-pointer"
              >
              {/* Real YouTube Thumbnail */}
              <img 
                src="https://i.ytimg.com/vi/b8BL8aN2spU/maxresdefault.jpg" 
                alt="Samsung Telefonlara Root Atmak" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-black/20 to-black/40" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>

              {/* UI Overlays */}
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 bg-red-600 rounded-md flex items-center gap-2 text-xs font-bold text-white tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  SON VİDEO
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg border border-red-500 overflow-hidden">
                    <img 
                      src="https://yt3.ggpht.com/muI_LY12UIhltqFM35KOU9X8LRuIenLh--UDYdOu_XHRuDTrChp1UDTtHMPeOf1vvFSYurEP=s108-c-k-c0x00ffffff-no-rj" 
                      alt="Telefon Mühendisi" 
                      loading="lazy"
                      decoding="async"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Samsung Telefonlara Root Atmak Tüm Modeller !!</h4>
                    <p className="text-gray-400 text-xs">Telefon Mühendisi • YouTube</p>
                  </div>
                </div>
                <div className="text-white/50 text-xs font-mono font-bold bg-black/50 px-2 py-1 rounded backdrop-blur">
                  12:45
                </div>
              </div>
            </motion.div>
            </a>

            {/* Aesthetic Lines */}
            <div className="absolute -inset-10 border border-white/5 rounded-[3rem] -z-10 pointer-events-none rotate-3 hidden lg:block" />
            <div className="absolute -inset-10 border border-red-500/10 rounded-[3rem] -z-10 pointer-events-none -rotate-2 hidden lg:block" />
          </div>

        </div>
      </div>
    </section>
  );
}
