"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Smartphone, CheckCircle2, ChevronRight, Apple, ArrowLeft, PenTool, Cpu, Battery, Wrench, ShieldCheck, ChevronLeft, UploadCloud, Camera, Phone, User, FileText, Send, Trash2, Info, AlertTriangle, Search } from "lucide-react";
import { DEVICE_DATABASE, Brand, DeviceModel, RepairOption } from "@/data/devices";
import { createRepairTicket } from "@/app/tamir-onay/actions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useShopContact } from "@/components/contact/ShopContactProvider";
import { WhatsAppIcon } from "@/components/contact/ContactFab";
import { SHOP_ADDRESS, whatsappUrl } from "@/lib/contact";

type DeliveryMethod = "magaza" | "kargo" | "uzaktan";

const DELIVERY_OPTIONS: Record<DeliveryMethod, { title: string; desc: string }> = {
  magaza: { title: "Dükkana Getireceğim", desc: `Karamürsel'deki dükkanımıza gelin: ${SHOP_ADDRESS}` },
  kargo: { title: "Kargo ile Göndereceğim", desc: "Cihazınızı bize gönderin, onarıp geri kargolayalım." },
  uzaktan: { title: "Uzaktan Bağlantı", desc: "TeamViewer veya AnyDesk ile uzaktan hızlı onarım." },
};

export function InteractiveRepairUI() {
  // Oturum istemci tarafında okunur — /tamir sayfası statik kalır (hızlı açılır)
  const { data: session } = useSession();
  const { phone: shopPhone } = useShopContact();
  const [step, setStep] = useState<number>(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<RepairOption | null>(null);
  const [isPromptingCustomModel, setIsPromptingCustomModel] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string>("");
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Form States
  const [photos, setPhotos] = useState<string[]>([]); // URLs of uploaded photos
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [details, setDetails] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("magaza");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const resetAll = () => {
    setStep(1);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedIssue(null);
    setIsPromptingCustomModel(false);
    setCustomModelName("");
    setPhotos([]);
    setDetails("");
    setPhone("");
    setName("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Client-side Image Compression
      const compressImage = (imageFile: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = (event) => {
            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;
              const maxDim = 1200; // Maksimum boyut (genişlik veya yükseklik)
              
              if (width > height && width > maxDim) {
                height *= maxDim / width;
                width = maxDim;
              } else if (height > maxDim) {
                width *= maxDim / height;
                height = maxDim;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              
              // 0.7 kalite ile JPEG olarak sıkıştır
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Sıkıştırma başarısız."));
              }, "image/jpeg", 0.7);
            };
            img.onerror = (err: any) => reject(err);
          };
          reader.onerror = (err: any) => reject(err);
        });
      };

      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Sunucu geçersiz bir yanıt verdi (Büyük dosya hatası olabilir).");
      }

      if (res.ok && data.url) {
        setPhotos([...photos, data.url]);
        toast.success("Fotoğraf başarıyla yüklendi.");
      } else {
        toast.error("Fotoğraf yüklenemedi: " + (data.error || "Bilinmeyen hata"));
      }
    } catch (error: any) {
      toast.error(error.message || "Bağlantı hatası veya dosya boyutu çok büyük.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    if (!session?.user) {
      toast.error("Fotoğraf eklemek için lütfen önce giriş yapın.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const repairData = {
      brand: selectedBrand,
      model: selectedModel,
      issue: selectedIssue,
      deliveryMethod,
      details,
      phone,
      photos // mock photos for now
    };
    
    if (session?.user) {
      try {
        const res = await createRepairTicket(repairData);
        setIsSubmitting(false);
        if (res.success) {
          setStep(5);
        } else {
          toast.error(res.error || "Talebiniz kaydedilemedi.");
        }
      } catch (err) {
        setIsSubmitting(false);
        toast.error("Bağlantı hatası oluştu.");
      }
    } else {
      sessionStorage.setItem("pendingRepairRequest", JSON.stringify(repairData));
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5);
      }, 1000);
    }
  };

  const nextStep = () => {
    setStep((s) => s + 1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };
  
  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  // Animasyon varyantları (Hızlandırıldı & GPU)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.03 }, willChange: "transform, opacity" },
    exit: { opacity: 0, scale: 1.02, y: -20, transition: { duration: 0.3, ease: "easeIn" }, willChange: "transform, opacity" }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" }, willChange: "transform, opacity" }
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[400px] relative mt-12 md:mt-16">
      
      {/* Hero Title Section - Animates away when user starts */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center mb-6 relative z-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              Dijital Ekosisteminizi <br className="md:hidden" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Onaralım.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Cihazınızdaki arızayı seçin. Uzmanlarımız fotoğraflarınızı inceleyip anında size özel <span className="font-bold text-slate-800">NET fiyat teklifinizi</span> oluştursun.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Progress Bar - Light Theme */}
      {step < 5 && (
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full -z-10" />
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full -z-10 transition-all duration-700 ease-out" 
            style={{ width: `calc(${((step - 1) / 3) * 100}% - 2rem)` }} 
          />
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 border-2 ${
                step >= s 
                  ? "bg-white text-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)] scale-110" 
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5 text-blue-600" /> : s}
            </div>
          ))}
        </div>
      )}

      {/* Main Container - Boxless and Light */}
      <div className="relative min-h-[400px] w-full">
        
        {/* Back Button */}
        {step > 1 && step < 4 && (
          <button 
            onClick={prevStep}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-bold mb-2 transition-colors px-2 py-1 text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Geri Dön
          </button>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: BRAND SELECTION */}
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
              <div className="text-center mb-8 hidden md:block">
                 <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Markanızı Seçin</h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {DEVICE_DATABASE.map((brand) => (
                  <motion.button
                    key={brand.id}
                    variants={itemVariants}
                    onClick={() => {
                      setSelectedBrand(brand);
                      nextStep();
                    }}
                    className={`group relative w-28 h-32 flex flex-col items-center justify-center gap-4 transition-transform duration-300 ${
                      selectedBrand?.id === brand.id ? "scale-110" : "hover:scale-110"
                    }`}
                  >
                    
                    <div className="flex items-center justify-center transition-all duration-300 relative z-10 w-20 h-16 group-hover:scale-110">
                      
                      {"logoUrl" in brand && brand.logoUrl ? (
                        <div 
                          className="w-16 h-16 relative drop-shadow-sm transition-all duration-300"
                          style={{
                            transform: 
                              brand.id === 'samsung' ? 'scale(2.2)' :
                              brand.id === 'huawei' ? 'scale(2.1)' :
                              brand.id === 'realme' ? 'scale(1.8)' :
                              brand.id === 'oppo' ? 'scale(1.5)' :
                              brand.id === 'apple' ? 'scale(0.85)' :
                              brand.id === 'xiaomi' ? 'scale(0.9)' :
                              brand.id === 'tecno' ? 'scale(0.85)' :
                              brand.id === 'infinix' ? 'scale(1.6)' :
                              brand.id === 'vivo' ? 'scale(1.05)' :
                              brand.id === 'honor' ? 'scale(2.5)' :
                              brand.id === 'poco' ? 'scale(1.05)' :
                              brand.id === 'reeder' ? 'scale(2.2)' :
                              brand.id === 'generalmobile' ? 'scale(3.5)' :
                              brand.id === 'casper' ? 'scale(1.8)' :
                              brand.id === 'tcl' ? 'scale(1.15)' :
                              brand.id === 'nothing' ? 'scale(1.5)' :
                              brand.id === 'omix' ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >
                          <Image 
                            src={brand.logoUrl as string} 
                            alt={brand.name} 
                            fill
                            sizes="64px"
                            className="object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).parentElement!.style.display = 'none';
                              (e.target as HTMLElement).parentElement!.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          {/* SAF HD LOGOLAR - KUTUSUZ/ŞEFFAF (Yedek) */}
                          {brand.id === "apple" && (
                            <svg viewBox="0 0 384 512" className="w-10 h-10 fill-slate-900 group-hover:fill-black transition-colors"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                          )}
                          {brand.id === "samsung" && (
                            <span className="text-[#1428A0] font-black text-xl tracking-[0.05em] uppercase" style={{ fontFamily: "Arial, sans-serif", transform: "scaleY(1.1)" }}>SAMSUNG</span>
                          )}
                          {brand.id === "xiaomi" && (
                            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#FF6700]"><path d="M12 0C8.016 0 4.756.255 2.493 2.516.23 4.776 0 8.033 0 12.012c0 3.98.23 7.235 2.494 9.497C4.757 23.77 8.017 24 12 24c3.983 0 7.243-.23 9.506-2.491C23.77 19.247 24 15.99 24 12.012c0-3.984-.233-7.243-2.502-9.504C19.234.252 15.978 0 12 0zM4.906 7.405h5.624c1.47 0 3.007.068 3.764.827.746.746.827 2.233.83 3.676v4.54a.15.15 0 0 1-.152.147h-1.947a.15.15 0 0 1-.152-.148V11.83c-.002-.806-.048-1.634-.464-2.051-.358-.36-1.026-.441-1.72-.458H7.158a.15.15 0 0 0-.151.147v6.98a.15.15 0 0 1-.152.148H4.906a.15.15 0 0 1-.15-.148V7.554a.15.15 0 0 1 .15-.149zm12.131 0h1.949a.15.15 0 0 1 .15.15v8.892a.15.15 0 0 1-.15.148h-1.949a.15.15 0 0 1-.151-.148V7.554a.15.15 0 0 1 .151-.149zM8.92 10.948h2.046c.083 0 .15.066.15.147v5.352a.15.15 0 0 1-.15.148H8.92a.15.15 0 0 1-.152-.148v-5.352a.15.15 0 0 1 .152-.147Z"/></svg>
                          )}
                          {brand.id === "huawei" && (
                            <div className="flex flex-col items-center">
                               <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#CF0A2C]"><path d="M3.67 6.14S1.82 7.91 1.72 9.78v.35c.08 1.51 1.22 2.4 1.22 2.4 1.83 1.79 6.26 4.04 7.3 4.55 0 0 .06.03.1-.01l.02-.04v-.04C7.52 10.8 3.67 6.14 3.67 6.14zM9.65 18.6c-.02-.08-.1-.08-.1-.08l-7.38.26c.8 1.43 2.15 2.53 3.56 2.2.96-.25 3.16-1.78 3.88-2.3.06-.05.04-.09.04-.09zm.08-.78C6.49 15.63.21 12.28.21 12.28c-.15.46-.2.9-.21 1.3v.07c0 1.07.4 1.82.4 1.82.8 1.69 2.34 2.2 2.34 2.2.7.3 1.4.31 1.4.31.12.02 4.4 0 5.54 0 .05 0 .08-.05.08-.05v-.06c0-.03-.03-.05-.03-.05zM9.06 3.19a3.42 3.42 0 00-2.57 3.15v.41c.03.6.16 1.05.16 1.05.66 2.9 3.86 7.65 4.55 8.65.05.05.1.03.1.03a.1.1 0 00.06-.1c1.06-10.6-1.11-13.42-1.11-13.42-.32.02-1.19.23-1.19.23zm8.299 2.27s-.49-1.8-2.44-2.28c0 0-.57-.14-1.17-.22 0 0-2.18 2.81-1.12 13.43.01.07.06.08.06.08.07.03.1-.03.1-.03.72-1.03 3.9-5.76 4.55-8.64 0 0 .36-1.4.02-2.34zm-2.92 13.07s-.07 0-.09.05c0 0-.01.07.03.1.7.51 2.85 2 3.88 2.3 0 0 .16.05.43.06h.14c.69-.02 1.9-.37 3-2.26l-7.4-.25zm7.83-8.41c.14-2.06-1.94-3.97-1.94-3.98 0 0-3.85 4.66-6.67 10.8 0 0-.03.08.02.13l.04.01h.06c1.06-.53 5.46-2.77 7.28-4.54 0 0 1.15-.93 1.21-2.42zm1.52 2.14s-6.28 3.37-9.52 5.55c0 0-.05.04-.03.11 0 0 .03.06.07.06 1.16 0 5.56 0 5.67-.02 0 0 .57-.02 1.27-.29 0 0 1.56-.5 2.37-2.27 0 0 .73-1.45.17-3.14z"/></svg>
                               <span className="text-[#CF0A2C] font-bold text-[10px] tracking-widest mt-1">HUAWEI</span>
                            </div>
                          )}
                          {brand.id === "oppo" && (
                            <span className="text-[#00665E] font-black text-2xl tracking-tighter lowercase" style={{ fontFamily: "Futura, sans-serif" }}>oppo</span>
                          )}
                          {brand.id === "realme" && (
                            <span className="text-[#FFC915] font-black text-2xl tracking-tighter lowercase">realme</span>
                          )}
                          {brand.id === "tecno" && (
                            <span className="text-[#005BFF] font-black text-2xl tracking-widest uppercase">TECNO</span>
                          )}
                          {brand.id === "infinix" && (
                            <span className="text-[#00D95F] font-black text-xl tracking-wider capitalize">Infinix</span>
                          )}
                          {brand.id === "vivo" && (
                            <span className="text-[#415FFF] font-black text-2xl tracking-tighter lowercase" style={{ fontFamily: "Futura, sans-serif" }}>vivo</span>
                          )}
                          {brand.id === "honor" && (
                            <span className="text-black font-black text-xl tracking-widest uppercase">HONOR</span>
                          )}
                          {brand.id === "poco" && (
                            <span className="text-[#FFCC00] font-black text-2xl tracking-tighter uppercase" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>POCO</span>
                          )}
                          {brand.id === "reeder" && (
                            <span className="text-slate-900 font-black text-xl tracking-tight lowercase">reeder</span>
                          )}
                          {brand.id === "generalmobile" && (
                            <svg viewBox="0 0 100 50" className="w-14 h-7">
                               <rect width="100" height="50" rx="10" fill="#222" />
                               <text x="50" y="35" fontSize="30" fontWeight="900" fill="white" textAnchor="middle" letterSpacing="-2">gm</text>
                            </svg>
                          )}
                          {brand.id === "casper" && (
                            <span className="text-[#00B4D8] font-black text-xl tracking-wide uppercase">CASPER</span>
                          )}
                          {brand.id === "tcl" && (
                            <svg viewBox="0 0 100 40" className="w-12 h-5">
                               <rect width="100" height="40" rx="4" fill="#E3000F" />
                               <text x="50" y="30" fontSize="26" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="1">TCL</text>
                            </svg>
                          )}
                          {brand.id === "nothing" && (
                            <span className="text-black font-black text-lg tracking-[0.3em] uppercase" style={{ fontFamily: "'Courier New', monospace" }}>NOTHING</span>
                          )}
                          {brand.id === "omix" && (
                            <span className="text-[#00A19B] font-black text-xl tracking-widest uppercase">OMIX</span>
                          )}
                          {brand.id === "diger" && (
                            <div className="flex flex-col items-center">
                               <div className="w-16 h-16 flex items-center justify-center text-slate-400">
                                 <span className="font-black text-6xl leading-none" style={{ transform: "translateY(-10px)" }}>...</span>
                               </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Resim Yüklenemezse Çıkacak Metin */}
                      <span className="hidden text-slate-800 font-black tracking-widest text-lg">{brand.name}</span>
                    </div>
                    <span className={`font-bold text-sm text-center transition-colors ${selectedBrand?.id === brand.id ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"}`}>
                      {brand.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: MODEL SELECTION */}
          {step === 2 && selectedBrand && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Model <span className="text-blue-600">Seçimi</span></h2>
                <p className="text-slate-500 mb-6">Hangi {selectedBrand.name} modelini kullanıyorsunuz?</p>
                
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Model arayın (Örn: S24 Ultra)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                {isPromptingCustomModel ? (
                  <motion.div variants={itemVariants} className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center mt-10">
                    <h3 className="font-black text-slate-800 text-xl mb-2">Cihazınızın Modeli Nedir?</h3>
                    <p className="text-slate-500 text-sm mb-6">Listede bulunmayan modelinizi lütfen manuel olarak giriniz.</p>
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="Örn: Samsung Galaxy A20s"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customModelName.trim()) {
                          if (selectedModel) {
                            setSelectedModel({ ...selectedModel, name: customModelName });
                          }
                          setIsPromptingCustomModel(false);
                          setSearchQuery("");
                          nextStep();
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-slate-800 font-medium"
                    />
                    <div className="flex gap-3">
                       <button 
                         onClick={() => {
                           setIsPromptingCustomModel(false);
                           setCustomModelName("");
                         }} 
                         className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                       >
                         Geri Dön
                       </button>
                       <button 
                         disabled={!customModelName.trim()}
                         onClick={() => {
                           if (selectedModel) {
                             setSelectedModel({ ...selectedModel, name: customModelName });
                           }
                           setIsPromptingCustomModel(false);
                           setSearchQuery("");
                           nextStep();
                         }} 
                         className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:bg-blue-300 transition-colors"
                       >
                         Devam Et
                       </button>
                    </div>
                  </motion.div>
                ) : (() => {
                  const filteredModels = selectedBrand.models.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  
                  if (filteredModels.length === 0) {
                    return (
                      <div className="text-center py-10 text-slate-500">
                        "{searchQuery}" aramasıyla eşleşen model bulunamadı.
                      </div>
                    );
                  }

                  const groupedModels = filteredModels.reduce((acc, model) => {
                    let group = "Tüm Modeller";
                    if (selectedBrand.id === "samsung") {
                      if (model.name.includes("Z Fold") || model.name.includes("Z Flip")) group = "Galaxy Z Serisi";
                      else if (model.name.includes("Galaxy S")) group = "Galaxy S Serisi";
                      else if (model.name.includes("Galaxy A")) group = "Galaxy A Serisi";
                      else if (model.name.includes("Galaxy M")) group = "Galaxy M Serisi";
                      else if (model.name.includes("Galaxy Note")) group = "Galaxy Note Serisi";
                      else group = "Diğer Samsung Modelleri";
                    } else if (selectedBrand.id === "apple") {
                      const match = model.name.match(/iPhone (\d+)/);
                      if (match) group = `iPhone ${match[1]} Serisi`;
                    }
                    
                    if (!acc[group]) acc[group] = [];
                    acc[group].push(model);
                    return acc;
                  }, {} as Record<string, typeof selectedBrand.models>);

                  // Özel sıralama mantığı (Z serisi en üstte, sonra S, sonra A, M vs.)
                  const sortOrder = ["Galaxy Z Serisi", "Galaxy S Serisi", "Galaxy A Serisi", "Galaxy M Serisi", "Diğer Samsung Modelleri", "Tüm Modeller"];
                  const sortedGroups = Object.keys(groupedModels).sort((a, b) => {
                    const idxA = sortOrder.indexOf(a);
                    const idxB = sortOrder.indexOf(b);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return b.localeCompare(a); // Apple için iPhone 16, 15 diye tersten sıralasın
                  });

                  return sortedGroups.map((groupName) => (
                    <div key={groupName} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      {groupName !== "Tüm Modeller" && (
                        <h3 className="font-black text-slate-800 text-lg mb-3 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-600" />
                           {groupName}
                        </h3>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {groupedModels[groupName].map((model) => (
                          <motion.button
                            key={model.id}
                            variants={itemVariants}
                            onClick={() => {
                              if (model.id.includes("diger")) {
                                setSelectedModel(model);
                                setIsPromptingCustomModel(true);
                              } else {
                                setSelectedModel(model);
                                setSearchQuery(""); // Aramayı sıfırla
                                nextStep();
                              }
                            }}
                            className="p-4 rounded-xl bg-white text-left hover:border-blue-600/50 hover:bg-blue-50/50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 group"
                          >
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">{model.name}</div>
                            <div className="text-[11px] text-slate-500 mt-1 font-medium">Orijinal Yedek Parça Desteği</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          )}

          {/* STEP 3: ISSUE SELECTION */}
          {step === 3 && selectedModel && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Arıza <span className="text-red-500">Tespiti</span></h2>
                <p className="text-slate-500">{selectedModel.name} cihazınızdaki sorun nedir?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {selectedModel.repairs.map((repair) => {
                  return (
                    <motion.button
                      key={repair.id}
                      variants={itemVariants}
                      onClick={() => {
                        setSelectedIssue(repair);
                        setDeliveryMethod(repair.id === "yazilimsal" ? "uzaktan" : "magaza");
                        nextStep();
                      }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:border-red-500/30 hover:bg-red-50/30 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner border border-slate-100 group-hover:border-red-500 flex-shrink-0">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{repair.name}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Tahmini Süre: {repair.duration}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: QUOTE REQUEST FORM */}
          {step === 4 && selectedModel && selectedIssue && (
            <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 w-full max-w-2xl mx-auto py-4">
              
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <AlertTriangle className="w-48 h-48" />
                 </div>
                 <div className="relative z-10">
                   <h3 className="text-2xl md:text-3xl font-black mb-3">Bizde "Sürpriz" Fiyat Yok!</h3>
                   <p className="text-blue-100 text-lg leading-relaxed font-medium">
                     Klasik platformlar gibi cihazınızı hiç görmeden "otomatik" bir fiyat verip, cihazı kargoladığınızda veya şubeye gittiğinizde sudan bahanelerle fiyatı yarı yarıya <strong className="text-white">düşürmüyoruz.</strong><br/><br/>
                     Cihazınızın güncel durumunu fotoğraflardan inceliyor ve size <span className="text-white font-black bg-blue-500/50 px-2 py-0.5 rounded">30 dakika içinde NET ve DEĞİŞMEYECEK</span> gerçek bir onarım teklifi sunuyoruz.
                   </p>
                 </div>
              </div>

              <div className="space-y-4">
                
                {selectedIssue.id !== 'yazilimsal' ? (
                  /* Photo Upload - Only for Hardware issues */
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <label className="flex items-center justify-between font-bold text-slate-800 mb-3 text-sm">
                      <span className="flex items-center gap-2"><Camera className="w-4 h-4 text-blue-600" /> Cihazın Durumunu Gösteren Fotoğraflar</span>
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Opsiyonel</span>
                    </label>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {photos.map((photo, i) => (
                        <div key={i} className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden">
                          {photo ? (
                            <Image src={photo} alt={`Görsel ${i+1}`} fill sizes="80px" className="object-cover" />
                          ) : (
                            <>
                              <Smartphone className="w-6 h-6 text-slate-400 mb-1" />
                              <span className="text-[10px] text-slate-400 font-medium">Görsel {i+1}</span>
                            </>
                          )}
                          <button 
                            onClick={() => setPhotos(photos.filter((_, index) => index !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                          isUploading ? "border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed" : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400"
                        }`}
                      >
                        {isUploading ? (
                          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-1" />
                        ) : (
                          <UploadCloud className="w-5 h-5 mb-1" />
                        )}
                        <span className="text-[10px] font-bold">{isUploading ? "Yükleniyor" : "Fotoğraf Ekle"}</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>
                ) : null}

                {/* Teslimat Yöntemi */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-sm">
                    <Cpu className="w-4 h-4 text-blue-600" /> Cihazınızı Nasıl Ulaştıracaksınız?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {((selectedIssue.id === "yazilimsal" ? ["uzaktan", "magaza", "kargo"] : ["magaza", "kargo"]) as DeliveryMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setDeliveryMethod(method)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${deliveryMethod === method ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}
                      >
                        <div className="font-bold text-slate-800 text-sm mb-1">{DELIVERY_OPTIONS[method].title}</div>
                        <div className="text-xs text-slate-500 font-medium">{DELIVERY_OPTIONS[method].desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-sm">
                    <FileText className="w-4 h-4 text-blue-600" /> Arıza Detayı
                  </label>
                  <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={selectedIssue.id === 'yazilimsal' 
                      ? "Lütfen yazılımsal sorunu açıklayın. (Örn: Cihaz Apple logosunda kalıyor, sürekli yeniden başlıyor veya kilitlendi...)" 
                      : "Eğer bilgisayar veya tablet arızasıysa modeliyle beraber sorunu buraya yazabilirsiniz... (Örn: Apple iPad Pro şarj almıyor, ekranında çizik var...)"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none text-slate-700 text-sm"
                  />
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-sm">
                    <Phone className="w-4 h-4 text-blue-600" /> İletişim Numarası
                  </label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all focus-within:bg-white h-12">
                    <div className="bg-slate-100 border-r border-slate-200 px-3 flex items-center justify-center font-bold text-slate-600 text-sm">
                      +90
                    </div>
                    <input 
                      type="tel"
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
                      placeholder="555 123 45 67"
                      className="w-full bg-transparent px-3 focus:outline-none text-slate-800 font-medium text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

              </div>
              
              {/* Terms and Conditions Checkbox */}
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="text-sm text-slate-700 font-medium">
                    <p className="font-bold text-slate-900 mb-1">Şartları Okudum ve Onaylıyorum</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {deliveryMethod === "kargo" && (
                        <li>Cihazı kargoya teslim ederken ürünün hasarsız gönderildiğini kanıtlamak adına video/fotoğraf çekmeyi unutmayınız.</li>
                      )}
                      <li>Kılıf, kırılmaz cam, SIM kart, hafıza kartı gibi aksesuarları cihazla birlikte bırakmayınız; kaybolması durumunda sorumluluk kabul edilmez.</li>
                      <li>Tamiri biten veya işlem bekleyen cihazların firmamızda 1 aydan fazla kalması durumunda herhangi bir sorumluluk alınmamaktadır.</li>
                    </ul>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={resetAll}
                  className="py-3 px-6 rounded-xl font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all w-1/3 shadow-sm hover:shadow-md text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!phone || !acceptedTerms || isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-xl font-black text-white text-base flex items-center justify-center gap-2 transition-all ${
                    !phone || !acceptedTerms || isSubmitting
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Teklif İste <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <motion.div key="step5" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 flex flex-col items-center justify-center h-full text-center py-16">
              
              <div className="w-28 h-28 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-indigo-100">
                <User className="w-16 h-16" />
              </div>
              
              {session?.user ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Talebiniz <span className="text-indigo-500">Alındı!</span></h2>
                  <p className="text-slate-500 mb-10 text-xl max-w-xl leading-relaxed">
                    Talebiniz başarıyla kaydedilmiştir! Teknik ekibimiz detayları inceleyip en kısa sürede cihazınız için <span className="font-bold text-slate-800">fiyat teklifi</span> belirleyecektir.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Talebiniz <span className="text-indigo-500">Hazır!</span></h2>
                  <p className="text-slate-500 mb-10 text-xl max-w-xl leading-relaxed">
                    Talebinizi oluşturduk! Sistemimize kaydedip size özel fiyat teklifinizi sunabilmemiz için <span className="font-bold text-slate-800">giriş yapmanız veya hesap oluşturmanız</span> gerekmektedir.
                  </p>
                </>
              )}
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full max-w-md shadow-sm mb-10">
                 <div className="flex items-center gap-4 text-left border-b border-slate-200 pb-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                     <Smartphone className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="font-bold text-slate-800">{selectedBrand?.name} {selectedModel?.name}</div>
                     <div className="text-sm text-slate-500">{selectedIssue?.name} Talebi</div>
                   </div>
                 </div>
                 
                 <div className="text-left space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> Telefon:</span>
                      <span className="text-slate-900 font-bold">+90 {phone}</span>
                    </div>
                    {details && (
                      <div className="text-sm">
                        <span className="text-slate-500 font-medium flex items-center gap-2 mb-1"><FileText className="w-4 h-4" /> Arıza Detayı:</span>
                        <div className="bg-white p-3 rounded-lg border border-slate-100 text-slate-700 italic">
                          "{details}"
                        </div>
                      </div>
                    )}
                    {photos.length > 0 && (
                      <div className="text-sm">
                        <span className="text-slate-500 font-medium flex items-center gap-2 mb-2"><Camera className="w-4 h-4" /> Yüklenen Görseller:</span>
                        <div className="flex gap-2">
                          {photos.map((photo, i) => (
                             <div key={i} className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 overflow-hidden">
                               {photo.startsWith("http") ? (
                                 <img src={photo} alt="Yüklenen Görsel" className="w-full h-full object-cover" />
                               ) : (
                                 <Camera className="w-5 h-5" />
                               )}
                             </div>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              <a
                href={whatsappUrl(
                  shopPhone,
                  `Merhaba, ${selectedBrand?.id === "diger" ? "" : `${selectedBrand?.name} `}${selectedModel?.name} cihazım için "${selectedIssue?.name}" talebi oluşturdum. ` +
                    `Teslimat: ${DELIVERY_OPTIONS[deliveryMethod].title}. Telefon: 0${phone.replace(/\s/g, "")}` +
                    (details ? `. Detay: ${details}` : "")
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-white bg-[#25D366] hover:bg-[#1ebe5b] shadow-lg shadow-green-600/20 transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {session?.user ? "WhatsApp'tan da Haber Verin" : "Üye Olmadan WhatsApp'tan Gönderin"}
              </a>

              <div className="flex gap-4">
                {session?.user ? (
                  <a 
                    href="/profil"
                    className="py-4 px-10 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1"
                  >
                    Müşteri Paneline Git
                  </a>
                ) : (
                  <>
                    <button 
                      onClick={resetAll}
                      className="py-4 px-8 rounded-2xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      İptal Et
                    </button>
                    <a 
                      href="/giris?callbackUrl=/tamir-onay"
                      className="py-4 px-10 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1"
                    >
                      Giriş Yap / Kayıt Ol
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}
