"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Flame, Clock } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HolographicCardProps {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  isLarge?: boolean;
}

export function HolographicCard({ id, name, desc, price, image, isLarge = false }: HolographicCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const { addItem } = useCartStore();

  const [viewers, setViewers] = useState(0);
  const [stockLeft, setStockLeft] = useState(0);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 5);
    setStockLeft(Math.floor(Math.random() * 4) + 1);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
      className={`relative rounded-[2rem] bg-slate-100 border border-slate-200 backdrop-blur-xl p-6 flex flex-col group overflow-hidden cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(1px)" }} />
      
      {/* 3D Floating Image */}
      <motion.div 
         className={`relative w-full ${isLarge ? "h-64 md:h-80" : "h-40"} mb-6 rounded-2xl flex items-center justify-center`}
         style={{ transform: "translateZ(50px)" }}
      >
        {/* Skeleton fallback is built-in with next/image blurring, but we simulate a skeleton backdrop */}
        <div className="absolute inset-0 bg-slate-100 rounded-2xl animate-pulse" />
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain object-center drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" 
        />
      </motion.div>

      <div className="flex-1 flex flex-col justify-end" style={{ transform: "translateZ(30px)" }}>
         <h3 className={`font-bold text-slate-900 mb-2 ${isLarge ? "text-3xl" : "text-xl"}`}>{name}</h3>
         <p className="text-slate-600 text-sm mb-3 line-clamp-2">{desc}</p>
         
         {/* Social Proof & Scarcity */}
         <div className="flex items-center gap-3 mb-4">
            {viewers > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <Flame className="w-3 h-3" /> {viewers} kişi inceliyor
              </span>
            )}
            {stockLeft > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" /> Son {stockLeft} ürün!
              </span>
            )}
         </div>
         
         <div className="flex items-center justify-between mt-auto">
            <span className="text-blue-600 font-black text-xl">{price} ₺</span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addItem({ id, name, price, image, quantity: 1 });
              }}
              className="w-10 h-10 rounded-full bg-slate-200 border border-white/20 flex items-center justify-center hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
