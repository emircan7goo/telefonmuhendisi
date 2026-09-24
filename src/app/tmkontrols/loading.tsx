import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-black text-slate-900">Veriler Yükleniyor</h2>
        <p className="text-sm font-semibold text-slate-500">Panonuz hazırlanıyor, lütfen bekleyin...</p>
      </div>
    </div>
  );
}
