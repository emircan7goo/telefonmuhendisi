"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Check, ChevronRight, MapPin, Building, Phone } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createOrder } from "./actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"havale" | "kapida">("kapida");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    tcNo: "",
    city: "",
    district: "",
    fullAddress: ""
  });

  // Redirect to login if not authenticated
  // Wait, we can let them fill it out, but they need to be logged in to save it. 
  // Let's just encourage them to login if not.
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({ ...prev, fullName: session.user?.name || "", phone: (session.user as any).phone || "" }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      return toast.error("Sepetiniz boş!");
    }

    if (!session?.user) {
      toast.error("Lütfen sipariş vermek için giriş yapın.");
      return router.push("/giris?callbackUrl=/checkout");
    }

    setIsSubmitting(true);

    const addressObj = {
      fullName: formData.fullName,
      phone: formData.phone,
      tcNo: formData.tcNo,
      city: formData.city,
      district: formData.district,
      fullAddress: formData.fullAddress,
    };

    const res = await createOrder({
      totalAmount: (getCartTotal() - (appliedCoupon?.discountAmount || 0)),
      couponCode: appliedCoupon?.code,
      discountAmount: appliedCoupon?.discountAmount || 0,
      shippingAddress: addressObj,
      billingAddress: addressObj, // Same for demo
      paymentMethod,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Siparişiniz başarıyla alındı!");
      clearCart();
      router.push("/profil#siparisler");
    } else {
      toast.error(res.error || "Bir hata oluştu.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: getCartTotal() })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success("Kupon başarıyla uygulandı!");
      } else {
        toast.error(data.error || "Kupon geçersiz.");
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error("Kupon kontrol edilirken bir hata oluştu.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sepetiniz Boş</h2>
          <Link href="/urunler" className="text-blue-600 font-bold hover:underline">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="container-custom max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-8">
          <Link href="/sepet" className="hover:text-blue-600 transition-colors">Sepetim</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">Ödeme ve Teslimat</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Under Construction Notice */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50/50 border border-blue-200 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">Ödeme ve Kargo Altyapısı Çok Yakında Aktif! 🚀</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  Web sitemizi yayına hazırlıyoruz. Kargo ve Sanal POS (kredi kartı taksit) entegrasyonlarımız tamamlanana kadar sipariş sistemi geçici olarak kapalıdır. İlginiz için teşekkür ederiz!
                </p>
              </div>
            </div>

            {/* Login Notice (If not logged in) */}
            {!session?.user && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-900">Hesabınız yok mu?</h3>
                  <p className="text-sm text-amber-700">Sipariş takibi için giriş yapmanız gerekmektedir.</p>
                </div>
                <Link href="/giris?callbackUrl=/checkout" className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-sm">Giriş Yap</Link>
              </div>
            )}

            {/* Address Form */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Teslimat ve Fatura Adresi
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Ad Soyad *</label>
                  <input required value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Ahmet Yılmaz" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Telefon *</label>
                  <input required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="0555 555 55 55" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">T.C. Kimlik No (Fatura İçin) *</label>
                  <input required value={formData.tcNo} onChange={e=>setFormData({...formData, tcNo: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="11111111111" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">İl *</label>
                  <input required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="İstanbul" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">İlçe *</label>
                  <input required value={formData.district} onChange={e=>setFormData({...formData, district: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Kadıköy" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Açık Adres *</label>
                  <textarea required rows={3} value={formData.fullAddress} onChange={e=>setFormData({...formData, fullAddress: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Mahalle, sokak, bina ve daire no..." />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" /> Ödeme Yöntemi
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-3 ${paymentMethod === 'kapida' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-indigo-900 font-black">
                      <Truck className="w-5 h-5" /> Kapıda Ödeme
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'kapida' ? 'border-indigo-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'kapida' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'kapida'} onChange={() => setPaymentMethod('kapida')} />
                  <p className="text-xs text-slate-500 font-medium">Teslimat sırasında nakit veya kredi kartı ile güvenle ödeyin.</p>
                </label>

                <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-3 ${paymentMethod === 'havale' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-indigo-900 font-black">
                      <Building className="w-5 h-5" /> Havale / EFT
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'havale' ? 'border-indigo-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'havale' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'havale'} onChange={() => setPaymentMethod('havale')} />
                  <p className="text-xs text-slate-500 font-medium">%5 indirim fırsatı! Sipariş onayından sonra IBAN bilgileri iletilecektir.</p>
                </label>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] sticky top-32 text-white border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-emerald-400" /> Sipariş Özeti
              </h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-300 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} Adet</p>
                    </div>
                    <p className="text-sm font-bold text-white whitespace-nowrap">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-white/10 my-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Ara Toplam</span>
                  <span className="text-white">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Kargo Ücreti</span>
                  <span className="text-emerald-400 font-bold">Ücretsiz</span>
                </div>
                {paymentMethod === "havale" && (
                  <div className="flex justify-between text-slate-400 text-sm font-medium">
                    <span>Havale İndirimi</span>
                    <span className="text-emerald-400 font-bold">-%5</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-slate-400 text-sm font-medium">
                    <span>Kupon ({appliedCoupon.code})</span>
                    <span className="text-emerald-400 font-bold">-{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Coupon Input */}
              <div className="mb-6 flex gap-2">
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Kupon Kodu" 
                  disabled={!!appliedCoupon}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                {!appliedCoupon ? (
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {validatingCoupon ? "..." : "Uygula"}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-bold rounded-xl transition-colors"
                  >
                    İptal
                  </button>
                )}
              </div>
              
              <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-300">Toplam</span>
                <span className="text-3xl font-black text-white">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                    (paymentMethod === "havale" ? getCartTotal() * 0.95 : getCartTotal()) - (appliedCoupon?.discountAmount || 0)
                  )}
                </span>
              </div>

              <button 
                type="button" 
                disabled={true}
                className="w-full py-4 bg-slate-700 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-600"
              >
                Ödeme Sistemi Çok Yakında (Kapalı)
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" /> 256-bit SSL Güvenli Bağlantı
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
