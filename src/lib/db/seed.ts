import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
  console.log("Seeding database...");

  // 1. Kategorileri ekle
  console.log("Kategoriler ekleniyor...");
  const catTamirInsert = await db.insert(schema.categories).values({
    name: "Tamir Hizmetleri",
    slug: "tamir",
  }).onConflictDoNothing().returning();
  
  const catAksesuarInsert = await db.insert(schema.categories).values({
    name: "Aksesuar",
    slug: "aksesuar",
  }).onConflictDoNothing().returning();

  const catİkinciElInsert = await db.insert(schema.categories).values({
    name: "İkinci El Telefonlar",
    slug: "ikinci-el",
  }).onConflictDoNothing().returning();

  // If already exists, fetch them
  const cats = await db.select().from(schema.categories);
  const catTamir = cats.find(c => c.slug === "tamir")!;
  const catAksesuar = cats.find(c => c.slug === "aksesuar")!;
  const catİkinciEl = cats.find(c => c.slug === "ikinci-el")!;

  // 2. Alt kategorileri ekle
  await db.insert(schema.categories).values([
    { name: "Ekran Değişimi", slug: "ekran-degisimi", parentId: catTamir.id },
    { name: "Batarya Değişimi", slug: "batarya-degisimi", parentId: catTamir.id },
    { name: "Anakart Tamiri", slug: "anakart-tamiri", parentId: catTamir.id },
    { name: "Telefon Kılıfları", slug: "telefon-kiliflari", parentId: catAksesuar.id },
    { name: "Şarj Cihazları", slug: "sarj-cihazlari", parentId: catAksesuar.id },
  ]).onConflictDoNothing();

  // 3. Ürünler ve Hizmetler
  console.log("Ürünler ve Hizmetler ekleniyor...");
  await db.insert(schema.products).values([
    {
      name: "iPhone 13 Pro Max Orijinal Ekran Değişimi",
      slug: "iphone-13-pro-max-orijinal-ekran-degisimi",
      description: "Apple orijinal servis parçası kullanılarak garantili ekran değişimi.",
      price: "4500.00",
      originalPrice: "5200.00",
      stock: 999, // Hizmet olduğu için yüksek stok
      categoryId: catTamir.id,
      brand: "Apple",
      condition: "new",
      features: { Garanti: "6 Ay", Süre: "Aynı Gün Teslim" },
    },
    {
      name: "Samsung Galaxy S23 Ultra Batarya Değişimi",
      slug: "samsung-s23-ultra-batarya-degisimi",
      description: "Orijinal kapasiteli sıfır batarya değişimi.",
      price: "1250.00",
      stock: 999,
      categoryId: catTamir.id,
      brand: "Samsung",
      condition: "new",
      features: { Garanti: "6 Ay", Kapasite: "5000 mAh" },
    },
    {
      name: "Baseus 65W GaN Hızlı Şarj Adaptörü",
      slug: "baseus-65w-gan-hizli-sarj-adaptoru",
      description: "Aynı anda 3 cihaz şarj edebilen yüksek verimli GaN teknolojisi.",
      price: "799.90",
      originalPrice: "999.00",
      stock: 45,
      categoryId: catAksesuar.id,
      brand: "Baseus",
      condition: "new",
      features: { Güç: "65W", Portlar: "2x Type-C, 1x USB-A" },
    },
    {
      name: "Spigen iPhone 15 Pro Kılıf Liquid Air",
      slug: "spigen-iphone-15-pro-kilif-liquid-air",
      description: "İnce tasarım ve maksimum koruma.",
      price: "499.00",
      stock: 20,
      categoryId: catAksesuar.id,
      brand: "Spigen",
      condition: "new",
      features: { Malzeme: "TPU", Renk: "Siyah" },
    },
    {
      name: "iPhone 14 128GB Gece Yarısı",
      slug: "iphone-14-128gb-gece-yarisi-ikinci-el",
      description: "A+ Kalite yenilenmiş cihaz. Pil sağlığı %95.",
      price: "24500.00",
      originalPrice: "28999.00",
      stock: 2,
      categoryId: catİkinciEl.id,
      brand: "Apple",
      condition: "refurbished",
      features: { Kapasite: "128GB", Renk: "Gece Yarısı", Garanti: "12 Ay Firma Garantisi" },
    }
  ]).onConflictDoNothing();

  console.log("Veritabanı başarıyla dolduruldu! 🎉");
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
