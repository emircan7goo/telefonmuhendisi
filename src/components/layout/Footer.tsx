import Link from "next/link";
import { Smartphone, Instagram, Youtube, Phone, Mail, MapPin, Cpu } from "lucide-react";

export function Footer({ settings }: { settings?: Record<string, string> }) {
  const siteTitle = settings?.siteTitle || "Telefon Mühendisi";
  const titleParts = siteTitle.split(" ");
  const firstPart = titleParts[0];
  const restPart = titleParts.slice(1).join(" ");
  const phone = settings?.contactPhone || "+905449456417";

  const linkCols = [
    {
      title: "Hizmetler",
      links: [
        { label: "Ekran Değişimi", href: "/tamir" },
        { label: "Batarya Yenileme", href: "/tamir" },
        { label: "Anakart Onarımı", href: "/tamir" },
        { label: "Sıvı Hasarı", href: "/tamir" },
        { label: "Uzaktan Teşhis", href: "/tamir" },
      ],
    },
    {
      title: "Ekosistem",
      links: [
        { label: "Aksesuarlar", href: "/urunler" },
        { label: "İkinci El Cihazlar", href: "/urunler" },
        { label: "Şarj İstasyonları", href: "/urunler" },
        { label: "Premium Kılıflar", href: "/urunler" },
        { label: "Koruma Camları", href: "/urunler" },
      ],
    },
    {
      title: "Kurumsal",
      links: [
        { label: "Hakkımızda", href: "/kurumsal" },
        { label: "Kariyer", href: "/kurumsal" },
        { label: "Garanti Şartları", href: "/kurumsal" },
        { label: "İade Politikası", href: "/kurumsal" },
        { label: "Bize Ulaşın", href: "/kurumsal" },
      ],
    },
  ];

  const socials = [
    { icon: Instagram, href: "https://www.instagram.com/telefonmuhendisi/", color: "hover:text-pink-500 hover:border-pink-500/50", label: "Telefon Mühendisi" },
    { icon: Instagram, href: "https://www.instagram.com/semih.iletisim/", color: "hover:text-pink-600 hover:border-pink-600/50", label: "Semih İletişim" },
    { icon: Youtube, href: "https://www.youtube.com/@telefonmuhendisi", color: "hover:text-red-500 hover:border-red-500/50", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-white border-t border-slate-200 text-slate-600 overflow-hidden" aria-label="Footer">
      
      {/* Subtle Aurora Glow on Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(59,130,246,0.06),transparent)]" />

      <div className="container-custom pt-12 md:pt-20 pb-8 md:pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 pb-12 md:pb-16 border-b border-slate-200">
          
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 group w-fit">

              <span className="font-black text-xl md:text-2xl tracking-tighter whitespace-nowrap flex items-center">
                <span className="text-slate-900">{firstPart}</span>
                {restPart && <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 ml-1">{restPart}</span>}
              </span>
            </Link>
            <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed mb-4 md:mb-8 max-w-sm">
              Kocaeli, Karamürsel&apos;de bulunan Semih İletişim olarak esnaflık geleneğiyle hizmet veriyoruz. Telefonlarınız bizim masamızda güvende.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {socials.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    title={item.label}
                    className={`w-8 h-8 md:w-10 md:h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-all duration-300 ${item.color} shadow-glass-sm`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {linkCols.map((col, index) => (
            <div key={col.title} className={`${index === 2 ? "col-span-2 sm:col-span-1" : "col-span-1"}`}>
              <h3 className="font-bold text-slate-900 text-xs md:text-sm mb-4 md:mb-6 uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-2.5 md:space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-500 hover:text-slate-900 hover:pl-1 transition-all duration-300 text-xs md:text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-500/50 opacity-0 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="py-6 md:py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Telefon */}
          <div className="col-span-1 flex items-center gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <a href="tel:05449456417" className="font-black text-slate-900 hover:text-blue-600 transition-colors text-xs md:text-base block">0544 945 64 17</a>
              <div className="text-[10px] md:text-sm text-slate-500">7/24 Destek Hattı</div>
            </div>
          </div>
          
          {/* E-posta */}
          <div className="col-span-1 flex items-center gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <a href="mailto:destek@telefonmuhendisi.com" className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-xs md:text-base block">destek@telefonmuhendisi.com</a>
              <div className="text-[10px] md:text-sm text-slate-500">Online Müşteri Hizmetleri</div>
            </div>
          </div>

          {/* Adres */}
          <div className="col-span-1 flex items-center gap-3 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-xs md:text-base">Kocaeli / Karamürsel</div>
              <div className="text-[10px] md:text-sm text-slate-500">4 Temmuz Mah, İnönü Cd. No:2</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 border-t border-slate-200 mt-4">
          <p>© 2026 Telefon Mühendisi. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="/kurumsal" className="hover:text-slate-900 transition-colors">Gizlilik Politikası</a>
            <a href="/kurumsal" className="hover:text-slate-900 transition-colors">Kullanım Koşulları</a>
            <a href="/kurumsal" className="hover:text-slate-900 transition-colors">KVKK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
