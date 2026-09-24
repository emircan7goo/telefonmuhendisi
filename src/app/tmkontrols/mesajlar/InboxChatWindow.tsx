"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Loader2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { sendInboxMessage } from "./actions";
import Link from "next/link";
import { repairStatusMeta } from "@/lib/repair-status";

interface Message {
  id: number;
  userId: string;
  message: string | null;
  imageUrl: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    role: string;
  };
}

interface Repair {
  id: number;
  deviceModel: string;
  status: string;
  finalPrice: string | null;
  estimatedPrice: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface InboxChatWindowProps {
  repair: Repair;
  messages: Message[];
  currentUserId: string;
}

export default function InboxChatWindow({ repair, messages, currentUserId }: InboxChatWindowProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setSending(true);
    let uploadedUrl = null;

    try {
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Görsel yüklenemedi.");
        uploadedUrl = uploadData.url;
        setFile(null);
      }

      const res = await sendInboxMessage(repair.id, text, uploadedUrl);
      if (res.success) {
        setText("");
      }
    } catch (err: any) {
      toast.error(err.message || "Mesaj iletilemedi.");
      console.error(err);
    } finally {
      setUploading(false);
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-sm overflow-hidden">
      
      {/* Header Info */}
      <div className="p-4 border-b border-slate-100 bg-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {(repair.user?.name || "M")[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">{repair.user?.name || "İsimsiz Müşteri"}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black ${repairStatusMeta(repair.status).badge}`}>
                {repairStatusMeta(repair.status).label}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{repair.deviceModel} • {repair.finalPrice || repair.estimatedPrice || 0} ₺</p>
          </div>
        </div>
        
        <Link 
          href={`/tmkontrols/tamirler/${repair.id}`} 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] rounded-lg transition-colors uppercase tracking-wider"
        >
          Tamir Detayı <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
        {messages.map((msg) => {
          const isSender = msg.userId === currentUserId;
          const isTech = msg.user?.role !== "customer";

          return (
            <div key={msg.id} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500">{msg.user?.name || "Kullanıcı"}</span>
                {isTech && <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Teknisyen</span>}
                <span className="text-[9px] font-mono text-slate-400">
                  {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm ${isSender ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                {msg.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.imageUrl} alt="Chat file" className="rounded-xl mb-2 max-h-48 object-cover border border-black/5" />
                )}
                {msg.message && <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-medium">Henüz mesajlaşma geçmişi yok.</p>
            <p className="text-[10px]">İlk mesajı göndererek iletişimi başlatın.</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-4 bg-white/40 border-t border-slate-100">
        <form onSubmit={handleSend} className="space-y-3">
          {file && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-2 px-3 text-xs font-bold text-blue-700">
              <span>📷 Yüklenmeye Hazır: {file.name}</span>
              <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:underline">İptal</button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <label className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl cursor-pointer shadow-sm transition-all shrink-0">
              <ImageIcon className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={sending || uploading}
              />
            </label>
            
            <input
              type="text"
              placeholder="Mesajınızı yazın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              disabled={sending || uploading}
            />

            <button
              type="submit"
              disabled={sending || uploading || (!text.trim() && !file)}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {sending || uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
