"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Trash2, Power, PowerOff, Edit3, Save, Smartphone, X } from "lucide-react";
import { toggleProductStatus, updateProductStock, deleteProduct, createRealProduct } from "./actions";
import toast from "react-hot-toast";

// Bu sayfa aslında Server Component olup verileri oradan almalı ancak 
// şimdilik Client tarafında db çağrısını simüle ediyoruz veya API ekleyeceğiz.
// Admin paneline tam yakışır bir E-ticaret yönetim arayüzü:

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [tempStock, setTempStock] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "", description: "", price: "", originalPrice: "", stock: "0", brand: "", category: "Telefon", condition: "new", image: ""
  });

  // Normalde Server Component üzerinden fetch edilir, şimdilik mock veya API bekleyeceğiz.
  // Gerçek db entegrasyonu için /api/admin/products route'u yazılabilir veya Server Component yapılabilirdi.
  // Hızlıca bir Server Component fetch'i yerine burada arayüz şovunu yapacağız.
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Mock fetch (ileride Drizzle'dan gelecek)
      const res = await fetch("/api/products");
      if(res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };


  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) return toast.error("Ad ve Fiyat zorunludur.");
    
    const res = await createRealProduct({
      ...newProductForm,
      stock: parseInt(newProductForm.stock) || 0,
    });
    
    if (res.success) {
      toast.success("Ürün başarıyla eklendi!");
      setIsAddModalOpen(false);
      setNewProductForm({ name: "", description: "", price: "", originalPrice: "", stock: "0", brand: "", category: "Telefon", condition: "new", image: "" });
      fetchProducts();
    } else {
      toast.error(res.error || "Hata oluştu");
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const res = await toggleProductStatus(id, !currentStatus);
    if (res.success) {
      toast.success(currentStatus ? "Ürün pasife alındı" : "Ürün aktifleştirildi");
      fetchProducts();
    } else {
      toast.error(res.error || "Hata oluştu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Ürün silindi!");
      fetchProducts();
    } else {
      toast.error(res.error || "Hata oluştu");
    }
  };

  const handleSaveStock = async (id: number) => {
    const newStock = parseInt(tempStock);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Geçerli bir stok girin!");
      return;
    }
    const res = await updateProductStock(id, newStock);
    if (res.success) {
      toast.success("Stok güncellendi!");
      setEditingStock(null);
      fetchProducts();
    } else {
      toast.error(res.error || "Hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Ürün & Envanter Yönetimi
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Mağazanızdaki ürünleri, stokları ve fiyatları yönetin.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5">Ürün</th>
                <th className="p-5">Marka / Durum</th>
                <th className="p-5">Fiyat</th>
                <th className="p-5 text-center">Stok</th>
                <th className="p-5 text-center">Durum</th>
                <th className="p-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Yükleniyor...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 font-bold">Veritabanında henüz ürün yok.</p>
                      <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-bold hover:underline text-sm mt-2">
                        Yeni Ürün Ekleyerek Başlayın
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[200px]" title={product.name}>
                          {product.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{product.slug}</div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{product.brand || "-"}</div>
                      <div className="text-xs text-slate-500 mt-0.5 capitalize">{product.condition}</div>
                    </td>
                    <td className="p-5 font-black text-slate-900">
                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(parseFloat(product.price))}
                    </td>
                    <td className="p-5 text-center">
                      {editingStock === product.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={tempStock}
                            onChange={(e) => setTempStock(e.target.value)}
                            className="w-16 px-2 py-1 text-center bg-white border border-blue-500 rounded-lg outline-none font-bold"
                          />
                          <button onClick={() => handleSaveStock(product.id)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingStock(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-black px-2.5 py-1 rounded-full text-xs ${product.stock > 10 ? "bg-emerald-100 text-emerald-700" : product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {product.stock} Adet
                          </span>
                          <button 
                            onClick={() => { setEditingStock(product.id); setTempStock(product.stock.toString()); }}
                            className="text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleToggle(product.id, product.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          product.isActive ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-slate-100 text-slate-500 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        {product.isActive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                        {product.isActive ? "Aktif" : "Pasif"}
                      </button>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900">Yeni Ürün Ekle</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleCreateProduct} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Ürün Adı *</label>
                      <input required type="text" value={newProductForm.name} onChange={e=>setNewProductForm({...newProductForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Örn: iPhone 14 Pro Max" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Kategori</label>
                      <select value={newProductForm.category} onChange={e=>setNewProductForm({...newProductForm, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="Telefon">Telefon</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Kılıf">Kılıf</option>
                        <option value="Kırılmaz">Kırılmaz</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-sm font-bold text-slate-700">Fiyat (₺) *</label>
                      <input required type="number" step="0.01" value={newProductForm.price} onChange={e=>setNewProductForm({...newProductForm, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="45000" />
                    </div>
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-sm font-bold text-slate-700">Eski Fiyat (₺)</label>
                      <input type="number" step="0.01" value={newProductForm.originalPrice} onChange={e=>setNewProductForm({...newProductForm, originalPrice: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="İndirim öncesi" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Stok</label>
                      <input required type="number" value={newProductForm.stock} onChange={e=>setNewProductForm({...newProductForm, stock: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="10" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Durum</label>
                      <select value={newProductForm.condition} onChange={e=>setNewProductForm({...newProductForm, condition: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                        <option value="new">Sıfır</option>
                        <option value="refurbished">Yenilenmiş</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Marka</label>
                      <input type="text" value={newProductForm.brand} onChange={e=>setNewProductForm({...newProductForm, brand: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Örn: Apple" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Görsel URL</label>
                      <input type="url" value={newProductForm.image} onChange={e=>setNewProductForm({...newProductForm, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="https://resimlinki.com/gorsel.jpg" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Açıklama</label>
                    <textarea rows={3} value={newProductForm.description} onChange={e=>setNewProductForm({...newProductForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none" placeholder="Ürün özelliklerini girin..." />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Vazgeç</button>
                    <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">Ürünü Kaydet</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
