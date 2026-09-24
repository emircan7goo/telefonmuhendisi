"use client";

import { Smartphone, Battery, Droplets, Wrench, Package, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesBento() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Neleri <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Çözüyoruz?</span>
        </h2>
        <p className="text-slate-600 font-medium max-w-xl mx-auto">
          En karmaşık anakart onarımlarından, basit bir ekran koruyucu değişimine kadar her cihazda aynı premium kaliteyi sunuyoruz.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
        
        {/* Büyük Kutu (Ekran) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-2 lg:col-span-3 row-span-2 glass-panel p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/20 blur-[80px] rounded-full group-hover:bg-neon-cyan/40 transition-colors duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-200 mb-6">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ekran Değişimi</h3>
            <p className="text-slate-600 max-w-sm">
              Orijinal kalitede OLED ve LCD ekran değişimi. True Tone aktarımı ve sıvı koruma bandı yenilemesi dahil.
            </p>
          </div>
        </motion.div>

        {/* Yatay Kutu (Batarya) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-2 lg:col-span-3 row-span-1 glass-panel p-6 flex items-center gap-6 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-200 flex-shrink-0">
            <Battery className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Batarya Yenileme</h3>
            <p className="text-sm text-slate-600">Performans kaybı olmadan, %100 sağlık garantili piller.</p>
          </div>
        </motion.div>

        {/* Kare Kutu 1 (Sıvı) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-1 lg:col-span-2 row-span-1 glass-panel p-6 flex flex-col justify-center group cursor-pointer"
        >
          <Droplets className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Sıvı Hasarı</h3>
          <p className="text-xs text-slate-600">Ultrasonik temizlik.</p>
        </motion.div>

        {/* Kare Kutu 2 (Kargo) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-1 lg:col-span-1 row-span-1 glass-panel p-6 flex flex-col justify-center items-center text-center group cursor-pointer bg-slate-100 hover:bg-slate-200"
        >
          <Package className="w-8 h-8 text-slate-900 mb-4" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">Kargo</h3>
        </motion.div>

        {/* Uzun Yatay Kutu (Anakart) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-4 lg:col-span-4 row-span-1 glass-panel p-6 flex items-center justify-between group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-pink/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-200">
              <Cpu className="w-7 h-7 text-neon-pink" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">İleri Seviye Anakart Onarımı</h3>
              <p className="text-sm text-slate-600">BGA Reballing, entegre değişimi ve veri kurtarma hizmetleri.</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors relative z-10">
            <Wrench className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Kare Kutu 3 (Diğer) */}
        <motion.div 
          whileHover={{ scale: 0.98, z: -10 }}
          className="md:col-span-4 lg:col-span-2 row-span-1 glass-panel p-6 flex flex-col justify-center items-center text-center group cursor-pointer border-neon-cyan/30"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-2">Daha Fazlası</h3>
          <p className="text-xs text-slate-600 mb-4 px-4">Yazılım, kasa değişimi, kamera camı...</p>
          <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors">Tümünü Gör →</button>
        </motion.div>

      </div>
    </div>
  );
}
