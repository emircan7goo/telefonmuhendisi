import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "🛡️ TM Cihaz Yönetim & Güvenlik Konsolu",
  description: "Kurumsal Android Cihaz Yönetimi (MDM) ve Canlı Telemetri Takip Merkezi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#020617',
        color: '#f8fafc',
        zIndex: 99999,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {children}
    </div>
  );
}
