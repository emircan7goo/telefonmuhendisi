"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  ArrowLeft, Check, Star, Heart, Share2, Sparkles 
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export interface ProductProps {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  originalPrice: string | null;
  stock: number;
  brand: string | null;
  condition?: string | null;
  images: any;
  features?: any;
}

export function ProductDetailClient({ product }: { product: ProductProps }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const priceNum = parseFloat(product.price) || 0;
  const origPriceNum = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discountPct = origPriceNum && origPriceNum > priceNum 
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
    : null;

  // Process images
  const imageList: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80"];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: priceNum,
      quantity,
      image: imageList[0],
      brand: product.brand || "Telefon Mühendisi",
    });
    setAdded(true);
    toast.success(`${product.name} (${quantity} adet) sepete eklendi!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ürün linki kopyalandı!");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50/50">
      <div className="container-custom max-w-6xl">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Mağazaya Dön
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white px-3 py-1.5 rounded-full border border-slate-200 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" /> Paylaş
          </button>
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-100/70 border border-slate-100 overflow-hidden flex items-center justify-center">
              <Image
                src={imageList[selectedImage] || imageList[0]}
                alt={product.name}
                fill
                className="object-contain p-6 transition-all duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 500px"
              />
              {discountPct && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                  %{discountPct} İndirim
                </span>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {imageList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-50 ${
                      selectedImage === idx ? "border-blue-600 shadow-md" : "border-slate-100 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              {product.brand && (
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {product.brand}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Review snippet placeholder */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  (5.0 Müşteri Memnuniyeti)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-3xl font-black text-slate-900">
                  {priceNum.toLocaleString("tr-TR")} ₺
                </span>
                {origPriceNum && origPriceNum > priceNum && (
                  <span className="text-base font-semibold text-slate-400 line-through">
                    {origPriceNum.toLocaleString("tr-TR")} ₺
                  </span>
                )}
                <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {product.stock > 0 ? "Stokta Var" : "Tükenmek Üzere"}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm text-slate-600 mb-8 leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/40 border border-blue-100/50">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">
                      Garantili & Faturalı
                    </p>
                    <p className="text-slate-500 text-[10px]">Orijinal & Test Edilmiş</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/50">
                  <Truck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Hızlı Kargo</p>
                    <p className="text-slate-500 text-[10px]">Aynı gün gönderim</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-11 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-lg active:scale-[0.99]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Eklendi
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Sepete Ekle
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/sepet"
                className="w-full h-11 rounded-xl font-semibold text-xs text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                Sepete Git ve Siparişi Tamamla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
