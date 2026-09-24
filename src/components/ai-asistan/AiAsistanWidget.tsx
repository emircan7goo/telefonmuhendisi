"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2, Zap } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Merhaba! 👋 Ben Telefon Mühendisi yapay zeka asistanıyım. Cihazınızla ilgili her türlü teknik soruyu veya arızayı yazabilirsiniz. Size olası sebepleri ve tahmini onarım fiyatlarını iletebilirim.",
  timestamp: new Date(),
};

export function AiAsistanWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Show bubble after 4 seconds if not already open
    if (!open) {
      const timer = setTimeout(() => {
        setShowBubble(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const handleOpenChat = () => {
    setOpen(true);
    setMinimized(false);
    setShowBubble(false);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    // Keep reference of current messages list including the new user message
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-asistan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        if (response.status === 401 || response.status === 413 || response.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: errData?.error || "İsteğiniz şu anda işlenemiyor.",
              timestamp: new Date(),
            },
          ]);
          return;
        }
        throw new Error("API error");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen sorunuzu tekrar yazın veya doğrudan bizi arayın: 0544 945 64 17",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <>
      {/* FAB Button + Pop-up Bubble */}
      {!open && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
          {/* Pop-up Bubble */}
          {showBubble && (
            <div 
              onClick={handleOpenChat}
              className="pointer-events-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-[11px] md:text-xs font-bold px-4 py-3 rounded-2xl rounded-br-sm shadow-xl border border-white/20 relative flex items-center gap-3 cursor-pointer animate-bounce select-none group max-w-[280px] md:max-w-xs"
            >
              <div className="flex-1 text-left">
                Size yardımcı olabilirim! 🤖<br/>
                <span className="text-[10px] opacity-90 font-medium">Hemen arıza tespiti yapalım.</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-[10px] transition-colors shrink-0"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* FAB Button */}
          <button
            id="ai-asistan-fab"
            onClick={handleOpenChat}
            aria-label="AI Arıza Asistanını aç"
            className="pointer-events-auto w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full
                       shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.6)] flex items-center justify-center
                       transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </button>
        </div>
      )}

      {/* Chat Panel (Light Theme Optimized) */}
      {open && (
        <div
          className={`fixed z-50 right-4 md:right-6 bg-white/95 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200/80
                      flex flex-col transition-all duration-300 ${
                        minimized
                          ? "bottom-20 md:bottom-6 w-72 h-14"
                          : "bottom-20 md:bottom-6 w-[340px] md:w-[400px] h-[500px] md:h-[580px]"
                      }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200/80 bg-slate-50 rounded-t-3xl flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-black text-slate-900 tracking-tight leading-none">Arıza Asistanı</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold">Gemini AI • Çevrimiçi</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMinimized((prev) => !prev)}
                className="w-7.5 h-7.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg flex items-center justify-center transition-colors"
                aria-label={minimized ? "Büyüt" : "Küçült"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setOpen(false); setMinimized(false); }}
                className="w-7.5 h-7.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] text-sm leading-relaxed rounded-2xl px-4 py-3 shadow-sm text-left ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {/* 4 Suggestion Questions */}
                {messages.length === 1 && !loading && (
                  <div className="flex flex-col gap-2 pt-2 animate-fade-in pl-9">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-1 text-left">
                      Önerilen Sorular
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "📱 Ekran değişimi ne kadar?", text: "Ekran değişimi fiyatı ne kadar?" },
                        { label: "🔋 Bataryam çabuk bitiyor", text: "Bataryam çok hızlı bitiyor, çözümü nedir?" },
                        { label: "💧 Telefonum suya düştü ne yapmalıyım?", text: "Telefonum suya düştü, ne yapmalıyım?" },
                        { label: "💰 Eski cihazımı satmak istiyorum", text: "Eski telefonumu satmak istiyorum, süreç nasıl işliyor?" },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(item.text)}
                          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-left text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 h-11 shadow-sm animate-pulse">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Control Box */}
              <div className="p-4 border-t border-slate-200/80 flex-shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Sorunuzu buraya yazın..."
                    className="flex-1 bg-transparent text-slate-900 text-sm placeholder:text-slate-400 outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim() || loading}
                    aria-label="Gönder"
                    className="w-8.5 h-8.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed
                               text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0 shadow-md shadow-blue-600/15"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2.5 font-medium">
                  AI yanıtları bilgi amaçlıdır. Nihai arıza tespiti teknik servisimizde yapılır.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
