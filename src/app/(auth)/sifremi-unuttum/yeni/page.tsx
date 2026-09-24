"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "../actions";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !token) {
      setError("Geçersiz sıfırlama bağlantısı. Sıfırlama talebini yeniden başlatmayı deneyin.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await resetPassword(email, token, password);
      setIsLoading(false);
      if (res.success) {
        setIsSuccess(true);
        toast.success("Şifreniz güncellendi!");
        setTimeout(() => {
          router.push("/giris");
        }, 3000);
      } else {
        setError(res.error || "Şifre güncellenemedi.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Bağlantı hatası oluştu.");
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Şifreniz Güncellendi!</h3>
        <p className="text-slate-500 text-sm mb-6">Yeni şifrenizle giriş sayfasına yönlendiriliyorsunuz...</p>
        <Link href="/giris" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
          Şimdi Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative group">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block font-semibold">Yeni Şifre</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
          />
        </div>
      </div>

      <div className="relative group">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block font-semibold">Şifre Tekrar</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all peer"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading || !password || !confirmPassword}
        className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  );
}

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div 
          animate={{ rotateZ: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-indigo-100 blur-[120px] rounded-full"
        />
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
              <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Güvenlik Doğrulaması</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Yeni Şifre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Belirle.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-md">
              Güçlü ve güvenli bir şifre belirleyerek hesabınızı yeniden koruma altına alın.
            </p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Şifreni Değiştir</h2>
              <p className="text-sm text-slate-600">Lütfen yeni şifrenizi giriniz.</p>
            </div>

            <Suspense fallback={<div className="text-center py-6 text-sm text-slate-500 font-medium">Yükleniyor...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
