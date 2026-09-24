"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Farkı Kendi Gözlerinizle Görün</h3>
        <p className="text-gray-500 font-medium">Telefon Mühendisi'nin elinden çıkan her cihaz, ilk günkü kondisyonuna geri döner.</p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize shadow-[0_20px_50px_rgb(0,0,0,0.1)] group select-none"
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1200&auto=format&fit=crop')" }}
        >
          <div className="absolute top-6 right-6 px-4 py-2 bg-blue-600/90 backdrop-blur-md rounded-full text-white font-bold text-sm shadow-lg">
            Sonrası (Onarıldı)
          </div>
        </div>

        {/* Before Image (Foreground overlay) */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none border-r-2 border-white"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=1200&auto=format&fit=crop')",
            width: `${sliderPosition}%` 
          }}
        >
          <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full text-white font-bold text-sm shadow-lg whitespace-nowrap">
            Öncesi (Kırık)
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgb(0,0,0,0.3)] transition-transform group-hover:scale-110">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
