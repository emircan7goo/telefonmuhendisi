"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function CustomerChatBox({ repairId, onMessageSent }: { repairId: number, onMessageSent: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/user/repairs/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repairId, message })
      });
      if (!res.ok) throw new Error();
      setMessage("");
      onMessageSent(); // Refresh data
    } catch {
      toast.error("Mesajınız iletilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
      <input 
        type="text" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Teknisyene bir soru sorun veya mesaj gönderin..." 
        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button disabled={loading} type="submit" className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50 shrink-0">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
    </form>
  );
}
