"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code, ShieldCheck, Zap, RefreshCw, Smartphone, CheckCircle2, MapPin, Phone, ArrowRight, HardDrive, Gift, Star, Cpu, Layers, Battery, ChevronRight, ChevronDown, Heart, Wrench } from "lucide-react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LiveOperationDesk = dynamic(() => import('@/components/repair/LiveOperationDesk').then((mod) => mod.LiveOperationDesk), {
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

const TYPING_PHRASES = [
  "Ekranınız mı kırıldı?",
  "Özel yazılıma mı ihtiyacınız var?",
  "Premium kılıf ve aksesuar mı lazım?",
  "İkinci el cihaz mı almak istiyorsun?",
  "Eski cihazını mı satmak istiyorsun?",
  "Bataryanız çok mu çabuk bitiyor?"
];

const HeroTypewriter = memo(function HeroTypewriter() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(50);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleType = () => {
      const i = loopNum % TYPING_PHRASES.length;
      const fullText = TYPING_PHRASES[i];
      
      if (!isDeleting) {
        if (text !== fullText) {
          setText(fullText.substring(0, text.length + 1));
          setTypingSpeed(60);
        } else {
          setTypingSpeed(3000);
          setIsDeleting(true);
        }
      } else {
        if (text !== "") {
          setText(fullText.substring(0, text.length - 1));
          setTypingSpeed(30);
        } else {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(500);
        }
      }
    };
    
    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="h-6 md:h-12 flex items-center justify-center mb-5 md:mb-8 w-full max-w-lg">
      <div
        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 tracking-tight"
        style={{ fontSize: "clamp(0.8rem, 3.5vw, 1.875rem)" }}
      >
        {text}
        <span className="inline-block w-[2px] h-3.5 md:h-6 ml-0.5 bg-orange-500 animate-pulse align-middle" />
      </div>
    </div>
  );
});

const REVIEWS = [
  { text: "Ekranım patlamıştı, aynı gün kargo gönderdim. Ertesi gün tertemiz, sıfır gibi geldi.", name: "Emre K.", device: "Samsung S24 Ultra", initials: "EK", color: "bg-blue-100 text-blue-600" },
  { text: "Huawei P40 Pro'mun bataryası şişmişti, klasik servislerde 'parça yok' dediler. Burası 2 günde bulup taktı.", name: "Selin A.", device: "Huawei P40 Pro Batarya", initials: "SA", color: "bg-pink-100 text-pink-600" },
  { text: "YouTube kanalını 2 yıldır izliyorum. Telefonum suya düşmüştü, kurtardılar. Çok teşekkürler!", name: "Burak T.", device: "iPhone 15 Pro Sıvı Hasarı", initials: "BT", color: "bg-green-100 text-green-600" },
  { text: "Galaxy S23 Ultra'mın anakartı yanmıştı. Başka 3 servis 'olmaz' dedi. Burada 4 günde hallettiler.", name: "Yusuf D.", device: "Samsung S23 Ultra Anakart", initials: "YD", color: "bg-purple-100 text-purple-600" },
  { text: "Xiaomi telefonumun şarj soketi bozulmuştu. Fiyat uygun, işçilik mükemmel. 1 yıl garanti verdiler.", name: "Fatma Ö.", device: "Xiaomi Redmi Şarj Soketi", initials: "FÖ", color: "bg-orange-100 text-orange-600" },
  { text: "iPhone 14 Pro'mun arka camı kırılmıştı. Orijinal parça, Apple yetkili servisinden çok uygun.", name: "Melis C.", device: "iPhone 14 Pro Arka Cam", initials: "MC", color: "bg-indigo-100 text-indigo-600" },
  { text: "OPPO Reno'mun dokunmatik ekranı yarım çalışıyordu. 2 saatte hallettiler.", name: "Caner M.", device: "OPPO Reno 10 Dokunmatik", initials: "CM", color: "bg-teal-100 text-teal-600" },
];

const FEATURES = [
  {
    number: "01",
    title: "Yılların Tecrübesi",
    subtitle: "Deneyim & Uzmanlık",
    desc: "Binlerce başarılı telefon onarımından edindiğimiz derin tecrübeyle, en zorlu arızaları bile pratik ve kalıcı şekilde çözüyoruz.",
  },
  {
    number: "02",
    title: "Şeffaf ve Güvenilir",
    subtitle: "Dürüst Hizmet",
    desc: "Cihazınızı kapalı kapılar ardında değil, tüm süreçleri şeffaf bir şekilde ve güven esasına dayalı olarak onarıyoruz.",
  },
  {
    number: "03",
    title: "1 Yıl Yazılı Garanti",
    subtitle: "Yazılı Güvence",
    desc: "Masamızdan çıkan her işleme ve değişen tüm parçalara 12 ay boyunca koşulsuz, yazılı garanti belgesi veriyoruz.",
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">

      {/* ── Arka Plan (GPU Performans Optimizasyonu - Ağır Maskeleme İşlemleri Kaldırıldı) ── */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
        style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.16) 1px, transparent 1px)`,
            backgroundSize: "2.5rem 2.5rem",
          }}
        />

        
        {/* Canlı Glow Efektleri - GPU Katmanında Blend ve Blur Optimizasyonu */}
        <div 
          className="absolute top-[-5%] left-[-5%] w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_60%)] rounded-full" 
          style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
        />
        <div 
          className="absolute top-[12%] right-[-5%] w-[280px] h-[280px] md:w-[500px] md:h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_60%)] rounded-full" 
          style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
        />
      </div>

      {/* ══ HERO ══ */}
      {/*
        Mobil navbar yüksekliği ~64px.
        pt-20 = 80px — navbar'ın hemen altından başlamayı garantiler.
        md:pt-40 desktop için.
      */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-8 md:min-h-screen md:pt-40 md:pb-16 z-10 overflow-hidden">
        {/* Süzülen ikonlar — pure CSS animasyonları (GPU composited, JS yükü yok) */}
        <div 
          className="absolute left-[8%] top-[12%] lg:left-[15%] lg:top-[16%] w-9 h-9 lg:w-16 lg:h-16 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float1 7s ease-in-out infinite" }}
        >
          <Smartphone className="w-5 h-5 lg:w-7 lg:h-7 text-blue-500" />
        </div>
        
        <div 
          className="absolute right-[10%] top-[16%] lg:right-[20%] lg:top-[12%] w-10 h-10 lg:w-20 lg:h-20 bg-blue-600 rounded-lg lg:rounded-3xl shadow-lg flex items-center justify-center z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float2 8.5s ease-in-out infinite" }}
        >
          <Code className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
        </div>

        <div 
          className="absolute left-[2%] top-[38%] lg:left-[25%] lg:top-[32%] w-9 h-9 lg:w-16 lg:h-16 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float1 6.2s ease-in-out infinite" }}
        >
          <ShieldCheck className="w-5 h-5 lg:w-7 lg:h-7 text-emerald-500" />
        </div>

        <div 
          className="absolute right-[5%] top-[40%] lg:right-[12%] lg:top-[45%] w-9 h-9 lg:w-16 lg:h-16 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float2 7.8s ease-in-out infinite" }}
        >
          <Cpu className="w-5 h-5 lg:w-7 lg:h-7 text-indigo-500" />
        </div>

        <div 
          className="absolute left-[6%] top-[62%] lg:left-[8%] lg:top-[58%] w-9 h-9 lg:w-15 lg:h-15 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float1 5.5s ease-in-out infinite" }}
        >
          <Battery className="w-5 h-5 lg:w-7 lg:h-7 text-emerald-500" />
        </div>

        <div 
          className="absolute right-[2%] top-[68%] lg:right-[22%] lg:top-[64%] w-8 h-8 lg:w-14 lg:h-14 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float2 7.3s ease-in-out infinite" }}
        >
          <Heart className="w-4 h-4 lg:w-6 lg:h-6 text-red-500" />
        </div>

        <div 
          className="absolute left-[3%] bottom-[12%] lg:left-[30%] lg:bottom-[15%] w-8 h-8 lg:w-14 lg:h-14 bg-amber-100 rounded-full shadow-md flex items-center justify-center z-10 border border-amber-200 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float1 6.8s ease-in-out infinite" }}
        >
          <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
        </div>

        <div 
          className="absolute right-[10%] bottom-[14%] lg:right-[16%] lg:bottom-[10%] w-9 h-9 lg:w-14 lg:h-14 bg-white rounded-lg lg:rounded-2xl shadow-md lg:shadow-lg flex items-center justify-center border border-gray-100 z-10 opacity-85 lg:opacity-100 pointer-events-none"
          style={{ animation: "float2 9s ease-in-out infinite" }}
        >
          <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-500" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col items-center text-center max-w-4xl z-20">

          {/* Ana Başlık */}
          {/* CSS animasyonu: JS yüklenmesini beklemeden görünür (LCP) */}
          <h1
            className="hero-in font-black text-gray-900 tracking-tighter leading-[1.06] mb-3 md:mb-5 px-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 11vw, 4.5rem)",
            }}
          >
            Cihazınızı Doğrudan{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-blue-100/50 blur-xl rounded-full hidden md:block" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800">
                Telefon Mühendisi&apos;ne
              </span>
            </span>{" "}
            Emanet Edin.
          </h1>

          {/* Typewriter (İzole - Sadece bu bileşen güncellenir) */}
          <HeroTypewriter />

          {/* CTA Butonu + Rozetler */}
          <div
            className="hero-in flex flex-col items-center gap-3 w-full"
            style={{ animationDelay: "120ms" }}
          >
            <Link
              href="/tamir"
              className="group relative w-4/5 max-w-xs md:w-auto md:max-w-none px-8 py-3 md:px-14 md:py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-full font-black text-sm md:text-lg tracking-wide flex items-center justify-center gap-2 transition-all duration-500 shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] hover:-translate-y-1 overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Ücretsiz Fiyat Al</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* ── Scroll Down Indicator — Sadece Mobil ── */}
        <motion.div
          className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Keşfet</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ NEDEN BİZ (RESPONSIVE CARD GRID - SIMPLIFIED) ══ */}
      <section className="relative z-10 bg-[#fbfbfb] border-t border-b border-slate-100/50 overflow-hidden">
        {/* Modern high-tech grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-25 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-5xl pt-4 pb-14 md:py-20 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12 px-2">
            <h2 className="font-black text-slate-900 tracking-tight mb-3" style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.5rem)" }}>
              Neden{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Telefon Mühendisi?
              </span>
            </h2>
            <p className="text-slate-500 font-semibold text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Binlerce başarılı onarım tecrübemiz ve şeffaf hizmet anlayışımızla cihazlarınızı en güvenilir ellere teslim edin.
            </p>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                        {feat.subtitle}
                      </span>
                      <span className="text-xl font-black text-blue-100 group-hover:text-blue-200 transition-colors duration-300">
                        {feat.number}
                      </span>
                    </div>
                    
                    <h3 className="font-black tracking-tight text-slate-900 text-sm md:text-base">
                      {feat.title}
                    </h3>
                    
                    <p className="text-slate-500 font-medium text-xs leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══ YOUTUBE / CANLI OPERASYON ══ */}
      <LiveOperationDesk />

      {/* ══ MÜŞTERİ YORUMLARI ══ */}
      <section className="bg-slate-50 border-t border-slate-100/50 py-16 relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-black text-slate-900 mb-3 tracking-tight" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
            Binlerce Cihaz Kurtarıldı
          </h2>
          <p className="text-slate-500 font-medium text-xs md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            Bizi bizden değil, cihazlarını hayata döndürdüğümüz müşterilerimizden dinleyin.
          </p>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-lg mx-auto flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-400">
              <Star className="w-8 h-8 fill-slate-100" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg">Henüz Yorum Yapılmamış</h3>
              <p className="text-slate-400 font-medium text-xs md:text-sm">
                Cihazınızı tamir ettirdiniz mi? Deneyiminizi paylaşan ilk kişi siz olun!
              </p>
            </div>

            {session ? (
              <div className="w-full space-y-3">
                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                  Giriş yaptınız! Yorum gönderme sistemi yakında aktif edilecektir.
                </div>
                <button
                  disabled
                  className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-full font-bold text-sm tracking-wide cursor-not-allowed"
                >
                  Yorum Yaz (Yakında)
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/giris")}
                className="group relative px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                İlk Yorumu Siz Yapın (Giriş Yap)
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ HARİTA ══ */}
      <section className="bg-slate-50 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl py-10 md:py-24">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="font-bold text-gray-900 mb-1 tracking-tight" style={{ fontSize: "clamp(1.1rem, 5vw, 3rem)" }}>
              Bizi Ziyaret Edin
            </h2>
            <p className="text-gray-500 font-medium text-[11px] md:text-base">
              Cihazınızı elden teslim etmek veya bir kahvemizi içmek için bekliyoruz.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-7 bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-[0_6px_24px_rgb(0,0,0,0.04)] border border-gray-100">
            {/* Sol Bilgi — Mobilde üst başlık, alt yan yana detaylar; masaüstünde dikey yığılım */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between gap-4 px-1 py-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0">
              <div>
                <h3 className="font-bold text-gray-900 text-base md:text-xl leading-tight">
                  Semih İletişim
                </h3>
                <p className="text-gray-500 text-[10px] md:text-sm leading-none mt-1">Merkez Servis</p>
              </div>

              {/* Detaylar */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                      4 Temmuz Mah, İnönü Cd. No:2<br />Karamürsel / Kocaeli
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                      <a href="mailto:destek@telefonmuhendisi.com" className="hover:text-blue-600 transition-colors font-bold text-slate-900">destek@telefonmuhendisi.com</a><br />
                      Destek & WhatsApp: 0544 945 64 17<br />
                      Sabit Hat: 0262 511 00 00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Harita */}
            <div className="w-full lg:w-2/3 h-[200px] md:h-[420px] rounded-xl md:rounded-3xl overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
              <iframe
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=tr&amp;q=4%20Temmuz%20Mah,%20%C4%B0n%C3%B6n%C3%BC%20Cd.%20No:2,%2041500%20Karam%C3%BCrsel/Kocaeli+(Semih%20%C4%B0leti%C5%9Fim)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
