"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Package, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FloatingUI } from "@/components/ui/FloatingUI";

// Framer Motion Confetti Particle Component
const Confetti = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    const shapes = ["circle", "rect"];
    
    const newParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            x: p.x + (Math.random() - 0.5) * 200,
            rotate: p.rotation + (Math.random() * 360),
            opacity: [1, 1, 0],
          }}
          transition={{ duration: Math.random() * 2 + 2, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
};

export default function SuccessPage() {
  const orderId = "TM-" + Math.floor(Math.random() * 90000 + 10000);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <FloatingUI />
      <Confetti />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
        >
          Siparişiniz Alındı!
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-500 mb-8 max-w-md mx-auto"
        >
          Teşekkür ederiz. Cihazınızı veya ürünlerinizi özenle hazırlayıp en kısa sürede kargoya vereceğiz.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full mb-8 shadow-sm"
        >
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
               <span className="text-gray-500 font-medium text-sm">Sipariş Numarası</span>
               <span className="font-bold text-gray-900">{orderId}</span>
             </div>
             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
               <span className="text-gray-500 font-medium text-sm">Durum</span>
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full">
                  <Package className="w-3 h-3" /> Hazırlanıyor
               </span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-500 font-medium text-sm">Teslimat Aralığı</span>
               <span className="font-bold text-gray-900 text-sm">1-3 İş Günü</span>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/#tracker" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5">
            Siparişimi Takip Et <MapPin className="w-4 h-4" />
          </Link>
          <Link href="/" className="px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
            Ana Sayfaya Dön <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
