"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  badgeColor: string | null;
  image: string;
  inStock: boolean;
};

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: Number(product.id) || Date.now(),
      name: product.name,
      slug: product.id,
      price: product.price,
      quantity: 1,
      image: product.image,
      brand: product.brand,
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  const discountPct =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="relative group/card h-full rounded-[2.15rem] p-[2px] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[2.15rem] blur-sm group-hover/card:animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[2.15rem]" />

      <Link
        href={`/urunler/${product.id}`}
        id={`product-${product.id}`}
        className="relative flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full z-10"
      >
      {/* Image */}
      <div className="relative bg-slate-100 aspect-square flex items-center justify-center p-5">
        <div className="relative w-full h-full rounded-2xl overflow-hidden glass-panel shadow-glass-sm border border-slate-200">
          <Image 
            src={product.image || "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className="badge bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px] font-bold shadow-glass-sm">{product.badge}</span>
          )}
          {discountPct && (
            <span className="badge bg-rose-50 text-rose-600 border-rose-100 text-[10px] font-bold shadow-glass-sm">-{discountPct}%</span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toast("Favorilere eklendi ❤️");
          }}
          aria-label="Favorilere ekle"
          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur border border-slate-200 rounded-full flex items-center justify-center
                     text-slate-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-glass-sm"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1 glass-panel">
        <p className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">{product.brand}</p>
        <h3 className="font-extrabold text-[15px] text-slate-900 mb-3 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-zinc-200 fill-zinc-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-600">({product.reviewCount.toLocaleString("tr")})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 mb-5 mt-auto">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {product.price.toLocaleString("tr-TR")}₺
          </span>
          {product.originalPrice && (
            <span className="text-sm font-semibold text-slate-600 line-through decoration-zinc-300">
              {product.originalPrice.toLocaleString("tr-TR")}₺
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="btn-primary w-full py-3.5 text-sm font-bold shadow-md shadow-zinc-900/10 group-hover:bg-zinc-800"
          aria-label={`${product.name} sepete ekle`}
        >
          <ShoppingBag className="w-4 h-4" />
          Sepete Ekle
        </button>
      </div>
    </Link>
    </div>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-transparent py-24" aria-label="Öne çıkan ürünler">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">
              Mağaza
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Öne Çıkan Ürünler
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scroll("left")} className="btn-icon glass-panel border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-glass-sm" aria-label="Geri">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll("right")} className="btn-icon glass-panel border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-glass-sm" aria-label="İleri">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Link href="/urunler" className="btn-ghost font-bold gap-1 text-slate-600 hover:text-indigo-600">
              Tümünü Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Products */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {products.length > 0 ? (
            products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-64 sm:w-72"
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <p className="text-slate-600 text-sm py-8 font-medium">Ürün bulunamadı.</p>
          )}
        </div>
      </div>
    </section>
  );
}
