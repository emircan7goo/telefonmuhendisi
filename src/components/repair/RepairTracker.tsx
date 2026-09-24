"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, SearchCheck, PenTool, CheckCircle2, Truck, AlertCircle, RefreshCw, Smartphone } from "lucide-react";
import { getPublicTrackingStatus } from "./trackerAction";

type TrackerStep = {
  id: number;
  label: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming" | "error";
  date?: string;
  description?: string;
};

export function RepairTracker() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSteps, setActiveSteps] = useState<TrackerStep[] | null>(null);
  const [deviceModel, setDeviceModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    setIsSearching(true);
    setError(null);
    setActiveSteps(null);
    setDeviceModel(null);

    try {
      const res = await getPublicTrackingStatus(trackingNumber);
      if (res.success && res.stages) {
        // Map icon components back onto the serialized stages
        const iconMap: Record<number, React.ElementType> = {
          1: Package,
          2: SearchCheck,
          3: PenTool,
          4: CheckCircle2,
          5: Truck
        };

        const mappedStages = res.stages.map(stage => ({
          ...stage,
          icon: iconMap[stage.id] || CheckCircle2
        })) as TrackerStep[];

        setActiveSteps(mappedStages);
        setDeviceModel(res.deviceModel || null);
      } else {
        setError(res.error || "Takip kodu bulunamadı.");
      }
    } catch (err) {
      setError("Takip bilgileri sorgulanırken bir sunucu hatası oluştu.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const getProgressPercentage = () => {
    if (!activeSteps) return 0;
    const completedCount = activeSteps.filter(s => s.status === "completed").length;
    const currentExists = activeSteps.some(s => s.status === "current" || s.status === "error");
    return Math.min(100, Math.max(0, ((completedCount + (currentExists ? 0.5 : 0)) / (activeSteps.length - 1)) * 100));
  };

  return (
    <section className="py-20 relative bg-white overflow-hidden" id="tracker">
      <div className="absolute inset-0 bg-blue-50/30 -z-10" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Canlı Onarım Takibi</h2>
          <p className="text-gray-500 font-medium">Cihazınızın güncel onarım durumunu ve tüm adımlarını anlık olarak izleyin.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
          
          {/* Top Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Takip Numaranız veya Talep No (Örn: TM-1)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching || !trackingNumber.trim()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Sorgula"}
            </button>
          </div>

          {/* Device Model Info Banner */}
          {deviceModel && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl p-4 px-6 text-sm font-bold text-blue-700 mb-8">
              <Smartphone className="w-5 h-5" />
              Sorgulanan Cihaz: {deviceModel}
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-medium flex items-center gap-3 border border-red-100 text-sm"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tracker UI */}
          {activeSteps && (
            <div className="relative">
              
              {/* Progress Bar Background */}
              <div className="absolute top-8 left-0 right-0 h-2 bg-gray-100 rounded-full hidden md:block" />
              
              {/* Progress Bar Fill */}
              <motion.div 
                className="absolute top-8 left-0 h-2 bg-blue-500 rounded-full hidden md:block"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                {activeSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  const isError = step.status === "error";

                  return (
                    <div key={step.id} className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-4 flex-1 relative">
                      
                      {/* Vertical line for mobile */}
                      {index !== activeSteps.length - 1 && (
                        <div className="absolute left-[1.1rem] top-10 bottom-[-2.2rem] w-0.5 bg-gray-100 md:hidden z-[-1]">
                          <motion.div 
                            className={`w-full ${(isCompleted || isCurrent) ? 'bg-blue-500' : ''}`}
                            initial={{ height: 0 }}
                            animate={{ height: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      )}

                      {/* Icon Circle */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        className={`w-9 h-9 md:w-16 md:h-16 rounded-full flex items-center justify-center border-[3px] bg-white transition-colors duration-500 relative shrink-0
                          ${isCompleted ? 'border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 
                            isCurrent ? 'border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 
                            isError ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 
                            'border-gray-200 text-gray-300'}`}
                      >
                        <Icon className={`w-4 h-4 md:w-7 md:h-7 ${isCurrent && 'animate-pulse'}`} />
                        
                        {(isCurrent || isError) && (
                          <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isError ? 'bg-red-500' : 'bg-amber-500 animate-bounce'}`} />
                        )}
                        {isCompleted && (
                          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </motion.div>

                      {/* Text details */}
                      <div className="flex-1 md:w-full md:px-2">
                        <div className="flex items-center md:justify-center gap-2 mb-1">
                          <h4 className={`font-black text-xs md:text-sm ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-amber-600' : isError ? 'text-red-600' : 'text-gray-400'}`}>
                            {step.label}
                          </h4>
                        </div>
                        {step.date && (
                          <span className="text-[10px] font-bold text-blue-500 mb-1 block">Tarih: {step.date}</span>
                        )}
                        {step.description && (
                          <p className={`text-[11px] md:text-xs font-semibold leading-relaxed ${isError ? 'text-red-500' : 'text-gray-500'}`}>
                            {step.description}
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
