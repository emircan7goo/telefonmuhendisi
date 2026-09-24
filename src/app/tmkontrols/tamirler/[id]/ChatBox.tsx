"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { sendRepairMessage } from "./actions";

export function ChatBox({ repairId }: { repairId: number }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    setLoading(true);
    let imageUrl = null;

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        imageUrl = data.url;
      }

      await sendRepairMessage(repairId, message, imageUrl);
      setMessage("");
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {file && (
        <div className="mb-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between text-xs font-bold text-indigo-700">
          <span>📷 {file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:underline">İptal</button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <label className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors">
          <ImageIcon className="w-5 h-5" />
          <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Müşteriye bir mesaj veya görsel gönder..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button disabled={loading} type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
}
