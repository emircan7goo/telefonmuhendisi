"use client";

import { useState } from "react";
import { makeOffer } from "./actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { ImageViewer } from "@/components/ui/ImageViewer";

export default function CihazAlimClient({ requests }: { requests: any[] }) {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOffer = async () => {
    if (!offerPrice) {
      toast.error("Lütfen bir fiyat girin.");
      return;
    }
    setIsSubmitting(true);
    const res = await makeOffer({
      id: selectedRequest.id,
      price: parseFloat(offerPrice),
      notes: offerNotes,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Teklif gönderildi!");
      setSelectedRequest(null);
      setOfferPrice("");
      setOfferNotes("");
    } else {
      toast.error(res.error || "Bir hata oluştu.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Cihaz Alım & Takas Talepleri</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {req.status === 'pending' ? 'BEKLİYOR' : 'TEKLİF VERİLDİ'}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{req.brand} {req.model}</h3>
              <p className="text-sm text-slate-600 mb-2 font-medium">{req.condition}</p>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{req.notes || "Not eklenmemiş."}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">
                  {req.user?.name?.charAt(0) || "M"}
                </div>
                <div className="text-xs font-bold text-slate-700">{req.user?.name || req.user?.email || "Müşteri"}</div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedRequest(req)}
              className="w-full mt-4 bg-slate-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors"
            >
              İncele ve Teklif Ver
            </button>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 font-bold bg-white rounded-2xl border border-slate-200">
            Şu an bekleyen talep yok.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 z-10 shadow-2xl flex flex-col md:flex-row gap-8">
            
            <div className="md:w-1/2">
              <h2 className="text-2xl font-black text-slate-900 mb-4">{selectedRequest.brand} {selectedRequest.model}</h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <p className="text-sm text-slate-700 mb-2"><strong className="text-slate-900">Durum:</strong> {selectedRequest.condition}</p>
                <p className="text-sm text-slate-700"><strong className="text-slate-900">Müşteri Notu:</strong> {selectedRequest.notes || "Yok"}</p>
              </div>

              <h4 className="font-bold text-slate-900 mb-3">Fotoğraflar ({selectedRequest.images?.length || 0})</h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.images?.map((img: string, idx: number) => (
                  <ImageViewer 
                    key={idx} 
                    src={img} 
                    alt={`Cihaz fotoğrafı ${idx+1}`} 
                    className="aspect-square rounded-xl border border-slate-200 bg-slate-100" 
                  />
                ))}
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex-1">
                <h3 className="text-xl font-black text-blue-900 mb-6">Fiyat Teklifi Gönder</h3>
                
                {selectedRequest.status === "offered" ? (
                  <div className="text-center bg-white p-6 rounded-xl border border-blue-200">
                    <p className="text-sm text-slate-500 font-bold mb-2">Zaten Teklif Verildi</p>
                    <p className="text-3xl font-black text-blue-600">{Number(selectedRequest.offeredPrice).toLocaleString("tr-TR")} ₺</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Teklif Fiyatı (₺)</label>
                      <input 
                        type="number" 
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Örn: 25000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Uzman Notu (Opsiyonel)</label>
                      <textarea 
                        value={offerNotes}
                        onChange={(e) => setOfferNotes(e.target.value)}
                        placeholder="Müşteriye iletilecek not..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 h-24 resize-none text-sm font-medium"
                      />
                    </div>
                    
                    <button 
                      onClick={handleOffer}
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Teklifi Gönder ve Bildir"}
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedRequest(null)}
                className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
