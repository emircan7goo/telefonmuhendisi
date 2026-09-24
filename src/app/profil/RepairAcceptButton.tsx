"use client";

import { useState } from "react";
import { Check, Tag, Info, Handshake, X } from "lucide-react";
import toast from "react-hot-toast";
import { acceptRepairPrice, counterOfferRepairPrice } from "./actions";

export function RepairAcceptButton({ repairId, price }: { repairId: number, price: string }) {
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");
  
  const isDiscountValid = discountCode.toLowerCase() === "telefonmuhendisi";
  
  const originalPriceNum = parseFloat(price);
  const finalPriceNum = isDiscountValid && !isNaN(originalPriceNum) ? originalPriceNum * 0.9 : originalPriceNum;
  const finalPriceDisplay = isNaN(finalPriceNum) ? price : finalPriceNum.toFixed(2);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptRepairPrice(repairId, discountCode);
      toast.success("Fiyat onaylandı! İşlemlere başlanıyor.");
    } catch (e: any) {
      toast.error(e.message || "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCounterOffer = async () => {
    if (!counterPrice || isNaN(parseFloat(counterPrice))) {
      toast.error("Lütfen geçerli bir teklif girin.");
      return;
    }
    
    setLoading(true);
    try {
      await counterOfferRepairPrice(repairId, counterPrice);
      toast.success("Karşı teklifiniz iletildi. Yetkili onayı bekleniyor.");
    } catch (e: any) {
      toast.error(e.message || "Hata oluştu.");
    } finally {
      setLoading(false);
      setIsNegotiating(false);
    }
  };

  if (isNegotiating) {
    return (
      <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-indigo-800 flex items-center gap-1"><Handshake className="w-4 h-4"/> Karşı Teklifiniz</span>
          <button onClick={() => setIsNegotiating(false)} className="text-indigo-400 hover:text-indigo-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-indigo-600 mb-3 font-medium">Bize sunduğunuz fiyat yetkilimiz tarafından incelenecek ve onaylandığında tamir süreciniz hemen başlayacaktır.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black">₺</span>
            <input 
              type="number" 
              placeholder="Teklifiniz (Örn: 800)"
              value={counterPrice}
              onChange={(e) => setCounterPrice(e.target.value)}
              className="w-full bg-white border border-indigo-200 rounded-lg py-2.5 pl-8 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            disabled={loading || !counterPrice}
            onClick={handleCounterOffer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-amber-800">Size Özel Fiyat Teklifi:</span>
        <div className="text-right">
          {isDiscountValid ? (
             <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-amber-500/70 line-through">{price} ₺</span>
                <span className="text-xl font-black text-green-600">{finalPriceDisplay} ₺</span>
             </div>
          ) : (
             <span className="text-xl font-black text-amber-600">{price} ₺</span>
          )}
        </div>
      </div>
      
      <div className="mb-4 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600">
           <Tag className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          placeholder="İndirim Kodunuz Varsa Giriniz"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className={`w-full bg-white border ${isDiscountValid ? 'border-green-400 focus:ring-green-500' : 'border-amber-200 focus:ring-amber-500'} rounded-lg py-2.5 pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 transition-all placeholder:font-medium`}
        />
        {isDiscountValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
             <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button 
          disabled={loading}
          onClick={() => setIsNegotiating(true)}
          className="w-1/3 bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-all disabled:opacity-50 text-sm"
        >
          <Handshake className="w-4 h-4" /> Pazarlık Yap
        </button>
        <button 
          disabled={loading}
          onClick={handleAccept}
          className="w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          <Check className="w-5 h-5" /> 
          {loading ? "Onaylanıyor..." : `Kabul Et (${finalPriceDisplay} ₺)`}
        </button>
      </div>
      
      {isDiscountValid && (
        <p className="text-[10px] text-green-700 font-bold mt-3 text-center flex items-center justify-center gap-1">
           <Info className="w-3 h-3" /> %10 İndirim Uygulandı!
        </p>
      )}
    </div>
  );
}
