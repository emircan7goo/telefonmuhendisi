"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 text-center">
          <div className="max-w-md bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Kritik Bir Hata Oluştu</h1>
            <p className="text-slate-500 mb-8">
              Sistemde beklenmedik bir hata meydana geldi. Ekibimiz bu sorunu çözmek için bilgilendirildi. Lütfen daha sonra tekrar deneyin.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-slate-900 font-medium rounded-xl transition-colors"
              >
                Tekrar Dene
              </button>
              <Link href="/" className="w-full h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl flex items-center justify-center transition-colors">
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
