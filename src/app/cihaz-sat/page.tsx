"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Smartphone, CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, Camera, Phone, User, FileText, Send, Trash2, AlertTriangle, Search, Sparkles, ScanLine, Hammer, PowerOff, ShieldCheck } from "lucide-react";
import { DEVICE_DATABASE, Brand, DeviceModel } from "@/data/devices";
import { submitDeviceSale } from "./actions";
import toast from "react-hot-toast";

const CONDITIONS = [
  { id: "Sıfır Gibi (Çiziksiz)", name: "Sıfır Gibi (Çiziksiz)", desc: "Çiziksiz, daha önce tamir görmemiş kusursuz cihaz", icon: Sparkles, color: "text-emerald-500", bgHover: "hover:bg-emerald-50/30 hover:border-emerald-500/30", bgIcon: "bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white border-emerald-100 group-hover:border-emerald-500" },
  { id: "Kılcal Çizikler Var", name: "Kılcal Çizikler Var", desc: "Ekranda veya kasada göze batmayan ufak tefek kullanım izleri", icon: ScanLine, color: "text-blue-500", bgHover: "hover:bg-blue-50/30 hover:border-blue-500/30", bgIcon: "bg-blue-50 group-hover:bg-blue-500 group-hover:text-white border-blue-100 group-hover:border-blue-500" },
  { id: "Kozmetik Hasarlı", name: "Kozmetik Hasarlı", desc: "Kasada belirgin vuruklar, ezikler veya derin çizikler", icon: Hammer, color: "text-amber-500", bgHover: "hover:bg-amber-50/30 hover:border-amber-500/30", bgIcon: "bg-amber-50 group-hover:bg-amber-500 group-hover:text-white border-amber-100 group-hover:border-amber-500" },
  { id: "Ekranı/Camı Kırık", name: "Ekranı/Camı Kırık", desc: "Ön ekran, arka cam veya kamera lensi kırık/çatlak", icon: AlertTriangle, color: "text-orange-500", bgHover: "hover:bg-orange-50/30 hover:border-orange-500/30", bgIcon: "bg-orange-50 group-hover:bg-orange-500 group-hover:text-white border-orange-100 group-hover:border-orange-500" },
  { id: "Çalışmıyor (Parça Niyetine)", name: "Çalışmıyor (Parça Niyetine)", desc: "Cihaz hiç açılmıyor veya anakart arızası mevcut", icon: PowerOff, color: "text-red-500", bgHover: "hover:bg-red-50/30 hover:border-red-500/30", bgIcon: "bg-red-50 group-hover:bg-red-500 group-hover:text-white border-red-100 group-hover:border-red-500" },
];

export default function CihazSatPage() {
  const [step, setStep] = useState<number>(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  
  const [isPromptingCustomModel, setIsPromptingCustomModel] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Form States
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const resetAll = () => {
    setStep(1);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedCondition("");
    setIsPromptingCustomModel(false);
    setCustomModelName("");
    setPhotos([]);
    setNotes("");
    setPhone("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
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
              const maxDim = 1200;
              
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

      const res = await fetch("/api/upload?folder=device-sales", {
        method: "POST",
        body: formData,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Sunucu geçersiz bir yanıt verdi.");
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
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (photos.length < 3) {
      toast.error("Lütfen cihazın en az 3 fotoğrafını yükleyin.");
      return;
    }

    setIsSubmitting(true);

    const saleData = {
      brand: selectedBrand?.name || "",
      model: selectedModel?.name || "",
      condition: selectedCondition,
      notes: notes + (phone ? ` | İletişim: ${phone}` : ""),
      images: photos
    };

    try {
      const res = await submitDeviceSale(saleData);
      setIsSubmitting(false);
      if (res.success) {
        setStep(5);
      } else {
        toast.error(res.error || "Talebiniz kaydedilemedi. Lütfen giriş yaptığınızdan emin olun.");
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error("Bağlantı hatası oluştu.");
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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.03 }, willChange: "transform, opacity" },
    exit: { opacity: 0, scale: 1.02, y: -20, filter: "blur(5px)", transition: { duration: 0.3, ease: "easeIn" }, willChange: "transform, opacity" }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" }, willChange: "transform, opacity" }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 relative">
        
        {/* Hero Title Section */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60, filter: "blur(12px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-center mb-10 relative z-20"
            >
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full inline-block mb-6 shadow-sm">
                ANINDA FİYAT & NAKİT ÖDEME
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
                Eski Cihazını Değerlendir <br className="md:hidden" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Nakit Paraya Çevir.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                Cihazının modelini ve durumunu seç, fotoğraflarını yükle. Uzmanlarımız inceleyip sana özel <span className="font-bold text-slate-800">30 Dakika içinde NET fiyat teklifini</span> göndersin.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 relative px-4 max-w-3xl mx-auto">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200/50 rounded-full -z-10" />
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -z-10 transition-all duration-700 ease-out" 
              style={{ width: `calc(${((step - 1) / 3) * 100}% - 2rem)` }} 
            />
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-lg transition-all duration-500 border-2 ${
                  step >= s 
                    ? "bg-white text-emerald-600 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-110" 
                    : "bg-white text-slate-400 border-slate-200"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" /> : s}
              </div>
            ))}
          </div>
        )}

        {/* Main Container */}
        <div className="relative min-h-[400px] w-full max-w-4xl mx-auto">
          
          {/* Back Button */}
          {step > 1 && step < 5 && (
            <button 
              onClick={prevStep}
              className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 font-bold mb-4 transition-colors px-2 py-1 text-sm bg-white rounded-lg shadow-sm border border-slate-100 w-max"
            >
              <ChevronLeft className="w-4 h-4" /> Geri Dön
            </button>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: BRAND SELECTION */}
            {step === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="text-center mb-8">
                   <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Markanızı Seçin</h2>
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
                          <span className="hidden text-slate-800 font-black tracking-widest text-lg">{brand.name}</span>
                        )}
                      </div>
                      <span className={`font-bold text-sm text-center transition-colors ${selectedBrand?.id === brand.id ? "text-emerald-600" : "text-slate-600 group-hover:text-emerald-600"}`}>
                        {brand.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: MODEL SELECTION */}
            {step === 2 && selectedBrand && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Model <span className="text-emerald-500">Seçimi</span></h2>
                  <p className="text-slate-500 mb-6 font-medium">Hangi {selectedBrand.name} modelini satmak istiyorsunuz?</p>
                  
                  <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Model arayın (Örn: S24 Ultra)" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-slate-800 placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {isPromptingCustomModel ? (
                    <motion.div variants={itemVariants} className="max-w-md mx-auto bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center mt-6">
                      <h3 className="font-black text-slate-800 text-xl mb-2">Cihazınızın Modeli Nedir?</h3>
                      <p className="text-slate-500 text-sm mb-6 font-medium">Listede bulunmayan modelinizi lütfen manuel olarak tam adıyla (Hafıza dahil) giriniz.</p>
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Örn: Samsung Galaxy A20s, 64GB"
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
                        className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-6 text-slate-800 font-bold"
                      />
                      <div className="flex gap-3">
                         <button 
                           onClick={() => {
                             setIsPromptingCustomModel(false);
                             setCustomModelName("");
                           }} 
                           className="flex-1 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                         >
                           İptal
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
                           className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:bg-emerald-300 transition-colors shadow-md"
                         >
                           Devam Et
                         </button>
                      </div>
                    </motion.div>
                  ) : (() => {
                    const filteredModels = selectedBrand.models.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    if (filteredModels.length === 0) {
                      return (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                          <p className="font-bold text-lg mb-1">Bulunamadı</p>
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

                    const sortOrder = ["Galaxy Z Serisi", "Galaxy S Serisi", "Galaxy A Serisi", "Galaxy M Serisi", "Diğer Samsung Modelleri", "Tüm Modeller"];
                    const sortedGroups = Object.keys(groupedModels).sort((a, b) => {
                      const idxA = sortOrder.indexOf(a);
                      const idxB = sortOrder.indexOf(b);
                      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                      if (idxA !== -1) return -1;
                      if (idxB !== -1) return 1;
                      return b.localeCompare(a);
                    });

                    return sortedGroups.map((groupName) => (
                      <div key={groupName} className="mb-6">
                        {groupName !== "Tüm Modeller" && (
                          <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
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
                                  setSearchQuery("");
                                  nextStep();
                                }
                              }}
                              className="p-5 rounded-2xl bg-slate-50/50 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-all border-2 border-transparent group"
                            >
                              <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base">{model.name}</div>
                              <div className="text-[11px] text-slate-500 mt-1 font-medium group-hover:text-emerald-600/70">Cihaz Seçimi</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONDITION SELECTION */}
            {step === 3 && selectedModel && (
              <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Kozmetik <span className="text-amber-500">Durum</span></h2>
                  <p className="text-slate-500 font-medium">{selectedModel.name} cihazınızın fiziksel durumu nasıl?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 max-w-2xl mx-auto">
                  {CONDITIONS.map((cond) => {
                    const Icon = cond.icon;
                    return (
                      <motion.button
                        key={cond.id}
                        variants={itemVariants}
                        onClick={() => {
                          setSelectedCondition(cond.name);
                          nextStep();
                        }}
                        className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white border-2 border-slate-100 shadow-sm transition-all text-left ${cond.bgHover}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${cond.bgIcon} flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${cond.color} group-hover:text-white transition-colors`} />
                          </div>
                          <div>
                            <div className={`font-black text-lg mb-1 transition-colors ${cond.color}`}>{cond.name}</div>
                            <div className="text-sm text-slate-600 font-medium">
                              {cond.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-6 h-6 text-slate-300 group-hover:translate-x-1 transition-transform ${cond.color}`} />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: DETAILS & UPLOAD */}
            {step === 4 && selectedModel && selectedCondition && (
              <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 w-full max-w-2xl mx-auto py-2">
                
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 opacity-10">
                     <Sparkles className="w-64 h-64" />
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-2xl md:text-3xl font-black mb-3">Satış Talebinizi Tamamlıyoruz</h3>
                     <p className="text-emerald-50 text-lg leading-relaxed font-medium">
                       En doğru ve yüksek teklifi sunabilmemiz için cihazın fotoğraflarını yüklemeniz <strong className="text-white bg-emerald-700/50 px-2 py-0.5 rounded">zorunludur.</strong> Lütfen cihazın ön, arka ve kenarlarını (varsa çizik veya kırıkları) net çeken <strong className="text-white underline decoration-2 decoration-teal-300 underline-offset-4">en az 3 fotoğraf</strong> ekleyin.
                     </p>
                   </div>
                </div>

                <div className="space-y-5">
                  
                  {/* Photo Upload - Mandatory for Sales */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                    <label className="flex items-center justify-between font-black text-slate-800 mb-4 text-base">
                      <span className="flex items-center gap-2"><Camera className="w-5 h-5 text-emerald-500" /> Cihaz Fotoğrafları</span>
                      <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-bold">Zorunlu (En az 3 adet)</span>
                    </label>
                    <div className="flex flex-wrap gap-4 mb-2">
                      {photos.map((photo, i) => (
                        <div key={i} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden">
                          <Image src={photo} alt={`Görsel ${i+1}`} fill sizes="80px" className="object-cover" />
                          <button 
                            onClick={() => setPhotos(photos.filter((_, index) => index !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                          isUploading ? "border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed" : "border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-400"
                        }`}
                      >
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-2" />
                        ) : (
                          <UploadCloud className="w-6 h-6 mb-2" />
                        )}
                        <span className="text-xs font-bold text-center px-2">{isUploading ? "Yükleniyor" : "Fotoğraf Ekle"}</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                    {photos.length > 0 && photos.length < 3 && (
                       <p className="text-rose-500 text-sm font-bold mt-4 flex items-center gap-1">
                         <AlertTriangle className="w-4 h-4" /> En az 3 adet fotoğraf yüklemelisiniz. ({photos.length}/3)
                       </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                    <label className="flex items-center gap-2 font-black text-slate-800 mb-4 text-base">
                      <FileText className="w-5 h-5 text-emerald-500" /> Ek Açıklama / Kozmetik Durum Detayları
                    </label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Cihazın varsa değişen parçalarını, pil yüzdesini veya ekstra durumlarını (kutusu var mı, faturası var mı) belirtin. Daha net teklif almanızı sağlar."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none text-slate-700 text-base font-medium"
                    />
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                    <label className="flex items-center gap-2 font-black text-slate-800 mb-4 text-base">
                      <Phone className="w-5 h-5 text-emerald-500" /> WhatsApp / İletişim Numarası
                    </label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 transition-all focus-within:bg-white h-14">
                      <div className="bg-slate-100 border-r border-slate-200 px-4 flex items-center justify-center font-bold text-slate-600 text-base">
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
                        className="w-full bg-transparent px-4 focus:outline-none text-slate-800 font-bold text-lg placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                  </div>

                </div>
                
                {/* Terms and Conditions */}
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-sm text-slate-700 font-medium">
                      <p className="font-bold text-slate-900 mb-1 text-base">Şartları Okudum ve Onaylıyorum</p>
                      <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-slate-600 mt-2">
                        <li>Verilen teklif, beyan ettiğiniz durum ve fotoğraflar üzerinden ön fiyattır. Cihaz incelendikten sonra değişiklik gösterebilir.</li>
                        <li>Cihazın size ait olduğunu, çalıntı veya yasadışı yollarla elde edilmediğini taahhüt edersiniz.</li>
                        <li>Anlaşma sağlanması durumunda ödemeniz cihaz test edildikten sonra aynı gün nakit/havale olarak yapılır.</li>
                      </ul>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={resetAll}
                    className="py-4 px-6 rounded-2xl font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all w-1/3 shadow-sm text-base md:text-lg"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!phone || !acceptedTerms || photos.length < 3 || isSubmitting}
                    className={`flex-1 py-4 px-6 rounded-2xl font-black text-white text-base md:text-lg flex items-center justify-center gap-2 transition-all ${
                      !phone || !acceptedTerms || photos.length < 3 || isSubmitting
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-[0_15px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1"
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
              <motion.div key="step5" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 flex flex-col items-center justify-center py-16 px-4 bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 text-center">
                
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-emerald-100 rotate-3"
                >
                  <ShieldCheck className="w-16 h-16" />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Talebiniz <span className="text-emerald-500">Alındı!</span></h2>
                <p className="text-slate-500 mb-10 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                  Cihaz satım talebiniz başarıyla alınmıştır. Uzmanlarımız fotoğrafları ve cihaz detaylarını inceleyip <span className="font-black text-slate-800 bg-emerald-100 px-2 rounded">30 Dakika içerisinde</span> size özel net nakit teklifimizi iletecektir.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                  <button 
                    onClick={() => window.location.href = '/profil'}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-1"
                  >
                    Profilime Git
                  </button>
                  <button 
                    onClick={resetAll}
                    className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all shadow-sm"
                  >
                    Yeni Talep
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
