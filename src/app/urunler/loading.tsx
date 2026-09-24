import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-5 w-96 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 h-[400px] flex flex-col">
              <div className="w-full h-[220px] bg-slate-100 rounded-2xl mb-4 animate-pulse" />
              <div className="flex flex-col gap-3 flex-1">
                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="mt-auto h-12 w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
