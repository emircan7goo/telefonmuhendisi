import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck, PenTool } from "lucide-react";
import { DEVICE_DATABASE } from "@/data/devices";

interface Props {
  params: Promise<{ brand: string; model: string }>;
}

const CITY = "Karamürsel";
const REGION = "Kocaeli";

function findDevice(brandId: string, modelId: string) {
  const brand = DEVICE_DATABASE.find((b) => b.id === brandId);
  const model = brand?.models.find((m) => m.id === modelId);
  if (!brand || !model) return null;
  return { brand: brand.name, model: model.name, repairs: model.repairs };
}

export function generateStaticParams() {
  return DEVICE_DATABASE.flatMap((b) =>
    b.models.map((m) => ({ brand: b.id, model: m.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const device = findDevice(resolvedParams.brand, resolvedParams.model);
  if (!device) return {};
  // Model adı zaten markayı içeriyorsa ("Galaxy S23" hariç) tekrar etme
  const { brand, model } = device;
  const name = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`;

  return {
    title: `${name} Tamiri ${CITY} ${REGION} | Ekran ve Batarya Değişimi`,
    description: `${CITY} ${REGION}'de garantili ${name} tamiri: orijinal ekran değişimi, batarya değişimi ve anakart onarımı. Ücretsiz arıza tespiti, hemen fiyat alın!`,
    alternates: {
      canonical: `https://telefonmuhendisi.com/tamir/${resolvedParams.brand}/${resolvedParams.model}`
    },
    // "Diğer model" sayfaları içerik açısından zayıf — dizine eklenmesin
    robots: resolvedParams.model.endsWith("_diger") ? { index: false, follow: true } : undefined,
  };
}

export default async function SEORepairPage({ params }: Props) {
  const resolvedParams = await params;
  const device = findDevice(resolvedParams.brand, resolvedParams.model);
  if (!device) notFound();
  const name = device.model.toLowerCase().startsWith(device.brand.toLowerCase())
    ? device.model
    : `${device.brand} ${device.model}`;
  const minPrice = Math.min(...device.repairs.map((r) => r.price).filter((p) => p > 0));

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-custom">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-700 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" /> 6 Ay Garantili Onarım
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              {name} <span className="text-blue-600">Tamiri ve Teknik Servis</span>
            </h1>
            
            <p className="text-lg text-slate-600">
              Cihazınızda yaşadığınız ekran kırılması, batarya hızlı bitmesi, şarj soketi arızası veya anakart sorunlarında 
              Karamürsel ve Kocaeli'nin güvenilir teknik servisi olarak yanınızdayız. 
              Uzman teknisyenlerimiz {name} cihazınızı ilk günkü performansına kavuşturur.
            </p>

            <ul className="space-y-3 font-medium text-slate-700">
              <li className="flex items-center gap-3"><PenTool className="w-5 h-5 text-indigo-500" /> Orijinal veya A Kalite Yedek Parça</li>
              <li className="flex items-center gap-3"><PenTool className="w-5 h-5 text-indigo-500" /> Aynı Gün Teslimat (Stok Durumuna Göre)</li>
              <li className="flex items-center gap-3"><PenTool className="w-5 h-5 text-indigo-500" /> Ücretsiz Arıza Tespiti</li>
            </ul>

            <div className="pt-6">
              <Link href="/tamir" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Hemen Fiyat Alın <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
        
        {/* SEO Metinleri */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 prose prose-slate max-w-none">
          <div>
            <h3>{name} Ekran Değişimi</h3>
            <p>Eğer cihazınızın ekranı kırıldıysa, dokunmatik basmıyorsa veya ekranda mürekkep akması (morarma/siyah leke) varsa ekran değişimi gereklidir. Orijinal kalitesinde ekranlar kullanarak renk ve dokunmatik hassasiyet kaybı yaşamanızı engelliyoruz.</p>
          </div>
          <div>
            <h3>{name} Batarya (Pil) Değişimi</h3>
            <p>Cihazınızın şarjı çok hızlı bitiyor, aniden kapanıyor veya batarya şişmiş ise değişim vakti gelmiştir. Pil sağlığınızı %100 yapacak yüksek kapasiteli bataryalar ile cihaz ömrünü uzatıyoruz.</p>
          </div>
        </div>
      </div>
      
      {/* Schema.org LocalBusiness & Service Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": `${name} Tamiri`,
          "provider": {
            "@type": "LocalBusiness",
            "name": "Telefon Mühendisi",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "4 Temmuz Mah. İnönü Cd. No:2",
              "addressLocality": CITY,
              "addressRegion": REGION,
              "addressCountry": "TR"
            },
            "telephone": "+905449456417",
            "url": "https://telefonmuhendisi.com"
          },
          "areaServed": [CITY, REGION],
          ...(Number.isFinite(minPrice) && {
            "offers": { "@type": "AggregateOffer", "priceCurrency": "TRY", "lowPrice": minPrice },
          }),
          "description": `${name} ekran değişimi, batarya değişimi ve teknik servis hizmetleri.`
        })
      }} />
    </div>
  );
}
