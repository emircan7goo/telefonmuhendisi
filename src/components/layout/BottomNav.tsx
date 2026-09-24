"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, ShoppingBag, User, Bot } from "lucide-react";

const navItems = [
  { icon: Home, label: "Ana Sayfa", href: "/" },
  { icon: Wrench, label: "Onarım", href: "/tamir" },
  { icon: Bot, label: "AI Asistan", href: "/tamir#ai" },
  { icon: ShoppingBag, label: "Mağaza", href: "/urunler" },
  { icon: User, label: "Hesabım", href: "/hesabim" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 border-t border-gray-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Alt navigasyon"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                if (href.endsWith("#ai")) {
                  e.preventDefault();
                  document.getElementById("ai-asistan-fab")?.click();
                }
              }}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200"
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${active ? "bg-blue-50" : ""}`}>
                <Icon className={`w-4.5 h-4.5 ${active ? "text-blue-600" : "text-slate-400"}`} style={{ width: 18, height: 18 }} />
              </div>
              <span className={`text-[9px] font-semibold ${active ? "text-blue-600" : "text-slate-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
