"use client";

import { motion } from "framer-motion";
import { Smartphone, Shield, Star, Truck, Lock } from "lucide-react";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Huawei", "OnePlus", "Google Pixel", "Oppo", "Realme", "Vivo", "Sony"];
const TRUST = [
  { icon: Shield, text: "Garantili Tamir" },
  { icon: Star, text: "4.9/5 Müşteri Puanı" },
  { icon: Truck, text: "Ücretsiz Kargo" },
  { icon: Lock, text: "Güvenli Ödeme" },
  { icon: Smartphone, text: "10.000+ Tamir" },
];

const ALL_ITEMS = [...TRUST, ...BRANDS.map((b) => ({ icon: null, text: b }))];

export function MarqueeBanner() {
  return (
    <div className="bg-transparent border-y border-slate-200 py-4 overflow-hidden backdrop-blur-[2px]">
      <style>{`
        @keyframes marquee-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .marquee-item { animation: marquee-bounce 3s ease-in-out infinite; }
        .marquee-item:nth-child(2n) { animation-delay: 0.4s; }
        .marquee-item:nth-child(3n) { animation-delay: 0.8s; }
        .marquee-item:nth-child(4n) { animation-delay: 1.2s; }
      `}</style>
      <div className="flex gap-0">
        {[0, 1].map((copy) => (
          <motion.div
            key={copy}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            className="flex items-center gap-12 flex-shrink-0 pr-12"
            style={{ willChange: "transform" }}
          >
            {ALL_ITEMS.map((item, i) => (
              <div key={i} className="marquee-item flex items-center gap-3 flex-shrink-0">
                {"icon" in item && item.icon ? (
                  <>
                    <item.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-slate-900 whitespace-nowrap tracking-wide">{item.text}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-neon-purple/50 rounded-full shadow-neon-purple" />
                    <span className="text-sm font-black text-slate-600 whitespace-nowrap uppercase tracking-widest">{item.text}</span>
                  </>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
