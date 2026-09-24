"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Ahmet Y.", text: "Ekranda görüntü yoktu, 2 saatte halledip kargoladılar.", rating: 5, pos: "left-[5%] top-[10%]", delay: 0 },
  { name: "Selin K.", text: "Batarya sağlığım %70'ti, orijinal pille değiştirdiler.", rating: 5, pos: "right-[10%] top-[20%]", delay: 0.2 },
  { name: "Caner T.", text: "Anakart yandı dedikleri telefonu dirilttiler. Helal olsun.", rating: 5, pos: "left-[15%] bottom-[20%]", delay: 0.4 },
  { name: "Ayşe B.", text: "Hem hızlı hem de güvenilir. Süreç boyunca bilgilendirildim.", rating: 5, pos: "right-[15%] bottom-[30%]", delay: 0.6 },
  { name: "Murat D.", text: "İşçilikleri gerçekten çok temiz. Apple kalitesinde.", rating: 5, pos: "left-[40%] top-[5%]", delay: 0.8 },
];

export function FloatingReviews() {
  return (
    <div className="relative w-full h-[60vh] max-w-6xl mx-auto flex items-center justify-center">
      
      <div className="absolute inset-0 pointer-events-none">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              duration: 4 + Math.random() * 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: r.delay 
            }}
            className={`absolute ${r.pos} max-w-[280px] p-5 glass-panel hidden md:flex flex-col shadow-2xl`}
          >
            <div className="flex gap-1 mb-3">
              {[...Array(r.rating)].map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-neon-cyan text-blue-600" />
              ))}
            </div>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed line-clamp-3">"{r.text}"</p>
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-[10px] font-bold text-slate-900">
                {r.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-900">{r.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center z-10 p-8 glass-panel md:bg-transparent md:border-transparent md:backdrop-blur-none md:shadow-none">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
          10.000+ <br />
          <span className="text-slate-500">Mutlu Cihaz.</span>
        </h2>
        <p className="text-lg text-slate-600 font-medium max-w-md mx-auto">
          Cihazınızı sadece tamir etmiyoruz, ona eski ruhunu geri kazandırıyoruz.
        </p>
      </div>

    </div>
  );
}
