"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Settings,
  Wrench, MessageSquare, X, Menu, ShieldAlert, LogOut,
  ChevronRight, Home
} from "lucide-react";

interface SidebarNavProps {
  isAdmin: boolean;
  pendingOrders: number;
  pendingRepairs: number;
  userName?: string;
  userRole?: string;
}

export default function SidebarNav({ isAdmin, pendingOrders, pendingRepairs, userName, userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navSections = [
    {
      label: "Genel Bakış",
      show: true,
      items: [
        { href: "/tmkontrols", icon: LayoutDashboard, label: "Ana Ekran" },
      ],
    },
    {
      label: "Ticaret Merkezi",
      show: isAdmin,
      items: [
        { href: "/tmkontrols/siparisler", icon: ShoppingCart, label: "Sipariş Yönetimi", badge: pendingOrders > 0 ? `${pendingOrders} Yeni` : null, badgeColor: "bg-blue-100 text-blue-700" },
        { href: "/tmkontrols/urunler", icon: Package, label: "Mağaza Ürünleri" },
      ],
    },
    {
      label: "Operasyon",
      show: true,
      items: [
        { href: "/tmkontrols/tamirler", icon: Wrench, label: "Onarım Talepleri", badge: pendingRepairs > 0 ? `${pendingRepairs} Bekleyen` : null, badgeColor: "bg-amber-100 text-amber-700" },
        { href: "/tmkontrols/mesajlar", icon: MessageSquare, label: "Mesaj Kutusu" },
        ...(isAdmin ? [{ href: "/tmkontrols/cihaz-alim", icon: Package, label: "Cihaz Alım" }] : []),
      ],
    },
    {
      label: "Sistem Kontrolü",
      show: isAdmin,
      items: [
        { href: "/tmkontrols/users", icon: Users, label: "Üye Yönetimi" },
        { href: "/tmkontrols/ayarlar", icon: Settings, label: "Sistem Ayarları" },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/tmkontrols" ? pathname === "/tmkontrols" : pathname === href || pathname.startsWith(href + "/");

  // Bottom nav items for mobile (most used)
  const bottomNavItems = [
    { href: "/tmkontrols", icon: LayoutDashboard, label: "Ana Ekran" },
    { href: "/tmkontrols/tamirler", icon: Wrench, label: "Onarımlar", badge: pendingRepairs },
    ...(isAdmin ? [{ href: "/tmkontrols/siparisler", icon: ShoppingCart, label: "Siparişler", badge: pendingOrders }] : []),
    { href: "/tmkontrols/mesajlar", icon: MessageSquare, label: "Mesajlar" },
    { href: "/", icon: Home, label: "Site" },
  ];

  const NavContent = () => (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
      {navSections.filter(s => s.show).map((section) => (
        <div key={section.label}>
          <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
                      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {(item as any).badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${active ? "bg-white/20 text-white" : (item as any).badgeColor}`}>
                      {(item as any).badge}
                    </span>
                  )}
                  {!active && <ChevronRight className="w-3 h-3 text-slate-300" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-[260px] bg-white/70 backdrop-blur-2xl border-r border-white/80 shadow-[4px_0_20px_rgba(37,99,235,0.04)] flex-col fixed inset-y-0 z-20">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100/80">
          <Link href="/tmkontrols" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">
                Telefon<span className="text-blue-600">Mühendisi</span>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                {isAdmin ? "Yönetim" : "Teknisyen"}
              </div>
            </div>
          </Link>
        </div>

        <NavContent />

        {/* User Footer */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
              {(userName || "K").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{userName || "Kullanıcı"}</p>
              <p className="text-[10px] text-slate-400 truncate">{isAdmin ? "Sistem Yöneticisi" : "Teknisyen"}</p>
            </div>

          </div>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 shadow-sm">
        <Link href="/tmkontrols" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-900">
            TM<span className="text-blue-600">Kontrol</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {pendingRepairs > 0 && (
            <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
              {pendingRepairs} Bekleyen
            </span>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`lg:hidden fixed top-0 right-0 bottom-0 w-[280px] z-50 bg-white flex flex-col transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Drawer Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">TelfonMühendisi</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isAdmin ? "Yönetim" : "Teknisyen"}</div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* User card in drawer */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">
              {(userName || "K").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-white">{userName || "Kullanıcı"}</p>
              <p className="text-xs text-blue-200">{isAdmin ? "Sistem Yöneticisi" : "Teknisyen"}</p>
            </div>
          </div>
        </div>

        <NavContent />

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-semibold">
            <Home className="w-4 h-4" />
            Siteye Dön
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors">
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
                  active ? "text-blue-600" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {(item as any).badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {(item as any).badge}
                  </span>
                )}
                <item.icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
                <span className={`text-[10px] font-bold ${active ? "text-blue-600" : ""}`}>{item.label}</span>
                {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
