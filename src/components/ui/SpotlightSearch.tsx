"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MonitorSmartphone, PenTool, Wrench, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const MOCK_RESULTS = [
  { id: 1, title: "iPhone 13 Pro Max Ekran Değişimi", category: "Tamir", icon: PenTool, link: "/tamir" },
  { id: 2, title: "Apple MagSafe Şarj Cihazı", category: "Mağaza", icon: MonitorSmartphone, link: "/urunler" },
  { id: 3, title: "Sıvı Teması Onarım Rehberi", category: "Rehber", icon: Wrench, link: "/tamir" },
];

export function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 border-b border-gray-100">
              <Search className="w-6 h-6 text-blue-600 mr-4" />
              <input 
                autoFocus
                type="text"
                placeholder="Ne aramak istersiniz? Ürün, Tamir, Aksesuar..."
                className="flex-1 bg-transparent border-none outline-none text-xl text-gray-900 placeholder-gray-400 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-500 uppercase">ESC</kbd>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {query.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Sonuçlar</h3>
                  <div className="space-y-2">
                    {MOCK_RESULTS.map((res) => (
                      <Link href={res.link} key={res.id} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                              <res.icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{res.title}</div>
                              <div className="text-xs text-gray-500 font-medium">{res.category}</div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500 font-medium">
                  Hızlı arama için yazmaya başlayın.
                </div>
              )}
            </div>
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-medium">
              <div><span className="font-bold text-blue-600">Pro Tip:</span> Hızlı erişim için her zaman <kbd className="px-1 py-0.5 bg-gray-200 rounded">Cmd</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded">K</kbd> tuşlarını kullanabilirsiniz.</div>
              <div className="hidden sm:block">Telefon Mühendisi OS</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
