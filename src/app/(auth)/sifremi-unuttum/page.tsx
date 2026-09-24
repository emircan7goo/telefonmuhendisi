"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await requestPasswordReset(email);
      setIsLoading(false);
      if (res.success) {
        setSuccess(res.message || "Sıfırlama bağlantısı gönderildi.");
      } else {
        setError(res.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Bağlantı hatası oluştu.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div 
          animate={{ rotateZ: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-indigo-100 blur-[120px] rounded-full"
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">
        
        {/* Left Side: Info */}
        <div className="hidden lg:flex flex-col items-start w-1/2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-100 backdrop-blur-md mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">E-posta Koruma</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Şifreni <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sıfırla.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-md">
              E-posta adresinizi girerek şifrenizi sıfırlamak için gerekli bağlantıyı talep edebilirsiniz.
            </p>
          </motion.div>

          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mt-16 relative w-64 h-64 border border-blue-100 bg-white rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(37,99,235,0.1)]"
          >
            <div className="absolute inset-2 border border-indigo-100 rounded-full border-dashed" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2rem] p-8 md:p-10 w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Şifremi Unuttum</h2>
              <p className="text-sm text-slate-600">Lütfen kayıtlı e-posta adresinizi yazınız.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
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

              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
              )}

              {success && (
                <div className="text-green-700 text-sm font-medium bg-green-50 p-4 rounded-xl border border-green-100">{success}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? "İşleniyor..." : "Sıfırlama Linki Gönder"}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              <Link href="/giris">Giriş Sayfasına Dön</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
