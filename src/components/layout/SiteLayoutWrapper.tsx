"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { AiAsistanWidget } from "@/components/ai-asistan/AiAsistanWidget";
import { PageTransitionProvider } from "@/components/layout/PageTransitionProvider";

export function SiteLayoutWrapper({ children, settings }: { children: React.ReactNode, settings?: Record<string, string> }) {
  const pathname = usePathname();
  const isStandalone = 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/tmkontrols") || 
    pathname?.startsWith("/tmkontrols-giris");

  // Admin ve MDM Dashboard panelinde site Header, Footer ve Asistanını GİZLE
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen relative z-0 pointer-events-auto">
        <Header settings={settings} />
        <PageTransitionProvider>
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
        </PageTransitionProvider>
        <Footer settings={settings} />
      </div>
      <BottomNav />
      <AiAsistanWidget />
    </>
  );
}
