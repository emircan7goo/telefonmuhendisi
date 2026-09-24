"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateRepairStatus, offerPrice } from "./actions";
import { REPAIR_STATUS_META, normalizeRepairStatus, staffStatusOptions } from "@/lib/repair-status";

export function RepairActionControls({ 
  repairId, 
  status, 
  finalPrice, 
  estimatedPrice 
}: { 
  repairId: number; 
  status: string; 
  finalPrice: string | null; 
  estimatedPrice: string | null; 
}) {
  const [currentStatus, setCurrentStatus] = useState<string>(normalizeRepairStatus(status));
  const [currentPrice, setCurrentPrice] = useState(estimatedPrice || finalPrice || "");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setLoading(true);
    try {
      await updateRepairStatus(repairId, newStatus);
      toast.success("Durum güncellendi.");
    } catch (err: any) {
      setCurrentStatus(previousStatus);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceBlur = async () => {
    if (currentPrice === (estimatedPrice || finalPrice || "")) return;
    setLoading(true);
    try {
      await offerPrice(repairId, currentPrice);
      setCurrentStatus("awaiting_customer_approval");
      toast.success("Fiyat teklifi müşteriye sunuldu.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <td className="px-6 py-4">
        <select 
          disabled={loading}
          value={currentStatus}
          onChange={handleStatusChange}
          className="text-xs font-bold bg-white/80 border border-slate-200 rounded-lg px-3 py-2 outline-none text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-shadow w-36 disabled:opacity-50"
        >
          {staffStatusOptions(currentStatus).map((value) => (
            <option key={value} value={value}>{REPAIR_STATUS_META[value].label}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 w-4 text-center">₺</span>
          <input 
            disabled={loading}
            type="number" 
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="Teklif / Son Fiyat" 
            className="w-32 text-xs font-bold bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" 
          />
        </div>
      </td>
    </>
  );
}
