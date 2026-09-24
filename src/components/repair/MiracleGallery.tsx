"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";

const MIRACLES = [
  {
    id: 1,
    title: "Denize Düşen 14 Pro Max",
    status: "ÇÖP DENİLMİŞTİ",
    desc: "Başka servislerin 'anakart yanmış, çöp' dediği tuzlu suya düşen cihazı 48 saatlik mikro-lehimleme operasyonuyla tamamen hayata döndürdük.",
    beforeImg: "https://images.unsplash.com/photo-1592839722378-01306b32ad14?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=600",
    views: "1.2M",
  },
  {
    id: 2,
    title: "Üzerinden Araba Geçen S23 Ultra",
    status: "PARAM PARÇA",
    desc: "Ekranı ve kasası tamamen un ufak olmuş S23 Ultra'nın beynini (NAND ve CPU) kurtarıp yepyeni bir kasaya aktararak verilerini kurtardık.",
    beforeImg: "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=600",
    views: "850K",
  },
  {
    id: 3,
    title: "Apple Logosu'nda Kalan iPad Pro",
    status: "YAZILIM ÇÖKMESİ",
    desc: "Müşterimizin yıllardır sakladığı fotoğraflar silinmeden, Apple'ın bile 'sıfırlanmalı' dediği tableti özel yazılım araçlarımızla kurtardık.",
    beforeImg: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1585790050270-19217f735d46?auto=format&fit=crop&q=80&w=600",
    views: "420K",
  }
];

export function MiracleGallery() {
  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Fail to Fix Müzesi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
              Onlar "Çöp" Dedi, <br/>Biz İse <span className="text-blue-600">Dirilttik.</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Türkiye'nin dört bir yanından gelen "yapılamaz" denilen en imkansız vakalar ve onların geri dönüş hikayeleri.
            </p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Tüm Vakaları İncele <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MIRACLES.map((miracle, idx) => (
            <motion.div 
              key={miracle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-300"
            >
              {/* Image Split Container */}
              <div className="relative h-60 w-full overflow-hidden flex bg-gray-900">
                <div className="w-1/2 h-full relative border-r-2 border-red-500/50 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest rounded shadow-lg z-10">ÖNCESİ</div>
                  <img src={miracle.beforeImg} alt="Öncesi" className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="w-1/2 h-full relative">
                   <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-[10px] font-black tracking-widest rounded shadow-lg z-10">SONRASI</div>
                   <img src={miracle.afterImg} alt="Sonrası" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {miracle.status}
                  </div>
                  <div className="text-gray-400 text-xs font-bold">{miracle.views} İzlenme</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">{miracle.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {miracle.desc}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-blue-600 font-bold text-sm cursor-pointer hover:underline">
                  <span className="flex items-center gap-2"><Wrench className="w-4 h-4" /> Operasyon Detayları</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
