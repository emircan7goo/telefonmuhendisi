"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, CreditCard, ShoppingBag, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FloatingUI } from "@/components/ui/FloatingUI";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  const handleQuantity = (id: string | number, current: number, delta: number) => {
    const next = current + delta;
    if (next > 0) {
      updateQuantity(id, next);
    }
  };

  const hasItems = items.length > 0;

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-50/50">
      <FloatingUI />
      
      <div className="container-custom max-w-6xl">
        <div className="mb-12">
          <Link href="/urunler" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Alışverişe Dön
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Alışveriş Sepetiniz</h1>
        </div>

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-500 mb-8 max-w-md">Premium aksesuarlarımızı incelemek veya arızalı cihazınız için teklif almak ister misiniz?</p>
            <div className="flex gap-4">
               <Link href="/urunler" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md">
                 Mağazayı Gez
               </Link>
               <Link href="/tamir" className="px-8 py-3.5 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-xl font-bold transition-all">
                 Tamir Teklifi Al
               </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
               <AnimatePresence>
                 {items.map((item) => (
                   <motion.div 
                     key={item.id}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                     className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center gap-6"
                   >
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 flex-shrink-0 relative overflow-hidden border border-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-blue-600 font-bold">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Control */}
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                          <button onClick={() => handleQuantity(item.productId, item.quantity, -1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                          <button onClick={() => handleQuantity(item.productId, item.quantity, 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button onClick={() => removeItem(item.productId)} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </motion.div>
                 ))}
               </AnimatePresence>

               {/* Upsell Module */}
               <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col sm:flex-row items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Zap className="w-8 h-8 text-blue-600" />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">Mühendis Önerisi</h4>
                    <p className="text-blue-800 font-medium text-sm">Cihazınızın pil ömrünü uzatmak için sepetinize 20W Orijinal Apple Çipli Hızlı Şarj Adaptörü eklemek ister misiniz?</p>
                 </div>
                 <Link href="/urunler" className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 shadow-sm hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap">
                   İncele
                 </Link>
               </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
               <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-32">
                 <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
                 
                 <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-gray-600 font-medium">
                     <span>Ara Toplam</span>
                     <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(getCartTotal())}</span>
                   </div>
                   <div className="flex justify-between text-gray-600 font-medium">
                     <span>Kargo</span>
                     <span className="text-green-600 font-bold">Ücretsiz</span>
                   </div>
                 </div>
                 
                 <div className="border-t border-gray-100 pt-6 mb-8">
                   <div className="flex justify-between items-end">
                     <span className="text-lg font-bold text-gray-900">Toplam</span>
                     <span className="text-3xl font-black text-gray-900">
                       {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(getCartTotal())}
                     </span>
                   </div>
                   <p className="text-xs text-gray-400 mt-2 text-right">KDV Dahildir</p>
                 </div>

                 <Link href="/checkout" className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-4 group">
                   Ödemeye Geç <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>

                 <div className="flex items-center justify-center gap-4 text-gray-400 text-xs font-medium">
                   <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> 256-bit SSL</div>
                   <div className="flex items-center gap-1"><CreditCard className="w-4 h-4"/> Güvenli Ödeme</div>
                 </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
