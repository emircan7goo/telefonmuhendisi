import { FloatingUI } from "@/components/ui/FloatingUI";
import { ShieldCheck, Video, Heart, Cpu, MapPin, Phone, Mail, Instagram, Youtube, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Kurumsal | Semih İletişim",
  description: "Kocaeli Karamürsel'de yer alan Semih İletişim'in hikayesi ve Telefon Mühendisi yolculuğu.",
};

export default function CorporatePage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-white">
      <FloatingUI />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gradient-to-bl from-blue-50 to-transparent -z-10 rounded-bl-[100px]" />
      <div className="absolute top-40 left-10 w-72 h-72 rounded-full -z-10 bg-[radial-gradient(closest-side,rgba(59,130,246,0.06),transparent)]" />

      <div className="container-custom max-w-6xl">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Karamürsel'den <br/>
            Tüm Türkiye'ye <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Uzanan Güven.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Kocaeli, Karamürsel'in kalbinde küçük bir esnaf dükkanı olarak başlayan hikayemiz, bugün <strong>Telefon Mühendisi</strong> YouTube kanalı aracılığıyla milyonlarca izlenmeye ve tüm Türkiye'ye ulaşan devasa bir operasyona dönüştü.
          </p>
        </div>

        {/* The YouTube Effect */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white mb-24 relative overflow-hidden shadow-2xl border border-slate-800">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(239,68,68,0.12),transparent)]" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-red-500/20">
                   <Video className="w-4 h-4" /> ŞEFFAF İŞÇİLİK
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white">
                  Masamızda <span className="text-red-500">gizli hiçbir şey yok.</span>
                </h2>
                <p className="text-slate-200 text-lg leading-relaxed font-medium mb-6">
                  Sektördeki en büyük sorunlardan biri olan "Acaba cihazımdan parça çalınır mı?" korkusunu, işimizi tamamen şeffaflaştırarak çözdük. Onarım masamıza gelen cihazların kurtarılma süreçlerini YouTube kanalımızda tüm detaylarıyla yayınlıyoruz.
                </p>
                <p className="text-slate-300 font-medium">
                  İşimizi severek yapıyor ve uyguladığımız tüm işlemleri şeffaf bir şekilde sizlerle paylaşıyoruz.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                   <div className="text-4xl font-black text-white mb-2">1M+</div>
                   <div className="text-slate-400 text-sm">Aylık YouTube İzlenmesi</div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm mt-8">
                   <div className="text-4xl font-black text-white mb-2">%100</div>
                   <div className="text-slate-400 text-sm">Şeffaf Tamir Süreci</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Values */}
        <div id="hikayemiz" className="mb-24">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Değerlerimiz</h2>
             <p className="text-slate-500 font-medium max-w-2xl mx-auto">
               Esnaflık samimiyetini, ileri teknoloji ve mühendislik ile harmanlayarak sizlere sunuyoruz.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Gerçek Esnaf Güveni", desc: "Karamürsel'deki dükkanımızda yıllardır oluşturduğumuz 'güvenilir mahalle esnafı' kültürünü tüm Türkiye'ye taşıyoruz. Cihazınızı gönül rahatlığıyla teslim edebilirsiniz." },
                { icon: ShieldCheck, title: "Garantili ve Titiz Onarım", desc: "Cihazlarınızı amatörce değil, tam donanımlı profesyonel ekipmanlarla onarıyor ve yaptığımız her işleme garanti veriyoruz." },
                { icon: Cpu, title: "Profesyonel Anakart Çözümleri", desc: "Anakart arızalarında sadece parça değiştirmek yerine sorunun kaynağına inerek cihazınızı en uygun maliyetle ve kalıcı olarak onarıyoruz." }
              ].map((val, i) => {
                const Icon = val.icon;
                return (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 text-blue-600">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">{val.desc}</p>
                  </div>
                )
              })}
           </div>
        </div>

        {/* Elite Contact & Location Section */}
        <div className="mb-24">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
             
             {/* Info Cards */}
             <div className="flex flex-col gap-6">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center border border-slate-800">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.22),transparent)]" />
                  <h3 className="text-3xl font-black mb-8 relative z-10">Bize Ulaşın</h3>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                        <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">Semih İletişim Merkez</div>
                        <p className="text-slate-400 font-medium">4 Temmuz Mah, İnönü Cd. No:2<br/>41500 Karamürsel / Kocaeli</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">0544 945 64 17</div>
                        <p className="text-slate-400 font-medium">Müşteri Destek & WhatsApp Hattı</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Elite Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <a href="https://www.instagram.com/telefonmuhendisi/" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </div>
                     <div className="font-black text-xl mb-1">@telefonmuhendisi</div>
                     <div className="text-white/80 text-sm font-medium">Kanal Instagramı</div>
                   </a>

                   <a href="https://www.instagram.com/semih.iletisim/" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </div>
                     <div className="font-black text-xl mb-1">@semih.iletisim</div>
                     <div className="text-white/80 text-sm font-medium">Mağaza Instagramı</div>
                   </a>
                </div>
             </div>

             {/* Map Embed */}
             <div className="bg-slate-100 rounded-3xl p-2 h-full min-h-[400px] border border-slate-200 shadow-inner relative overflow-hidden group">
               {/* Note: We use a generic embed query for "4 Temmuz Mah, İnönü Cd. No:2, Karamürsel/Kocaeli". */}
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3030.793264669862!2d29.61517431539422!3d40.69055864380649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb185c70685959%3A0xc3f5c721b0e35fa8!2zNCAgVGVtbXV6IE1haCwgxLBuw7Zuw7wgQ2QuIE5vOjIsIDQxNTAwIEthcmFtw7xyc2VsL0tvY2FlbGk!5e0!3m2!1str!2str!4v1689694215234!5m2!1str!2str" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, borderRadius: '1.25rem' }} 
                 allowFullScreen={false} 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 className="absolute inset-0 w-full h-full p-2 rounded-3xl"
               />
             </div>

           </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-blue-600 rounded-3xl p-12 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
          <h2 className="text-3xl font-black mb-6">Cihazınız Bizimle Güvende</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto font-medium">
            Kocaeli/Karamürsel'deki işletmemize elden teslim edebilir veya Türkiye'nin her noktasından kargo ile onarıma gönderebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/tamir" className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-lg transition-all hover:-translate-y-1">
              Anında Onarım Fiyatı Öğren
            </a>
            <a href="https://www.youtube.com/@telefonmuhendisi" target="_blank" rel="noreferrer" className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
              <Video className="w-5 h-5" /> Videolarımızı İzle
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
