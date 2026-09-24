"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher-client";
import { ImageViewer } from "@/components/ui/ImageViewer";

export function AdminChat({ repairId, initialMessages, customer }: { repairId: number, initialMessages: any[], customer: any }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = pusherClient.subscribe(`repair-${repairId}`);
    channel.bind("new-message", (newMsg: any) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      pusherClient.unsubscribe(`repair-${repairId}`);
    };
  }, [repairId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      const res = await fetch(`/api/repairs/${repairId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("");
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] flex flex-col h-[450px] md:h-[600px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/80 bg-white/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
          {customer?.name?.[0] || "M"}
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{customer?.name || "Bilinmiyor"}</div>
          <div className="text-[10px] font-black uppercase text-slate-400">Müşteri Profili</div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messages.map((msg: any) => {
          const isTech = msg.user?.role !== "customer";
          return (
            <div key={msg.id} className={`flex flex-col ${isTech ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500">{msg.user?.name || (isTech ? "Teknisyen" : "Kullanıcı")}</span>
                {isTech && <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Teknisyen</span>}
                <span className="text-[9px] font-mono text-slate-400">{new Date(msg.createdAt).toLocaleTimeString("tr-TR")}</span>
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${isTech ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                {msg.imageUrl && (
                  <ImageViewer src={msg.imageUrl} className="w-48 mb-2 rounded-xl border border-slate-200 aspect-square" />
                )}
                {msg.message && <div className="text-sm whitespace-pre-line">{msg.message}</div>}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm font-medium text-slate-400">
            Henüz bir mesaj gönderilmedi.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white/40 border-t border-white/80">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          {file && (
            <div className="mb-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>📷 {file.name}</span>
              <button type="button" onClick={() => setFile(null)} className="text-red-500">İptal</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4" />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Müşteriye bir mesaj veya görsel gönder..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button disabled={loading} type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
