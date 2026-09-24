"use client";

import { useState, useEffect } from "react";
import { PackageOpen, TrendingUp, CheckCircle, Clock, Truck, XCircle, Plus } from "lucide-react";
import { updateOrderStatus } from "./actions";
import toast from "react-hot-toast";

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Bekliyor", color: "bg-amber-100 text-amber-700", icon: Clock },
  processing: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-700", icon: PackageOpen },
  shipped: { label: "Kargolandı", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Teslim Edildi", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if(res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      toast.success("Sipariş durumu güncellendi!");
      fetchOrders();
    } else {
      toast.error(res.error || "Hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            Sipariş Yönetimi
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Mağazanızdan gelen tüm siparişleri ve teslimat süreçlerini yönetin.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5">Sipariş No</th>
                <th className="p-5">Müşteri Bilgisi</th>
                <th className="p-5">Tutar</th>
                <th className="p-5 text-center">Durum</th>
                <th className="p-5 text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                    Yükleniyor...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <PackageOpen className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 font-bold">Henüz sipariş bulunmuyor.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = STATUS_MAP[order.status]?.icon || Clock;
                  const shipping = order.shippingAddress;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-900">
                        #ORD-{order.id.toString().padStart(4, "0")}
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-900">{shipping?.fullname || "Müşteri"}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate" title={shipping?.address}>
                          {shipping?.address} - {shipping?.city}
                        </div>
                      </td>
                      <td className="p-5 font-black text-slate-900">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(parseFloat(order.totalAmount))}
                      </td>
                      <td className="p-5 text-center">
                        <div className="relative inline-block group">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`appearance-none pl-8 pr-6 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${STATUS_MAP[order.status]?.color || "bg-gray-100 text-gray-600"}`}
                          >
                            <option value="pending">Bekliyor</option>
                            <option value="processing">Hazırlanıyor</option>
                            <option value="shipped">Kargolandı</option>
                            <option value="delivered">Teslim Edildi</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                          <StatusIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" />
                        </div>
                      </td>
                      <td className="p-5 text-right text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
