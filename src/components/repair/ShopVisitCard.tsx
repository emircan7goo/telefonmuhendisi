"use client";

import { MapPin, Navigation, Phone, Store } from "lucide-react";
import { SHOP_ADDRESS, SHOP_MAPS_URL, SHOP_NAME, telUrl, whatsappUrl } from "@/lib/contact";
import { useShopContact } from "@/components/contact/ShopContactProvider";
import { WhatsAppIcon } from "@/components/contact/ContactFab";

/** Teklifi onaylanan "dükkana getirecek" müşteriye adres, yol tarifi ve hızlı iletişim. */
export function ShopVisitCard({ repairId }: { repairId: number }) {
  const { phone } = useShopContact();

  return (
    <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl mt-4 space-y-4">
      <div className="text-center space-y-1">
        <Store className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <h3 className="font-black text-emerald-900 text-base">Cihazınızı Dükkanımıza Getirebilirsiniz</h3>
        <p className="text-xs text-emerald-700 max-w-sm mx-auto">
          Teklifiniz onaylandı. Cihazınızı getirdiğinizde <strong>#{repairId}</strong> numaralı talebinizi söylemeniz yeterli.
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-emerald-100 text-sm flex items-start gap-3">
        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-slate-800">{SHOP_NAME}</div>
          <div className="text-slate-600">{SHOP_ADDRESS}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <a href={SHOP_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-sm py-2.5 rounded-xl hover:bg-emerald-100 transition-colors">
          <Navigation className="w-4 h-4" /> Yol Tarifi
        </a>
        <a href={whatsappUrl(phone, `Merhaba, #${repairId} numaralı tamirim için cihazımı getirmek istiyorum.`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-2.5 rounded-xl hover:bg-[#1ebe5b] transition-colors">
          <WhatsAppIcon className="w-4 h-4" /> WhatsApp
        </a>
        <a href={telUrl(phone)} className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
          <Phone className="w-4 h-4" /> Ara
        </a>
      </div>
    </div>
  );
}
