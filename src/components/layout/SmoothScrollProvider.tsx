"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Lenis kaldırıldı — tarayıcının native smooth scroll'u kullanılıyor.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const isControlDeck = 
      pathname?.startsWith("/tmhackerz") || 
      pathname?.startsWith("/tmerisim") || 
      pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/tmkontrols");

    if (!isControlDeck) {
      document.documentElement.style.scrollBehavior = "smooth";
    } else {
      document.documentElement.style.scrollBehavior = "auto";
    }
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, [pathname]);

  return <>{children}</>;
}
