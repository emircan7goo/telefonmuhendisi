"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cb = params.get("callbackUrl");
    // Açık yönlendirmeyi engelle: sadece site içi göreli yollar
    if (cb && cb.startsWith("/") && !cb.startsWith("//")) setCallbackUrl(cb);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await performSignIn();
  };

  const performSignIn = async () => {
    const res = await signIn("email-password", {
      email,
      password,
      redirect: false
    });
    
    if (res?.error) {
      setError(res.error || "Giriş başarısız.");
      setIsLoading(false);
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (sessionData?.user?.role === "admin" || sessionData?.user?.role === "technician") {
          window.location.href = "/tmkontrols";
        } else {
          window.location.href = callbackUrl || "/profil";
        }
      } catch (err) {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(219,234,254,0.9), rgba(224,231,255,0.5) 60%, transparent)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100" />
      </div>

      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Left Side: Graphic */}
        <div className="hidden lg:flex flex-col items-start w-1/2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-100 backdrop-blur-md mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Güvenli Protokol</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Sisteme <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bağlan.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-md">
              Cihazınızın sağlık durumunu takip etmek ve 2FA (Çift Aşamalı Doğrulama) ile güvende kalmak için giriş yapın.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden"
            >
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Giriş Yap</h2>
                    <p className="text-sm text-slate-600">
                      Hesabınıza erişmek için bilgilerinizi girin.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                    <div className="relative group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">E-posta Adresi</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="ornek@email.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Şifre</label>
                        <Link href="/sifremi-unuttum" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Şifremi Unuttum</Link>
                      </div>
                      <div className="relative">
                        <input 
                          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                        />
                      </div>
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    
                    <motion.button
                      type="submit" disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sisteme Giriş Yap <ArrowRight className="w-5 h-5" /></>}
                    </motion.button>
                  </form>

                <div className="mt-8 text-center text-sm text-slate-500 font-medium relative z-20">
                  Hesabınız yok mu? <a href={callbackUrl ? `/kayit?callbackUrl=${callbackUrl}` : "/kayit"} className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Hemen Oluşturun</a>
                </div>

              </motion.div>

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
