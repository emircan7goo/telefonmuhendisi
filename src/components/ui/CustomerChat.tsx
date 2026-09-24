"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ImageIcon, Loader2, MessageCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher-client";

interface Message {
  id: number;
  message: string | null;
  imageUrl: string | null;
  userId: string | null;
  createdAt: string;
  senderName?: string;
  senderRole?: string;
}

export function CustomerChat({ repairId, currentUserId }: { repairId: number; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/repairs/${repairId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (_) {} finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) fetchMessages();
  }, [open, repairId]);

  useEffect(() => {
    if (!open) return;
    
    const channel = pusherClient.subscribe(`repair-${repairId}`);
    channel.bind("new-message", (newMsg: Message) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      pusherClient.unsubscribe(`repair-${repairId}`);
    };
  }, [open, repairId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        imageUrl = d.url;
      }

      const res = await fetch("/api/user/repairs/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repairId, message: text || null, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, data.message]);
      setText("");
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <MessageCircle className="w-4 h-4" />
          Teknisyen ile Mesajlaş
          {messages.length > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {messages.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Messages */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {fetching && (
              <div className="text-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
              </div>
            )}
            {!fetching && messages.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">
                Henüz mesaj yok. Teknisyene bir şey sormak ister misiniz?
              </p>
            )}
            {messages.map((msg) => {
              const isMine = msg.userId === currentUserId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isMine
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    {!isMine && (
                      <div className="text-[10px] font-black text-indigo-400 mb-1 uppercase tracking-wider">Teknisyen</div>
                    )}
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Görsel" className="rounded-lg mb-2 max-h-40 object-cover" />
                    )}
                    {msg.message && <p className="whitespace-pre-line">{msg.message}</p>}
                    <div className={`text-[9px] mt-1 ${isMine ? "text-indigo-200" : "text-slate-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white">
            {file && (
              <div className="mb-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>📷 {file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-red-500">
                  İptal
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Teknisyene mesaj gönder..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                disabled={loading}
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
