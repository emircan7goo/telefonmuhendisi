import { ShieldCheck, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Sıkça Sorulan Sorular | Telefon Mühendisi",
  description: "Cihaz tamiri, garantiler, yedek parça ve süreçlerimiz hakkında merak ettiğiniz her şey.",
};

export default function FAQPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-slate-50">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(59,130,246,0.06),transparent)]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(99,102,241,0.06),transparent)]" />

      <div className="container-custom max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide uppercase mb-6">
            <MessageCircle className="w-4 h-4" /> Destek Merkezi
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Cihazınızı bize emanet etmeden önce aklınıza takılan tüm soru işaretlerini ortadan kaldırıyoruz. Aradığınız cevabı bulamazsanız, bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
             {[
               { q: "Cihazımdaki veriler silinir mi?", a: "Hayır. Yazılım atılması gereken nadir durumlar dışında verilerinize dokunulmaz ve silinmez." },
               { q: "Garanti süreniz ne kadar?", a: "Değişen parçalar ve işçiliğimiz için tam 1 yıl (365 gün) garanti veriyoruz." },
               { q: "Orijinal parça mı kullanıyorsunuz?", a: "Evet, tüm markalar için kalite kontrolden geçmiş %100 orijinal yedek parçalar kullanıyoruz." },
               { q: "Kargo ücretini kim ödüyor?", a: "Tamir için gönderilen cihazlarda gidiş-dönüş kargo ücreti bize aittir." },
               { q: "Fiyatı ne zaman öğrenebilirim?", a: "WhatsApp veya sitemiz üzerinden cihazın durumunu anlattığınız an net fiyat verilir." },
               { q: "Hangi markalara bakıyorsunuz?", a: "Apple, Samsung, Xiaomi, Huawei, Oppo, Realme, Tecno, Poco ve diğer tüm bilindik markalar." },
               { q: "Anakart tamiri yapıyor musunuz?", a: "Evet, 'çöp oldu' denilen anakartları bile mikroskobik seviyede onarıyoruz." },
               { q: "Sıvı teması olan cihaz kurtarılır mı?", a: "Zamanında müdahale edilirse evet. Oksitlenmeyi özel solüsyonlarla temizleyip onarıyoruz." },
               { q: "Ekran değişiminde True Tone kaybolur mu?", a: "Hayır. Özel cihazlarımızla eski ekrandaki True Tone kodunu yeni ekrana aktarıyoruz." },
               { q: "Batarya sağlığım %100 olur mu?", a: "Evet. Orijinal kapasiteli pillerle batarya sağlığınız ilk günkü %100 seviyesine döner." },
               { q: "Tamir süresi ortalama nedir?", a: "Mağazamızda ortalama 45 dakika. Kargo ile gelenler aynı gün yapılıp kargolanır." },
               { q: "Şarj soketi tamiri ne kadar sürer?", a: "Soket değişimleri ortalama 30-45 dakika içinde tamamlanır." },
               { q: "Arka cam değişimi cihazı açmadan mı yapılıyor?", a: "Evet, lazer makinesi ile cihazın içi açılmadan sadece arka cam değiştirilir." },
               { q: "Yüz tanıma (Face ID) tamiri mümkün mü?", a: "Evet, sıvı hasarı veya darbe kaynaklı Face ID arızalarını nokta atışı onarıyoruz." },
               { q: "Kamera camı değişimi kamerayı bozar mı?", a: "Uzman ellerde kesinlikle bozmaz. Kamera merceğine toz girmeden cam yenilenir." },
               { q: "Tablet veya iPad tamiri var mı?", a: "Evet, her model iPad ve Android tablet onarımını yapıyoruz." },
               { q: "Cihazım tamirdeyken yerine cihaz veriyor musunuz?", a: "Mağazamıza gelen müşterilerimiz için yedek cihaz imkanımız bulunmaktadır." },
               { q: "Apple yetkili servisinde 'yapılamaz' dediler?", a: "Yetkili servisler anakart tamiri yapmaz, değişim önerir. Biz anakartı onarırız." },
               { q: "Ödeme seçenekleriniz nelerdir?", a: "Kredi kartı, banka havalesi/EFT ve kapıda ödeme seçeneklerimiz mevcuttur." },
               { q: "Size nasıl güvenebilirim?", a: "YouTube kanalımızdaki yüzlerce canlı tamir videomuzu izleyebilir, şeffaflığımızı görebilirsiniz." },
             ].map((faq, i) => (
               <details key={i} className="group py-4 border-b border-slate-100">
                 <summary className="flex justify-between items-center font-bold text-slate-800 text-sm cursor-pointer list-none hover:text-blue-600 transition-colors">
                   {faq.q}
                   <span className="transition-transform group-open:rotate-180 text-blue-500">
                     <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                   </span>
                 </summary>
                 <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium animate-fade-in pr-6">
                   {faq.a}
                 </p>
               </details>
             ))}
           </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-blue-600 rounded-[2rem] p-10 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(255,255,255,0.12),transparent)]" />
           <ShieldCheck className="w-12 h-12 text-white mx-auto mb-6" />
           <h3 className="text-2xl font-black text-white mb-4">Cevabını bulamadınız mı?</h3>
           <p className="text-blue-100 font-medium mb-8 max-w-lg mx-auto">
             Canlı destek hattımız 7/24 hizmetinizde. Cihazınızın arızasını anlatın, anında çözüm bulalım.
           </p>
           <a href="https://wa.me/905449456417" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
             WhatsApp'tan Soru Sor
           </a>
        </div>

      </div>
    </div>
  );
}
