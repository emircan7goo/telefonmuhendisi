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

const generateRepairs = (basePrice: number): RepairOption[] => {
  return [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * basePrice / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * basePrice / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * basePrice / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * basePrice / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * basePrice / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * basePrice / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * basePrice / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * basePrice / 100) * 100, duration: "Uzaktan/Kargo" }
  ];
};

export const DEVICE_DATABASE: Brand[] = [
  {
    id: "apple",
    name: "Apple",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://cdn-icons-png.magnific.com/512/0/747.png",
    models: [
      { id: "apple_iphone17promax", name: "iPhone 17 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone17pro", name: "iPhone 17 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },

      { id: "apple_iphone17", name: "iPhone 17", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone16promax", name: "iPhone 16 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone16pro", name: "iPhone 16 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone16plus", name: "iPhone 16 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone16", name: "iPhone 16", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone15promax", name: "iPhone 15 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone15pro", name: "iPhone 15 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone15plus", name: "iPhone 15 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone15", name: "iPhone 15", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone14promax", name: "iPhone 14 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone14pro", name: "iPhone 14 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone14plus", name: "iPhone 14 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone14", name: "iPhone 14", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone13promax", name: "iPhone 13 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone13pro", name: "iPhone 13 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone13", name: "iPhone 13", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone13mini", name: "iPhone 13 Mini", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone12promax", name: "iPhone 12 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone12pro", name: "iPhone 12 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone12", name: "iPhone 12", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone12mini", name: "iPhone 12 Mini", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone11promax", name: "iPhone 11 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone11pro", name: "iPhone 11 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone11", name: "iPhone 11", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonexsmax", name: "iPhone XS Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonexs", name: "iPhone XS", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonexr", name: "iPhone XR", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonex", name: "iPhone X", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonese3nesil", name: "iPhone SE (3. Nesil)", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphonese2nesil", name: "iPhone SE (2. Nesil)", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone8plus", name: "iPhone 8 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone8", name: "iPhone 8", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone7plus", name: "iPhone 7 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_iphone7", name: "iPhone 7", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "apple_diger", name: "Diğer Apple Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "samsung",
    name: "Samsung",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://static.vecteezy.com/system/resources/previews/020/975/545/non_2x/samsung-logo-samsung-icon-transparent-free-png.png",
    models: [
      { id: "samsung_galaxyzfold6", name: "Galaxy Z Fold6", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxyzflip6", name: "Galaxy Z Flip6", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxyzfold5", name: "Galaxy Z Fold5", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxyzflip5", name: "Galaxy Z Flip5", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxyzfold4", name: "Galaxy Z Fold4", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxyzflip4", name: "Galaxy Z Flip4", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys24ultra", name: "Galaxy S24 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys24", name: "Galaxy S24+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys24", name: "Galaxy S24", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys23ultra", name: "Galaxy S23 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys23", name: "Galaxy S23+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys23", name: "Galaxy S23", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys23fe", name: "Galaxy S23 FE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys22ultra", name: "Galaxy S22 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys22", name: "Galaxy S22+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys22", name: "Galaxy S22", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys21ultra", name: "Galaxy S21 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys21", name: "Galaxy S21+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys21", name: "Galaxy S21", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys21fe", name: "Galaxy S21 FE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys20ultra", name: "Galaxy S20 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxys20fe", name: "Galaxy S20 FE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya555g", name: "Galaxy A55 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya545g", name: "Galaxy A54 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya535g", name: "Galaxy A53 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya52s5g", name: "Galaxy A52s 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya52", name: "Galaxy A52", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya355g", name: "Galaxy A35 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya345g", name: "Galaxy A34 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya335g", name: "Galaxy A33 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya32", name: "Galaxy A32", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya255g", name: "Galaxy A25 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya24", name: "Galaxy A24", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya23", name: "Galaxy A23", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxya15", name: "Galaxy A15", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxym54", name: "Galaxy M54", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxym53", name: "Galaxy M53", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxym34", name: "Galaxy M34", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_galaxym14", name: "Galaxy M14", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "samsung_diger", name: "Diğer Samsung Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    supportedCategories: ["phone", "tablet", "watch"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/960px-Xiaomi_logo_%282021-%29.svg.png",
    models: [
      { id: "xiaomi_xiaomi14ultra", name: "Xiaomi 14 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi14pro", name: "Xiaomi 14 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi14", name: "Xiaomi 14", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi13ultra", name: "Xiaomi 13 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi13pro", name: "Xiaomi 13 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi13", name: "Xiaomi 13", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi13tpro", name: "Xiaomi 13T Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi13t", name: "Xiaomi 13T", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi12tpro", name: "Xiaomi 12T Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi12t", name: "Xiaomi 12T", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi12pro", name: "Xiaomi 12 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi12", name: "Xiaomi 12", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi11tpro", name: "Xiaomi 11T Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_xiaomi11t", name: "Xiaomi 11T", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_mi11lite", name: "Mi 11 Lite", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote13pro", name: "Redmi Note 13 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote13pro", name: "Redmi Note 13 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote13", name: "Redmi Note 13", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote12pro", name: "Redmi Note 12 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote12pro", name: "Redmi Note 12 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote12", name: "Redmi Note 12", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote11pro", name: "Redmi Note 11 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote11pro", name: "Redmi Note 11 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote11", name: "Redmi Note 11", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote10pro", name: "Redmi Note 10 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote10s", name: "Redmi Note 10S", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_redminote9pro", name: "Redmi Note 9 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "xiaomi_diger", name: "Diğer Xiaomi Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "huawei",
    name: "Huawei",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "https://www.freepnglogos.com/uploads/huawei-logo-png/huawei-logo-transparent-2.png",
    models: [
      { id: "huawei_pura70ultra", name: "Pura 70 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_pura70pro", name: "Pura 70 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_pura70", name: "Pura 70", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_mate60pro", name: "Mate 60 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_mate60pro", name: "Mate 60 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_mate60", name: "Mate 60", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p60pro", name: "P60 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p60", name: "P60", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_mate50pro", name: "Mate 50 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p50pro", name: "P50 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p50pocket", name: "P50 Pocket", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p40pro", name: "P40 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p40lite", name: "P40 Lite", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p30pro", name: "P30 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_p30lite", name: "P30 Lite", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_nova12se", name: "Nova 12 SE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_nova11", name: "Nova 11", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_nova10", name: "Nova 10", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_nova9", name: "Nova 9", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "huawei_diger", name: "Diğer Huawei Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "oppo",
    name: "Oppo",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/OPPO_Logo_wiki.png",
    models: [
      { id: "oppo_findx7ultra", name: "Find X7 Ultra", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_findx7", name: "Find X7", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno11pro", name: "Reno 11 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno11", name: "Reno 11", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno10pro", name: "Reno 10 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno10pro", name: "Reno 10 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno10", name: "Reno 10", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno7", name: "Reno 7", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno6", name: "Reno 6", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_reno5", name: "Reno 5", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_a795g", name: "A79 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_a78", name: "A78", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_a58", name: "A58", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_a54", name: "A54", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_a16", name: "A16", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "oppo_diger", name: "Diğer Oppo Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "realme",
    name: "realme",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.png",
    models: [
      { id: "realme_gt5pro", name: "GT5 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_gt3", name: "GT3", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_gtneo3", name: "GT Neo 3", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_12pro", name: "12 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_12pro", name: "12 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_12", name: "12", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_11pro", name: "11 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_11pro", name: "11 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_11", name: "11", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_10pro", name: "10 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_10", name: "10", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_c67", name: "C67", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_c55", name: "C55", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_c53", name: "C53", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_c21y", name: "C21Y", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "realme_diger", name: "Diğer Realme Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "poco",
    name: "Poco",
    supportedCategories: ["phone"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Poco_Smartphone_Company_logo.png",
    models: [
      { id: "poco_pocof6pro", name: "POCO F6 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocof6", name: "POCO F6", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocof5pro", name: "POCO F5 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocof5", name: "POCO F5", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox6pro", name: "POCO X6 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox6", name: "POCO X6", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox5pro", name: "POCO X5 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox5", name: "POCO X5", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocom6pro", name: "POCO M6 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocom5s", name: "POCO M5s", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox3pro", name: "POCO X3 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_pocox3nfc", name: "POCO X3 NFC", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "poco_diger", name: "Diğer Poco Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "vivo",
    name: "vivo",
    supportedCategories: ["phone"],
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqWmUV8HRwaOavdOGa_r_4EkvKnT3tAkMMvw&s",
    models: [
      { id: "vivo_x100pro", name: "X100 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_x100", name: "X100", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v30pro", name: "V30 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v30", name: "V30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v30lite", name: "V30 Lite", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v295g", name: "V29 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v29lite", name: "V29 Lite", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_v255g", name: "V25 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_y36", name: "Y36", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_y35", name: "Y35", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_y22s", name: "Y22s", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "vivo_diger", name: "Diğer Vivo Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "honor",
    name: "Honor",
    supportedCategories: ["phone", "tablet", "watch"],
    logoUrl: "https://www.logo.wine/a/logo/Honor_8x/Honor_8x-Logo.wine.svg",
    models: [
      { id: "honor_magic6pro", name: "Magic6 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_magicv2", name: "Magic V2", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_magic5pro", name: "Magic5 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honor200pro", name: "Honor 200 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honor200", name: "Honor 200", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honor90", name: "Honor 90", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honor70", name: "Honor 70", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honorx9b", name: "Honor X9b", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honorx9a", name: "Honor X9a", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_honorx7b", name: "Honor X7b", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "honor_diger", name: "Diğer Honor Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "tecno",
    name: "Tecno",
    supportedCategories: ["phone"],
    logoUrl: "",
    models: [
      { id: "tecno_phantomvfold", name: "Phantom V Fold", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_phantomvflip", name: "Phantom V Flip", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 2.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 2.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 2.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 2.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 2.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 2.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 2.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_camon30pro5g", name: "Camon 30 Pro 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_camon30", name: "Camon 30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_camon20pro", name: "Camon 20 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_spark20pro", name: "Spark 20 Pro+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_spark20pro", name: "Spark 20 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_spark10pro", name: "Spark 10 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_pova6pro5g", name: "Pova 6 Pro 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_pova5pro", name: "Pova 5 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tecno_diger", name: "Diğer Tecno Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "infinix",
    name: "Infinix",
    supportedCategories: ["phone"],
    logoUrl: "https://static.vecteezy.com/system/resources/previews/068/973/775/non_2x/infinix-black-wordmark-logo-on-transparent-background-free-png.png",
    models: [
      { id: "infinix_note40pro5g", name: "Note 40 Pro+ 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_note40pro", name: "Note 40 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_note40", name: "Note 40", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_note30vip", name: "Note 30 VIP", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_note30pro", name: "Note 30 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_note30", name: "Note 30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_zero305g", name: "Zero 30 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_zero30", name: "Zero 30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_hot40pro", name: "Hot 40 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_hot40i", name: "Hot 40i", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "infinix_diger", name: "Diğer Infinix Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "reeder",
    name: "Reeder",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://iconlogovector.com/uploads/images/2024/12/lg-675e2298a5d23-Reeder.webp",
    models: [
      { id: "reeder_s23promax", name: "S23 Pro Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_s19maxpros", name: "S19 Max Pro S", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_s19maxpro", name: "S19 Max Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_s19max", name: "S19 Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_p13bluemax", name: "P13 Blue Max", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_p13blue", name: "P13 Blue", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.3 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.3 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.3 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.3 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.3 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.3 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.3 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.3 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "reeder_diger", name: "Diğer Reeder Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "generalmobile",
    name: "General Mobile",
    supportedCategories: ["phone"],
    logoUrl: "https://www.dijifabrik.com/wp-content/uploads/2019/04/Group-1026@2x.png",
    models: [
      { id: "generalmobile_gm24pro", name: "GM 24 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm24", name: "GM 24", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm23se", name: "GM 23 SE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm23", name: "GM 23", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm22pro", name: "GM 22 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm22plus", name: "GM 22 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm22", name: "GM 22", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm21pro", name: "GM 21 Pro", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_gm21plus", name: "GM 21 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "generalmobile_diger", name: "Diğer GM Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "casper",
    name: "Casper",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://www.casper.com.tr/uploads/2021/01/casper-logo-lacivert.png",
    models: [
      { id: "casper_viax30plus", name: "VIA X30 Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_viax30", name: "VIA X30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_viav30", name: "VIA V30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_viam35", name: "VIA M35", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_viae30", name: "VIA E30", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_viax20", name: "VIA X20", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "casper_diger", name: "Diğer Casper Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "tcl",
    name: "TCL",
    supportedCategories: ["phone", "tablet"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logo_of_the_TCL_Corporation.svg/1280px-Logo_of_the_TCL_Corporation.svg.png",
    models: [
      { id: "tcl_40nxtpaper", name: "40 NXTPAPER", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.9 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.9 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.9 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.9 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.9 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.9 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.9 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tcl_40se", name: "40 SE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tcl_30", name: "30+", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tcl_30se", name: "30 SE", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tcl_20pro5g", name: "20 Pro 5G", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "tcl_diger", name: "Diğer TCL Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "nothing",
    name: "Nothing",
    supportedCategories: ["phone"],
    logoUrl: "https://cdn.nothing.community/2025-12-14/1765733320-179713-nothing-01.jpg",
    models: [
      { id: "nothing_phone2", name: "Phone (2)", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.8 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.8 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.8 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.8 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.8 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.8 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.8 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "nothing_phone2aplus", name: "Phone (2a) Plus", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "nothing_phone2a", name: "Phone (2a)", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.4 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.4 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.4 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.4 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.4 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.4 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.4 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "nothing_phone1", name: "Phone (1)", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1.2 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1.2 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1.2 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1.2 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1.2 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1.2 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1.2 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "nothing_cmfphone1", name: "CMF Phone 1", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "nothing_diger", name: "Diğer Nothing Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "omix",
    name: "Omix",
    supportedCategories: ["phone"],
    logoUrl: "https://images.seeklogo.com/logo-png/52/1/omix-telefon-logo-png_seeklogo-522593.png",
    models: [
      { id: "omix_x600", name: "X600", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.7 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.7 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.7 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.7 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.7 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.7 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.7 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "omix_x400", name: "X400", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.6 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.6 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.6 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.6 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.6 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.6 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.6 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "omix_x300", name: "X300", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
      { id: "omix_diger", name: "Diğer Omix Modeli", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 0.5 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 0.5 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 0.5 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 0.5 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 0.5 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 0.5 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 0.5 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  },
  {
    id: "diger",
    name: "DİĞER",
    supportedCategories: ["phone", "tablet", "computer", "watch"],
    logoUrl: "",
    models: [
      { id: "diger_listedeolmayanmarkamodel", name: "Listede Olmayan Marka/Model", repairs: [
    { id: "ekran", name: "Orijinal Ekran Değişimi", price: Math.round(5000 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "batarya", name: "Deji/Orijinal Batarya Yenileme", price: Math.round(1500 * 1 / 100) * 100, duration: "45 Dk" },
    { id: "arka_cam", name: "Arka Cam Lazer Değişimi", price: Math.round(2500 * 1 / 100) * 100, duration: "2 Saat" },
    { id: "kamera", name: "Kamera Lens/Modül Değişimi", price: Math.round(3000 * 1 / 100) * 100, duration: "1.5 Saat" },
    { id: "sarj_soketi", name: "Şarj Soketi Onarımı", price: Math.round(1200 * 1 / 100) * 100, duration: "1 Saat" },
    { id: "sivi_temasi", name: "Sıvı Teması Revizyonu", price: Math.round(2000 * 1 / 100) * 100, duration: "24 Saat" },
    { id: "anakart", name: "Anakart Mikro Tamiri", price: Math.round(4500 * 1 / 100) * 100, duration: "1-3 Gün" },
    { id: "yazilimsal", name: "Yazılımsal Arıza / Çökme", price: Math.round(800 * 1 / 100) * 100, duration: "Uzaktan/Kargo" }
  ] },
    ]
  }
];
