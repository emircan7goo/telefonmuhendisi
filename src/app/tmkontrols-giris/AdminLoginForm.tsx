"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { verifyAdminCredentialsAndSendOTP } from "./actions";

export default function AdminLoginForm() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Lütfen tüm alanları doldurun.");
    }

    setLoading(true);
    try {
      const res = await verifyAdminCredentialsAndSendOTP({ email, pass: password });
      if (res.success) {
        toast.success("Doğrulama kodu e-posta adresinize gönderildi!");
        setStep("otp");
      } else {
        toast.error(res.error || "Giriş bilgileri doğrulanamadı.");
      }
    } catch (err: any) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      return toast.error("Lütfen 6 haneli doğrulama kodunu girin.");
    }

    setLoading(true);
    try {
      const result = await signIn("admin-2fa", {
        email,
        otp,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Hatalı doğrulama kodu.");
      } else {
        toast.success("Giriş başarılı! Yönetim paneline aktarılıyorsunuz...");
        // Use window.location to force full session refresh
        window.location.href = "/tmkontrols";
      }
    } catch (err: any) {
      toast.error("Giriş yapılırken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent)]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(79,70,229,0.12),transparent)]" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Telefon<span className="text-blue-500">Mühendisi</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase mt-2">
            Güvenli Yönetim Portalı
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-black text-slate-200 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Yönetici Girişi
                </h2>
                
                <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Kullanıcı Adı veya E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="destek@... veya kullanıcı adı"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl py-4 font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Giriş Yap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-black text-slate-200 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  İki Adımlı Doğrulama (2FA)
                </h2>
                <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">
                  Lütfen <strong>{email}</strong> adresine gönderilen 6 haneli doğrulama kodunu girin.
                </p>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Doğrulama Kodu</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-4 text-center text-2xl font-black tracking-[10px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-700"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl py-4 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Kodu Doğrula ve Giriş Yap"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    disabled={loading}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors py-2"
                  >
                    Geri Dön
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Warning */}
        <p className="text-center text-[10px] text-slate-600 font-medium mt-8 leading-relaxed">
          Bu sisteme yetkisiz erişim kesinlikle yasaktır. Tüm erişim denemeleri ve işlemler güvenlik protokolleri çerçevesinde denetlenmekte ve kaydedilmektedir.
        </p>

      </div>
    </div>
  );
}
