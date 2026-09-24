"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { Search, ShoppingBag, User, Cpu, LogOut, Menu, X, ArrowRight } from "lucide-react";

const NAV = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Onarım Merkezi", href: "/tamir" },
  { label: "Cihaz Sat", href: "/cihaz-sat" },
  { label: "Mağaza", href: "/urunler" },
  { label: "S.S.S.", href: "/sss" },
  { label: "Sipariş Takip", href: "/takip" },
];

export function Header({ settings }: { settings?: Record<string, string> }) {
  const pathname = usePathname();
  const count = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const siteTitle = settings?.siteTitle || "Telefon Mühendisi";
  const titleParts = siteTitle.split(" ");
  const firstPart = titleParts[0];
  const restPart = titleParts.slice(1).join(" ");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,box-shadow,backdrop-filter,padding] duration-500 border-b ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] py-3" 
            : "bg-transparent border-transparent py-5"
        }`}
        style={{ transform: "translateZ(0)", willChange: "padding, background-color, backdrop-filter" }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group flex-shrink-0 select-none cursor-pointer">
              <span className="font-black text-xl md:text-2xl tracking-tighter whitespace-nowrap flex items-center">
                <span className="text-slate-900">{firstPart}</span>
                {restPart && <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 ml-1">{restPart}</span>}
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 bg-gray-50/50 backdrop-blur-md border border-gray-200/50 p-1.5 rounded-2xl">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 lg:px-4 py-2 text-[13px] lg:text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${
                    pathname === item.href 
                      ? "text-blue-700" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
               {session?.user ? (
                 <div className="relative group/profile flex items-center cursor-pointer">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold hover:scale-105 transition-transform">
                     {session.user.image ? (
                       <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover rounded-xl" />
                     ) : (
                       (session.user.name || session.user.email || "U")[0]
                     )}
                   </div>
                   <div className="absolute top-12 right-0 w-48 py-2 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300">
                      <Link href="/profil" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">Siparişlerim</Link>
                      <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                   </div>
                 </div>
               ) : (
                 <Link href="/giris" className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                   <User className="w-5 h-5" />
                 </Link>
               )}
               
               <Link href="/sepet" className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                 <ShoppingBag className="w-5 h-5" />
                 {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {count}
                    </span>
                 )}
               </Link>

               <Link href="/tamir" className="ml-2 group relative flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-gray-900/20">
                 Fiyat Al <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 xl:hidden">
              <Link href="/sepet" className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {count}
                  </span>
                )}
              </Link>
              <button 
                className="p-2 text-gray-600 z-[130]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menü"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] xl:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-[75%] max-w-[300px] bg-white shadow-2xl flex flex-col"
            >
              {/* Panel Başlık */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="font-black text-base text-slate-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Nav Linkleri */}
              <nav className="flex flex-col px-3 py-3 flex-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {/* Alt CTA */}
              <div className="px-4 pb-6 pt-2 border-t border-gray-100">
                <Link
                  href="/tamir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl font-black text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)]"
                >
                  Ücretsiz Fiyat Al
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
