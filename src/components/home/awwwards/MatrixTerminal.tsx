"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu, Zap, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DIAGNOSTIC_STEPS = [
  "> BAŞLATILIYOR: Yapay Zeka Teşhis Protokolü v2.4",
  "> TARANIYOR: Donanım Bileşenleri...",
  "> ANALİZ: Anakart Güç Akışı [OK]",
  "> ANALİZ: Lityum-İyon Hücre Durumu [UYARI]",
  "> TESPİT EDİLDİ: Batarya Kapasitesi %74'ün altında.",
  "> ÇÖZÜM: Orijinal Batarya Değişimi Öneriliyor.",
  "> DURUM: Onarım için Hazır."
];

export function MatrixTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= DIAGNOSTIC_STEPS.length) {
      setIsDone(true);
      return;
    }

    const fullLine = DIAGNOSTIC_STEPS[currentLineIndex];

    if (currentCharIndex < fullLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, Math.random() * 30 + 10); // Random typing speed
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, fullLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 500); // Pause before next line
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const currentTyping = DIAGNOSTIC_STEPS[currentLineIndex]?.substring(0, currentCharIndex) || "";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-4">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">AI Teşhis Asistanı</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Cihazınız Bizimle <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Konuşuyor.</span>
        </h2>
      </div>

      <div className="w-full relative group">
        {/* Glow effect behind terminal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
        
        {/* Terminal Window */}
        <div className="relative w-full rounded-2xl bg-[#030305]/80 backdrop-blur-xl border border-slate-200 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-100">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Terminal className="w-3 h-3" /> sys_diagnostic.exe
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base h-[300px] flex flex-col">
            {lines.map((line, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={i} 
                className={`mb-2 ${line.includes('UYARI') ? 'text-yellow-400' : line.includes('OK') ? 'text-green-400' : 'text-slate-600'}`}
              >
                {line}
              </motion.div>
            ))}
            {!isDone && (
              <div className="text-blue-600 font-bold">
                {currentTyping}
                <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
              </div>
            )}

            <AnimatePresence>
              {isDone && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-auto pt-6 border-t border-slate-200"
                >
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Başka bir şikayetiniz var mı? (Örn: Cihaz ısınıyor)"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 placeholder-zinc-500 focus:outline-none focus:border-neon-cyan focus:bg-slate-200 transition-colors"
                    />
                    <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#030305] px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors">
                      ANALİZ ET
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
