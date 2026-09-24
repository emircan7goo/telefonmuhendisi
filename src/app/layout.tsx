import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteLayoutWrapper } from "@/components/layout/SiteLayoutWrapper";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://telefonmuhendisi.com"),
  title: {
    default: "Telefon Mühendisi | Kocaeli Karamürsel Garantili Telefon Tamiri",
    template: "%s | Telefon Mühendisi",
  },
  description:
    "Kocaeli Karamürsel'in en güvenilir telefon tamircisi Telefon Mühendisi. iPhone, Samsung, Xiaomi garantili tamir, ekran değişimi ve ikinci el cihaz alım satım merkezi.",
  keywords: [
    "telefon tamiri", "iphone tamiri", "ikinci el telefon", "telefon aksesuar", 
    "ekran değişimi", "batarya değişimi", "anakart tamiri", "telefon alım satım", 
    "kılıf", "koruyucu cam", "elektronik", "kargo ile tamir", "uzaktan destek"
  ],
  authors: [{ name: "Telefon Mühendisi" }],
  creator: "Telefon Mühendisi",
  publisher: "Telefon Mühendisi",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://telefonmuhendisi.com",
    siteName: "Telefon Mühendisi",
    title: "Telefon Mühendisi | Kocaeli Garantili Onarım",
    description: "Kocaeli Karamürsel'de garantili telefon tamiri ve güvenilir elektronik alışverişi.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Telefon Mühendisi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telefon Mühendisi | Kocaeli Garantili Onarım",
    description: "Kocaeli Karamürsel'de garantili telefon tamiri ve güvenilir elektronik alışverişi.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { AuthProvider } from "@/components/auth/AuthProvider";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCachedSettings = unstable_cache(
  async () => {
    try {
      const allSettings = await db.query.settings.findMany();
      return allSettings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    } catch {
      return {} as Record<string, string>;
    }
  },
  ['global-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settingsObj: Record<string, string> = {};
  try {
    settingsObj = await getCachedSettings();
  } catch {}

  return (
    <html lang="tr" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Telefon Mühendisi",
              "image": "https://telefonmuhendisi.com/icons/icon-512.png",
              "telephone": "+905449456417",
              "email": "destek@telefonmuhendisi.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "4 Temmuz Mah. İnönü Cd. No:2",
                "addressLocality": "Karamürsel",
                "addressRegion": "Kocaeli",
                "addressCountry": "TR"
              },
              "url": "https://telefonmuhendisi.com",
              "priceRange": "$$",
              "logo": "https://telefonmuhendisi.com/icons/icon-512.png",
              "areaServed": ["Karamürsel", "Kocaeli"],
              "sameAs": [
                "https://www.instagram.com/telefonmuhendisi/",
                "https://www.instagram.com/semih.iletisim/"
              ]
            })
          }}
        />
      </head>
      <body className="font-body antialiased bg-slate-50 text-slate-900 relative selection:bg-blue-600 selection:text-white">
        
        <SmoothScrollProvider>
          <AuthProvider>
            <CartProvider>
              <SiteLayoutWrapper settings={settingsObj}>{children}</SiteLayoutWrapper>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "rgba(10, 10, 15, 0.8)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    color: "#f8f9fa",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: { primary: "#00f5d4", secondary: "#030305" },
                  },
                  error: {
                    iconTheme: { primary: "#f15bb5", secondary: "#030305" },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
