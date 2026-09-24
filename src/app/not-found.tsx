import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
      <h1 className="text-6xl font-black text-blue-500 mb-4">404</h1>
      <h2 className="text-xl font-bold text-white mb-2">Sayfa Bulunamadı</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
