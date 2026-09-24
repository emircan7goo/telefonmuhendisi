"use client";

import { useEffect, useState } from "react";
import { getAdminNotifications } from "./actions";
import { Bell } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const [counts, setCounts] = useState({ orders: 0, repairs: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const playNotificationSound = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gainNode = context.createGain();
      osc.connect(gainNode);
      gainNode.connect(context.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, context.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.15);
    } catch (e) {
      console.log("Audio play failed");
    }
  };

  useEffect(() => {
    let lastCounts = { orders: 0, repairs: 0 };

    const fetchCounts = async () => {
      const current = await getAdminNotifications();
      let hasNew = false;
      
      // Check if new orders arrived
      if (current.orders > lastCounts.orders) {
        toast.success(`💳 ${current.orders - lastCounts.orders} yeni siparişiniz var!`, { duration: 5000 });
        hasNew = true;
      }
      // Check if new repairs arrived
      if (current.repairs > lastCounts.repairs) {
        toast.success(`🔧 ${current.repairs - lastCounts.repairs} yeni tamir talebi!`, { duration: 5000 });
        hasNew = true;
      }

      if (hasNew) {
        playNotificationSound();
      }

      lastCounts = current;
      setCounts(current);
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const total = counts.orders + counts.repairs;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm relative"
      >
        <Bell className="w-5 h-5" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {total}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
          <div className="px-3 py-2 text-xs font-black uppercase text-slate-400 border-b border-slate-100 mb-2">
            Bekleyen İşlemler
          </div>
          <div className="space-y-1">
            <Link href="/tmkontrols/siparisler" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-bold text-slate-700">Yeni Siparişler</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{counts.orders}</span>
            </Link>
            <Link href="/tmkontrols/tamirler" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-bold text-slate-700">Yeni Tamirler</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">{counts.repairs}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
