"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Holographic 3D Card
function HolographicCard({ product }: { product: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-[300px] flex-shrink-0 h-[400px] rounded-3xl glass-panel p-6 cursor-pointer group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(30px)" }} />
      
      {!loaded && (
        <div className="absolute top-6 left-6 right-6 h-48 bg-slate-100 animate-pulse rounded-2xl" />
      )}

      <motion.div style={{ transform: "translateZ(50px)" }} className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
        {/* Placeholder for Holographic Product Image */}
        <div className="text-4xl">📱</div>
        <Image 
           src={product.image} 
           alt={product.name} 
           fill 
           className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`} 
           onLoadingComplete={() => setLoaded(true)}
        />
      </motion.div>

      <motion.div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{product.badge}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-slate-900">₺{product.price}</span>
        </div>
      </motion.div>

      <motion.button 
        style={{ transform: "translateZ(40px)" }} 
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ShoppingBag className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

export function StoreGodLevel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const REFURBISHED = [
    { id: 1, name: "iPhone 14 Pro Max", badge: "Yenilenmiş", price: "44.999", image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80" },
    { id: 2, name: "Samsung S23 Ultra", badge: "Kozmetik A+", price: "39.999", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80" },
    { id: 3, name: "iPhone 13", badge: "Yenilenmiş", price: "28.500", image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80" },
  ];

  const ACCESSORIES = [
    { id: 1, name: "AirPods Pro 2", price: "7.499", image: "https://images.unsplash.com/photo-1606220588913-b3aecb471130?w=800&q=80" },
    { id: 2, name: "MagSafe Şarj", price: "1.499", image: "https://images.unsplash.com/photo-1622445272461-c458020d88bf?w=800&q=80" },
    { id: 3, name: "20W Adaptör", price: "699", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80" },
    { id: 4, name: "Premium Kılıf", price: "499", image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80" },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ekosistem.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-xl">
              Özenle yenilenmiş cihazlar ve yüksek kaliteli aksesuarlarla dijital hayatınızı tamamlayın.
            </p>
          </div>
          <Link href="/urunler" className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest hover:text-slate-900 transition-colors group">
            Tüm Mağaza <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3D Holographic Refurbished Phones */}
        <div className="mb-20">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Yenilenmiş Cihazlar</h3>
          <div className="flex gap-6 overflow-x-auto pb-10 px-4 -mx-4 snap-x no-scrollbar" style={{ perspective: "1000px" }}>
            {REFURBISHED.map(p => (
              <div key={p.id} className="snap-center">
                <HolographicCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Smooth Scroll Accessories */}
        <div>
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Apple Store Tarzı Aksesuarlar</h3>
          <div 
            ref={containerRef}
            className="flex gap-4 overflow-x-auto pb-8 no-scrollbar snap-x scroll-smooth"
          >
            {ACCESSORIES.map(p => (
              <div key={p.id} className="relative w-[280px] h-[140px] flex-shrink-0 bg-slate-100 border border-slate-200 hover:border-white/20 transition-colors rounded-2xl p-4 flex gap-4 snap-center group cursor-pointer">
                <div className="w-24 h-full bg-slate-100 rounded-xl relative overflow-hidden flex-shrink-0">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{p.name}</h4>
                  <span className="text-slate-600 text-xs font-medium mb-3">Stokta</span>
                  <span className="text-slate-900 font-black">₺{p.price}</span>
                </div>
                <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-neon-cyan hover:text-black text-slate-900 flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
