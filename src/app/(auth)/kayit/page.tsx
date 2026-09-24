"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, User, ArrowRight, ShieldCheck, Fingerprint, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendEmailVerificationCode, verifyEmailAndRegister } from "./actions";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/email";

export default function RegisterPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Register Info Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Step 2: E-posta Verification OTP
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cb = params.get("callbackUrl");
    if (cb) setCallbackUrl(cb);
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Lütfen kullanıcı sözleşmesini onaylayın.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      setError(`Şifreniz en az ${MIN_PASSWORD_LENGTH}, en fazla ${MAX_PASSWORD_LENGTH} karakter olmalıdır.`);
      return;
    }
    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await sendEmailVerificationCode(email);
      setIsLoading(false);
      if (res.success) {
        setStep(2);
        toast.success("Doğrulama kodu e-posta adresinize gönderildi!");
      } else {
        setError(res.error || "Doğrulama kodu gönderilemedi.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Bağlantı hatası oluştu.");
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await verifyEmailAndRegister(name, phone, email, code, password);
      if (!res.success) {
        setError(res.error || "Doğrulama başarısız.");
        setIsLoading(false);
        return;
      }

      toast.success("E-posta adresiniz doğrulandı! Kayıt işleminiz tamamlandı.");

      // Yeni belirlenen şifreyle otomatik giriş; olmazsa giriş sayfasına yönlendir
      const cb = new URLSearchParams(window.location.search).get("callbackUrl");
      const safeCb = cb && cb.startsWith("/") && !cb.startsWith("//") ? cb : null;
      const login = await signIn("email-password", { email: email.trim().toLowerCase(), password, redirect: false });
      if (login && !login.error) {
        window.location.href = safeCb || "/profil";
        return;
      }
      window.location.href = safeCb ? `/giris?registered=true&callbackUrl=${encodeURIComponent(safeCb)}` : "/giris?registered=true";
    } catch (err: any) {
      setError("Kayıt tamamlanırken bir bağlantı hatası oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background Hologram & Mesh */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(219,234,254,0.9), rgba(224,231,255,0.5) 60%, transparent)" }}
        />
        {/* Holographic Topo Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100" />
      </div>

      <div className="container-custom relative z-10 flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-24 w-full">
        
        {/* Right Side: Spatial UI Graphic */}
        <div className="hidden lg:flex flex-col items-start w-1/2">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm mb-6">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Dijital Kimlik</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              {step === 1 ? (
                <>
                  Aramıza <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Katıl.</span>
                </>
              ) : (
                <>
                  E-Postanı <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Doğrula.</span>
                </>
              )}
            </h1>
            <p className="text-slate-600 text-lg max-w-md">
              {step === 1 
                ? "Sadece birkaç saniye içinde premium ekosisteme dahil olun ve ayrıcalıklı hizmetleri keşfedin."
                : `${email} adresinize gönderdiğimiz 6 haneli doğrulama kodunu girerek kaydınızı tamamlayın.`}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12"
          >
            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-white/50 bg-white/50 backdrop-blur-sm p-2">
               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Uçtan Uca Güvenlik</div>
                      <div className="text-xs text-slate-500">Kriptografik e-posta doğrulaması</div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="h-2 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-2 bg-slate-200 rounded-full w-1/2" />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Left Side: Auth Form */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.div
                key={step === 1 ? "step1" : "step2"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden"
              >
                
                {step === 1 ? (
                  /* STEP 1: Registration Form */
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">Kayıt Ol</h2>
                      <p className="text-sm text-slate-600">Yeni bir hesap oluşturarak sistemimizi etkinleştirin.</p>
                    </div>

                    <form onSubmit={handleSendCode} className="flex flex-col gap-5">
                      
                      {/* Name Input */}
                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Ad Soyad</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: Ali Yılmaz"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Telefon Numarası</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.startsWith("0")) val = val.substring(1);
                              if (val.length > 10) val = val.substring(0, 10);
                              let formatted = val;
                              if (val.length > 3) formatted = val.substring(0, 3) + " " + val.substring(3);
                              if (val.length > 6) formatted = formatted.substring(0, 7) + " " + val.substring(6);
                              if (val.length > 8) formatted = formatted.substring(0, 10) + " " + val.substring(8);
                              setPhone(formatted);
                            }}
                            placeholder="5XX XXX XX XX"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">E-posta Adresi</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      {/* Password Inputs */}
                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Şifre</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="password"
                            required
                            autoComplete="new-password"
                            minLength={MIN_PASSWORD_LENGTH}
                            maxLength={MAX_PASSWORD_LENGTH}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={`En az ${MIN_PASSWORD_LENGTH} karakter`}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Şifre (Tekrar)</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="password"
                            required
                            autoComplete="new-password"
                            minLength={MIN_PASSWORD_LENGTH}
                            maxLength={MAX_PASSWORD_LENGTH}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Şifrenizi tekrar girin"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mt-2">
                        <input 
                          type="checkbox" 
                          required 
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                        />
                        <span className="text-xs text-slate-500 leading-snug">
                          <Link href="#" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Kullanıcı Sözleşmesi</Link>'ni ve <Link href="#" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Aydınlatma Metni</Link>'ni okudum, onaylıyorum.
                        </span>
                      </div>

                      {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
                      )}

                      <motion.button
                        type="submit"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        animate={isHovering ? { scale: 1.02 } : { scale: 1 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group"
                      >
                        Kodu Gönder
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                      Zaten bir hesabınız var mı? <a href={callbackUrl ? `/giris?callbackUrl=${callbackUrl}` : "/giris"} className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Giriş Yapın</a>
                    </div>
                  </>
                ) : (
                  /* STEP 2: Email Verification OTP Form */
                  <>
                    <button 
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Bilgileri Düzenle
                    </button>

                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">Doğrulama</h2>
                      <p className="text-sm text-slate-600">
                        Lütfen <strong>{email}</strong> adresine gönderilen 6 haneli doğrulama kodunu girin.
                      </p>
                    </div>

                    <form onSubmit={handleVerifyAndRegister} className="flex flex-col gap-5">
                      
                      <div className="relative group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Doğrulama Kodu</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").substring(0, 6))}
                            placeholder="******"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-center text-xl font-black tracking-[0.4em] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
                      )}

                      <button
                        type="submit"
                        className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group"
                      >
                        Doğrula ve Kaydol
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                      Kodu almadınız mı?{" "}
                      <button 
                        type="button"
                        onClick={async () => {
                          toast.loading("Yeni kod gönderiliyor...");
                          try {
                            const res = await sendEmailVerificationCode(email);
                            toast.dismiss();
                            if (res.success) {
                              toast.success("Yeni kod başarıyla gönderildi!");
                            } else {
                              toast.error(res.error || "Kod gönderilemedi.");
                            }
                          } catch {
                            toast.dismiss();
                            toast.error("Bağlantı hatası.");
                          }
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Tekrar Gönder
                      </button>
                    </div>
                  </>
                )}

              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-80 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center p-8"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-b-2 border-indigo-600 animate-spin-reverse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-slate-900" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lütfen Bekleyin</h3>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  İşleniyor...
                  <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce delay-75" />
                  <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce delay-150" />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
