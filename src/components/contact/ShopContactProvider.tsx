"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SHOP_PHONE, normalizeTrPhone } from "@/lib/contact";

/** Admin panelindeki iletişim numarasını (settings.contactPhone) istemci bileşenlerine taşır. */
const ShopContactContext = createContext<{ phone: string }>({ phone: DEFAULT_SHOP_PHONE });

export function ShopContactProvider({ phone, children }: { phone?: string; children: React.ReactNode }) {
  const value = { phone: normalizeTrPhone(phone) ? phone! : DEFAULT_SHOP_PHONE };
  return <ShopContactContext.Provider value={value}>{children}</ShopContactContext.Provider>;
}

export function useShopContact() {
  return useContext(ShopContactContext);
}
