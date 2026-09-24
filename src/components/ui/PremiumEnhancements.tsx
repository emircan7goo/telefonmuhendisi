"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Percent, Search } from "lucide-react";
import { SpotlightSearch } from "./SpotlightSearch";

export function PremiumEnhancements() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // 1. Dinamik Favicon
    const handleVisibilityChange = () => {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) return;
      if (document.hidden) {
        document.title = "Sizi Özledik 😢 | Telefon Mühendisi";
      } else {
        document.title = "Telefon Mühendisi — Tamir & Elektronik";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Magic Cursor Track
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // 3. Exit Intent Detection
      if (e.clientY <= 0 && !exitIntentTriggered) {
        setShowExitIntent(true);
        setExitIntentTriggered(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [exitIntentTriggered]);

  return (
    <>
      {/* 1. Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[9999]"
        style={{ scaleX }}
      />

      {/* 2. Magic Cursor (Kaldırıldı) */}

      {/* 3. Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <Percent className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gitmeden Önce!</h2>
              <p className="text-gray-600 mb-6">İlk tamir işleminize veya aksesuar alışverişinize özel <strong className="text-gray-900">%10 İndirim</strong> kazandınız.</p>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center mb-6">
                <span className="font-mono font-bold text-xl text-blue-600 tracking-wider">HOSGELDIN10</span>
              </div>
              
              <button 
                onClick={() => setShowExitIntent(false)}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20"
              >
                İndirimi Kopyala & Devam Et
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Live Support Chat Widget */}
      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-4">
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div>
                  <h4 className="font-bold">Canlı Destek</h4>
                  <p className="text-xs text-blue-100">Genellikle 2 dk içinde yanıtlar</p>
                </div>
                <button onClick={() => setShowChat(false)} className="text-blue-100 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 h-64 bg-slate-50 flex flex-col gap-3">
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 w-10/12 text-sm text-gray-700">
                  Merhaba! Hangi konuda destek almak istersiniz?
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-100">
                <input type="text" placeholder="Mesajınızı yazın..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] transition-shadow"
        >
          {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* 5. Spotlight Search (Cmd+K) */}
      <SpotlightSearch />
    </>
  );
}
