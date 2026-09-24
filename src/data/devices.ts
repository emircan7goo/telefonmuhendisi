export type IssueType = 
  | "ekran" 
  | "batarya" 
  | "arka_cam" 
  | "kamera" 
  | "sarj_soketi" 
  | "sivi_temasi" 
  | "anakart"
  | "yazilimsal";

export interface RepairOption {
  id: IssueType;
  name: string;
  price: number;
  duration: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  repairs: RepairOption[];
}

export type DeviceCategory = 'phone' | 'tablet' | 'computer' | 'watch';

export interface Brand {
  supportedCategories: DeviceCategory[];
  id: string;
  name: string;
  logoUrl: string;
  models: DeviceModel[];
}

/**
 * Tüm modeller aynı 8 kalemlik tamir listesini kullanır; sadece fiyat çarpanı
 * değişir. Veri bu yüzden [id, ad, çarpan] olarak tutulur ve tamir listesi
 * modül yüklenirken üretilir (eskiden her model için 8 satır tekrar ediyordu,
 * dosya ~276 KB idi ve istemci paketine giriyordu).
 */
const REPAIR_CATALOG: ReadonlyArray<{ id: IssueType; name: string; basePrice: number; duration: string }> = [
  { id: "ekran", name: "Orijinal Ekran Değişimi", basePrice: 5000, duration: "1 Saat" },
  { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", basePrice: 1500, duration: "45 Dk" },
  { id: "arka_cam", name: "Arka Cam Lazer Değişimi", basePrice: 2500, duration: "2 Saat" },
  { id: "kamera", name: "Kamera Lens/Modül Değişimi", basePrice: 3000, duration: "1.5 Saat" },
  { id: "sarj_soketi", name: "Şarj Soketi Onarımı", basePrice: 1200, duration: "1 Saat" },
  { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", basePrice: 2000, duration: "24 Saat" },
  { id: "anakart", name: "Anakart Mikro Tamiri", basePrice: 4500, duration: "1-3 Gün" },
  { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", basePrice: 800, duration: "Uzaktan/Kargo" },
];

/** Model için tamir seçenekleri: taban fiyat × çarpan, 100 TL'ye yuvarlanır. */
const generateRepairs = (multiplier: number): RepairOption[] =>
  REPAIR_CATALOG.map(({ id, name, basePrice, duration }) => ({
    id,
    name,
    price: Math.round((basePrice * multiplier) / 100) * 100,
    duration,
  }));

/** [model id, model adı, fiyat çarpanı] */
type ModelRow = readonly [id: string, name: string, multiplier: number];

interface BrandRow {
  id: string;
  name: string;
  supportedCategories: DeviceCategory[];
  logoUrl: string;
  models: readonly ModelRow[];
}

const BRANDS: readonly BrandRow[] = [
  {
    id: "apple",
    name: "Apple",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://cdn-icons-png.magnific.com/512/0/747.png",
    models: [
      ["apple_iphone17promax", "iPhone 17 Pro Max", 4],
      ["apple_iphone17pro", "iPhone 17 Pro", 3.8],
      ["apple_iphone17", "iPhone 17", 3.3],
      ["apple_iphone16promax", "iPhone 16 Pro Max", 3.5],
      ["apple_iphone16pro", "iPhone 16 Pro", 3.3],
      ["apple_iphone16plus", "iPhone 16 Plus", 3],
      ["apple_iphone16", "iPhone 16", 2.9],
      ["apple_iphone15promax", "iPhone 15 Pro Max", 3],
      ["apple_iphone15pro", "iPhone 15 Pro", 2.8],
      ["apple_iphone15plus", "iPhone 15 Plus", 2.6],
      ["apple_iphone15", "iPhone 15", 2.4],
      ["apple_iphone14promax", "iPhone 14 Pro Max", 2.6],
      ["apple_iphone14pro", "iPhone 14 Pro", 2.4],
      ["apple_iphone14plus", "iPhone 14 Plus", 2.2],
      ["apple_iphone14", "iPhone 14", 2],
      ["apple_iphone13promax", "iPhone 13 Pro Max", 2.2],
      ["apple_iphone13pro", "iPhone 13 Pro", 2],
      ["apple_iphone13", "iPhone 13", 1.8],
      ["apple_iphone13mini", "iPhone 13 Mini", 1.6],
      ["apple_iphone12promax", "iPhone 12 Pro Max", 1.8],
      ["apple_iphone12pro", "iPhone 12 Pro", 1.6],
      ["apple_iphone12", "iPhone 12", 1.4],
      ["apple_iphone12mini", "iPhone 12 Mini", 1.3],
      ["apple_iphone11promax", "iPhone 11 Pro Max", 1.5],
      ["apple_iphone11pro", "iPhone 11 Pro", 1.4],
      ["apple_iphone11", "iPhone 11", 1.2],
      ["apple_iphonexsmax", "iPhone XS Max", 1.2],
      ["apple_iphonexs", "iPhone XS", 1.1],
      ["apple_iphonexr", "iPhone XR", 1],
      ["apple_iphonex", "iPhone X", 0.9],
      ["apple_iphonese3nesil", "iPhone SE (3. Nesil)", 1.2],
      ["apple_iphonese2nesil", "iPhone SE (2. Nesil)", 0.9],
      ["apple_iphone8plus", "iPhone 8 Plus", 0.8],
      ["apple_iphone8", "iPhone 8", 0.7],
      ["apple_iphone7plus", "iPhone 7 Plus", 0.6],
      ["apple_iphone7", "iPhone 7", 0.5],
      ["apple_diger", "Diğer Apple Modeli", 1],
    ],
  },
  {
    id: "samsung",
    name: "Samsung",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://static.vecteezy.com/system/resources/previews/020/975/545/non_2x/samsung-logo-samsung-icon-transparent-free-png.png",
    models: [
      ["samsung_galaxyzfold6", "Galaxy Z Fold6", 3.5],
      ["samsung_galaxyzflip6", "Galaxy Z Flip6", 3.5],
      ["samsung_galaxyzfold5", "Galaxy Z Fold5", 3.2],
      ["samsung_galaxyzflip5", "Galaxy Z Flip5", 3.2],
      ["samsung_galaxyzfold4", "Galaxy Z Fold4", 3],
      ["samsung_galaxyzflip4", "Galaxy Z Flip4", 3],
      ["samsung_galaxys24ultra", "Galaxy S24 Ultra", 3.2],
      ["samsung_galaxys24", "Galaxy S24+", 2.8],
      ["samsung_galaxys24", "Galaxy S24", 2.6],
      ["samsung_galaxys23ultra", "Galaxy S23 Ultra", 2.8],
      ["samsung_galaxys23", "Galaxy S23+", 2.5],
      ["samsung_galaxys23", "Galaxy S23", 2.3],
      ["samsung_galaxys23fe", "Galaxy S23 FE", 2],
      ["samsung_galaxys22ultra", "Galaxy S22 Ultra", 2.5],
      ["samsung_galaxys22", "Galaxy S22+", 2.2],
      ["samsung_galaxys22", "Galaxy S22", 2],
      ["samsung_galaxys21ultra", "Galaxy S21 Ultra", 2],
      ["samsung_galaxys21", "Galaxy S21+", 1.8],
      ["samsung_galaxys21", "Galaxy S21", 1.6],
      ["samsung_galaxys21fe", "Galaxy S21 FE", 1.5],
      ["samsung_galaxys20ultra", "Galaxy S20 Ultra", 1.8],
      ["samsung_galaxys20fe", "Galaxy S20 FE", 1.3],
      ["samsung_galaxya555g", "Galaxy A55 5G", 1.4],
      ["samsung_galaxya545g", "Galaxy A54 5G", 1.2],
      ["samsung_galaxya535g", "Galaxy A53 5G", 1.1],
      ["samsung_galaxya52s5g", "Galaxy A52s 5G", 1],
      ["samsung_galaxya52", "Galaxy A52", 0.9],
      ["samsung_galaxya355g", "Galaxy A35 5G", 1.2],
      ["samsung_galaxya345g", "Galaxy A34 5G", 1],
      ["samsung_galaxya335g", "Galaxy A33 5G", 0.9],
      ["samsung_galaxya32", "Galaxy A32", 0.8],
      ["samsung_galaxya255g", "Galaxy A25 5G", 1],
      ["samsung_galaxya24", "Galaxy A24", 0.8],
      ["samsung_galaxya23", "Galaxy A23", 0.7],
      ["samsung_galaxya15", "Galaxy A15", 0.6],
      ["samsung_galaxym54", "Galaxy M54", 1.1],
      ["samsung_galaxym53", "Galaxy M53", 1],
      ["samsung_galaxym34", "Galaxy M34", 0.9],
      ["samsung_galaxym14", "Galaxy M14", 0.7],
      ["samsung_diger", "Diğer Samsung Modeli", 1],
    ],
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    supportedCategories: ["phone", "tablet", "watch"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/960px-Xiaomi_logo_%282021-%29.svg.png",
    models: [
      ["xiaomi_xiaomi14ultra", "Xiaomi 14 Ultra", 3],
      ["xiaomi_xiaomi14pro", "Xiaomi 14 Pro", 2.8],
      ["xiaomi_xiaomi14", "Xiaomi 14", 2.5],
      ["xiaomi_xiaomi13ultra", "Xiaomi 13 Ultra", 2.5],
      ["xiaomi_xiaomi13pro", "Xiaomi 13 Pro", 2.3],
      ["xiaomi_xiaomi13", "Xiaomi 13", 2],
      ["xiaomi_xiaomi13tpro", "Xiaomi 13T Pro", 2.2],
      ["xiaomi_xiaomi13t", "Xiaomi 13T", 1.8],
      ["xiaomi_xiaomi12tpro", "Xiaomi 12T Pro", 1.8],
      ["xiaomi_xiaomi12t", "Xiaomi 12T", 1.5],
      ["xiaomi_xiaomi12pro", "Xiaomi 12 Pro", 1.8],
      ["xiaomi_xiaomi12", "Xiaomi 12", 1.5],
      ["xiaomi_xiaomi11tpro", "Xiaomi 11T Pro", 1.4],
      ["xiaomi_xiaomi11t", "Xiaomi 11T", 1.2],
      ["xiaomi_mi11lite", "Mi 11 Lite", 1],
      ["xiaomi_redminote13pro", "Redmi Note 13 Pro+", 1.5],
      ["xiaomi_redminote13pro", "Redmi Note 13 Pro", 1.3],
      ["xiaomi_redminote13", "Redmi Note 13", 1],
      ["xiaomi_redminote12pro", "Redmi Note 12 Pro+", 1.3],
      ["xiaomi_redminote12pro", "Redmi Note 12 Pro", 1.1],
      ["xiaomi_redminote12", "Redmi Note 12", 0.9],
      ["xiaomi_redminote11pro", "Redmi Note 11 Pro+", 1.1],
      ["xiaomi_redminote11pro", "Redmi Note 11 Pro", 1],
      ["xiaomi_redminote11", "Redmi Note 11", 0.8],
      ["xiaomi_redminote10pro", "Redmi Note 10 Pro", 0.9],
      ["xiaomi_redminote10s", "Redmi Note 10S", 0.7],
      ["xiaomi_redminote9pro", "Redmi Note 9 Pro", 0.7],
      ["xiaomi_diger", "Diğer Xiaomi Modeli", 1],
    ],
  },
  {
    id: "huawei",
    name: "Huawei",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://www.freepnglogos.com/uploads/huawei-logo-png/huawei-logo-transparent-2.png",
    models: [
      ["huawei_pura70ultra", "Pura 70 Ultra", 3],
      ["huawei_pura70pro", "Pura 70 Pro", 2.8],
      ["huawei_pura70", "Pura 70", 2.5],
      ["huawei_mate60pro", "Mate 60 Pro+", 2.8],
      ["huawei_mate60pro", "Mate 60 Pro", 2.5],
      ["huawei_mate60", "Mate 60", 2.2],
      ["huawei_p60pro", "P60 Pro", 2.3],
      ["huawei_p60", "P60", 2],
      ["huawei_mate50pro", "Mate 50 Pro", 2],
      ["huawei_p50pro", "P50 Pro", 1.8],
      ["huawei_p50pocket", "P50 Pocket", 2.2],
      ["huawei_p40pro", "P40 Pro", 1.5],
      ["huawei_p40lite", "P40 Lite", 0.8],
      ["huawei_p30pro", "P30 Pro", 1.2],
      ["huawei_p30lite", "P30 Lite", 0.6],
      ["huawei_nova12se", "Nova 12 SE", 1.2],
      ["huawei_nova11", "Nova 11", 1],
      ["huawei_nova10", "Nova 10", 0.9],
      ["huawei_nova9", "Nova 9", 0.8],
      ["huawei_diger", "Diğer Huawei Modeli", 1],
    ],
  },
  {
    id: "oppo",
    name: "Oppo",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/OPPO_Logo_wiki.png",
    models: [
      ["oppo_findx7ultra", "Find X7 Ultra", 2.8],
      ["oppo_findx7", "Find X7", 2.5],
      ["oppo_reno11pro", "Reno 11 Pro", 1.8],
      ["oppo_reno11", "Reno 11", 1.5],
      ["oppo_reno10pro", "Reno 10 Pro+", 1.6],
      ["oppo_reno10pro", "Reno 10 Pro", 1.4],
      ["oppo_reno10", "Reno 10", 1.2],
      ["oppo_reno7", "Reno 7", 0.9],
      ["oppo_reno6", "Reno 6", 0.8],
      ["oppo_reno5", "Reno 5", 0.7],
      ["oppo_a795g", "A79 5G", 0.9],
      ["oppo_a78", "A78", 0.8],
      ["oppo_a58", "A58", 0.7],
      ["oppo_a54", "A54", 0.6],
      ["oppo_a16", "A16", 0.5],
      ["oppo_diger", "Diğer Oppo Modeli", 0.8],
    ],
  },
  {
    id: "realme",
    name: "realme",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.png",
    models: [
      ["realme_gt5pro", "GT5 Pro", 2.2],
      ["realme_gt3", "GT3", 1.8],
      ["realme_gtneo3", "GT Neo 3", 1.5],
      ["realme_12pro", "12 Pro+", 1.5],
      ["realme_12pro", "12 Pro", 1.3],
      ["realme_12", "12", 1.1],
      ["realme_11pro", "11 Pro+", 1.3],
      ["realme_11pro", "11 Pro", 1.1],
      ["realme_11", "11", 0.9],
      ["realme_10pro", "10 Pro+", 1.1],
      ["realme_10", "10", 0.8],
      ["realme_c67", "C67", 0.8],
      ["realme_c55", "C55", 0.7],
      ["realme_c53", "C53", 0.6],
      ["realme_c21y", "C21Y", 0.5],
      ["realme_diger", "Diğer Realme Modeli", 0.8],
    ],
  },
  {
    id: "poco",
    name: "Poco",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Poco_Smartphone_Company_logo.png",
    models: [
      ["poco_pocof6pro", "POCO F6 Pro", 1.8],
      ["poco_pocof6", "POCO F6", 1.6],
      ["poco_pocof5pro", "POCO F5 Pro", 1.5],
      ["poco_pocof5", "POCO F5", 1.3],
      ["poco_pocox6pro", "POCO X6 Pro", 1.4],
      ["poco_pocox6", "POCO X6", 1.2],
      ["poco_pocox5pro", "POCO X5 Pro", 1.2],
      ["poco_pocox5", "POCO X5", 1],
      ["poco_pocom6pro", "POCO M6 Pro", 1],
      ["poco_pocom5s", "POCO M5s", 0.8],
      ["poco_pocox3pro", "POCO X3 Pro", 0.9],
      ["poco_pocox3nfc", "POCO X3 NFC", 0.8],
      ["poco_diger", "Diğer Poco Modeli", 0.8],
    ],
  },
  {
    id: "vivo",
    name: "vivo",
    supportedCategories: ["phone"],
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqWmUV8HRwaOavdOGa_r_4EkvKnT3tAkMMvw&s",
    models: [
      ["vivo_x100pro", "X100 Pro", 2.6],
      ["vivo_x100", "X100", 2.3],
      ["vivo_v30pro", "V30 Pro", 1.8],
      ["vivo_v30", "V30", 1.5],
      ["vivo_v30lite", "V30 Lite", 1.2],
      ["vivo_v295g", "V29 5G", 1.4],
      ["vivo_v29lite", "V29 Lite", 1.1],
      ["vivo_v255g", "V25 5G", 1.2],
      ["vivo_y36", "Y36", 0.8],
      ["vivo_y35", "Y35", 0.7],
      ["vivo_y22s", "Y22s", 0.6],
      ["vivo_diger", "Diğer Vivo Modeli", 0.8],
    ],
  },
  {
    id: "honor",
    name: "Honor",
    supportedCategories: ["phone", "tablet", "watch"],
    logoUrl: "https://www.logo.wine/a/logo/Honor_8x/Honor_8x-Logo.wine.svg",
    models: [
      ["honor_magic6pro", "Magic6 Pro", 2.8],
      ["honor_magicv2", "Magic V2", 3.5],
      ["honor_magic5pro", "Magic5 Pro", 2.4],
      ["honor_honor200pro", "Honor 200 Pro", 2],
      ["honor_honor200", "Honor 200", 1.7],
      ["honor_honor90", "Honor 90", 1.4],
      ["honor_honor70", "Honor 70", 1.2],
      ["honor_honorx9b", "Honor X9b", 1.1],
      ["honor_honorx9a", "Honor X9a", 1],
      ["honor_honorx7b", "Honor X7b", 0.8],
      ["honor_diger", "Diğer Honor Modeli", 0.8],
    ],
  },
  {
    id: "tecno",
    name: "Tecno",
    supportedCategories: ["phone"],
    logoUrl: "",
    models: [
      ["tecno_phantomvfold", "Phantom V Fold", 3],
      ["tecno_phantomvflip", "Phantom V Flip", 2.5],
      ["tecno_camon30pro5g", "Camon 30 Pro 5G", 1.5],
      ["tecno_camon30", "Camon 30", 1.2],
      ["tecno_camon20pro", "Camon 20 Pro", 1],
      ["tecno_spark20pro", "Spark 20 Pro+", 1],
      ["tecno_spark20pro", "Spark 20 Pro", 0.9],
      ["tecno_spark10pro", "Spark 10 Pro", 0.8],
      ["tecno_pova6pro5g", "Pova 6 Pro 5G", 1],
      ["tecno_pova5pro", "Pova 5 Pro", 0.9],
      ["tecno_diger", "Diğer Tecno Modeli", 0.7],
    ],
  },
  {
    id: "infinix",
    name: "Infinix",
    supportedCategories: ["phone"],
    logoUrl: "https://static.vecteezy.com/system/resources/previews/068/973/775/non_2x/infinix-black-wordmark-logo-on-transparent-background-free-png.png",
    models: [
      ["infinix_note40pro5g", "Note 40 Pro+ 5G", 1.4],
      ["infinix_note40pro", "Note 40 Pro", 1.2],
      ["infinix_note40", "Note 40", 1],
      ["infinix_note30vip", "Note 30 VIP", 1.2],
      ["infinix_note30pro", "Note 30 Pro", 1],
      ["infinix_note30", "Note 30", 0.9],
      ["infinix_zero305g", "Zero 30 5G", 1.3],
      ["infinix_zero30", "Zero 30", 1.1],
      ["infinix_hot40pro", "Hot 40 Pro", 0.8],
      ["infinix_hot40i", "Hot 40i", 0.7],
      ["infinix_diger", "Diğer Infinix Modeli", 0.7],
    ],
  },
  {
    id: "reeder",
    name: "Reeder",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://iconlogovector.com/uploads/images/2024/12/lg-675e2298a5d23-Reeder.webp",
    models: [
      ["reeder_s23promax", "S23 Pro Max", 0.8],
      ["reeder_s19maxpros", "S19 Max Pro S", 0.7],
      ["reeder_s19maxpro", "S19 Max Pro", 0.6],
      ["reeder_s19max", "S19 Max", 0.5],
      ["reeder_p13bluemax", "P13 Blue Max", 0.4],
      ["reeder_p13blue", "P13 Blue", 0.3],
      ["reeder_diger", "Diğer Reeder Modeli", 0.5],
    ],
  },
  {
    id: "generalmobile",
    name: "General Mobile",
    supportedCategories: ["phone"],
    logoUrl: "https://www.dijifabrik.com/wp-content/uploads/2019/04/Group-1026@2x.png",
    models: [
      ["generalmobile_gm24pro", "GM 24 Pro", 0.9],
      ["generalmobile_gm24", "GM 24", 0.8],
      ["generalmobile_gm23se", "GM 23 SE", 0.6],
      ["generalmobile_gm23", "GM 23", 0.7],
      ["generalmobile_gm22pro", "GM 22 Pro", 0.7],
      ["generalmobile_gm22plus", "GM 22 Plus", 0.6],
      ["generalmobile_gm22", "GM 22", 0.5],
      ["generalmobile_gm21pro", "GM 21 Pro", 0.6],
      ["generalmobile_gm21plus", "GM 21 Plus", 0.5],
      ["generalmobile_diger", "Diğer GM Modeli", 0.5],
    ],
  },
  {
    id: "casper",
    name: "Casper",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://www.casper.com.tr/uploads/2021/01/casper-logo-lacivert.png",
    models: [
      ["casper_viax30plus", "VIA X30 Plus", 0.9],
      ["casper_viax30", "VIA X30", 0.8],
      ["casper_viav30", "VIA V30", 0.7],
      ["casper_viam35", "VIA M35", 0.6],
      ["casper_viae30", "VIA E30", 0.5],
      ["casper_viax20", "VIA X20", 0.6],
      ["casper_diger", "Diğer Casper Modeli", 0.5],
    ],
  },
  {
    id: "tcl",
    name: "TCL",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logo_of_the_TCL_Corporation.svg/1280px-Logo_of_the_TCL_Corporation.svg.png",
    models: [
      ["tcl_40nxtpaper", "40 NXTPAPER", 0.9],
      ["tcl_40se", "40 SE", 0.7],
      ["tcl_30", "30+", 0.7],
      ["tcl_30se", "30 SE", 0.6],
      ["tcl_20pro5g", "20 Pro 5G", 0.8],
      ["tcl_diger", "Diğer TCL Modeli", 0.5],
    ],
  },
  {
    id: "nothing",
    name: "Nothing",
    supportedCategories: ["phone"],
    logoUrl: "https://cdn.nothing.community/2025-12-14/1765733320-179713-nothing-01.jpg",
    models: [
      ["nothing_phone2", "Phone (2)", 1.8],
      ["nothing_phone2aplus", "Phone (2a) Plus", 1.5],
      ["nothing_phone2a", "Phone (2a)", 1.4],
      ["nothing_phone1", "Phone (1)", 1.2],
      ["nothing_cmfphone1", "CMF Phone 1", 1],
      ["nothing_diger", "Diğer Nothing Modeli", 1],
    ],
  },
  {
    id: "omix",
    name: "Omix",
    supportedCategories: ["phone"],
    logoUrl: "https://images.seeklogo.com/logo-png/52/1/omix-telefon-logo-png_seeklogo-522593.png",
    models: [
      ["omix_x600", "X600", 0.7],
      ["omix_x400", "X400", 0.6],
      ["omix_x300", "X300", 0.5],
      ["omix_diger", "Diğer Omix Modeli", 0.5],
    ],
  },
  {
    id: "diger",
    name: "DİĞER",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "",
    models: [
      ["diger_listedeolmayanmarkamodel", "Listede Olmayan Marka/Model", 1],
    ],
  },
];

export const DEVICE_DATABASE: Brand[] = BRANDS.map((brand) => ({
  ...brand,
  models: brand.models.map(([id, name, multiplier]) => ({ id, name, repairs: generateRepairs(multiplier) })),
}));
