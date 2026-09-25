import { DEVICE_DATABASE, type Brand, type DeviceModel } from "@/data/devices";

/**
 * AI asistan için fiyat bilgisi — tamir sihirbazıyla AYNI kaynaktan
 * (src/data/devices.ts). Asistan böylece sitede gösterilenden farklı fiyat söylemez.
 */

const tl = (n: number) => `${n.toLocaleString("tr-TR")}₺`;

const PRICED_BRANDS = DEVICE_DATABASE.filter((b) => b.id !== "diger" && b.models.length > 0);
const ISSUES = DEVICE_DATABASE[0].models[0].repairs.map((r) => ({ id: r.id, name: r.name }));

/** Marka başına her arıza için en düşük–en yüksek liste fiyatı (modül yüklenirken bir kez hesaplanır). */
export const BRAND_PRICE_RANGES_TEXT = PRICED_BRANDS.map((brand) => {
  const parts = ISSUES.map(({ id, name }) => {
    const prices = brand.models.map((m) => m.repairs.find((r) => r.id === id)!.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `${name}: ${min === max ? tl(min) : `${tl(min)}–${tl(max)}`}`;
  });
  return `- ${brand.name} (${brand.models.length} model): ${parts.join("; ")}`;
}).join("\n");

const normalize = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/\+/g, "plus") // "Pro" ile "Pro+" ayrı modeller
    .replace(/[^a-z0-9ğüşöç]+/g, "");

const MODEL_INDEX: Array<{ key: string; brand: Brand; model: DeviceModel }> = PRICED_BRANDS.flatMap((brand) =>
  brand.models.flatMap((model) => {
    const keys = new Set([normalize(`${brand.name} ${model.name}`), normalize(model.name)]);
    // Çok kısa model adları ("Phone (2)" → "phone2") yanlış eşleşmesin
    return [...keys].filter((k) => k.length >= 5).map((key) => ({ key, brand, model }));
  })
).sort((a, b) => b.key.length - a.key.length); // önce en uzun (en spesifik) ad

/**
 * Kullanıcı mesajlarında geçen modelleri bulur ve kesin liste fiyatlarını döner.
 * "iPhone 13 Pro" geçen metinde "iPhone 13" ayrıca eşleşmez (en spesifik ad kazanır).
 */
export function mentionedModelPrices(text: string, limit = 3): string | null {
  let haystack = normalize(text);
  const found: string[] = [];
  const seen = new Set<string>();

  for (const { key, brand, model } of MODEL_INDEX) {
    if (found.length >= limit) break;
    const modelKey = `${brand.id}:${model.name}`; // bazı modeller aynı id'yi paylaşıyor (ör. "Pro" / "Pro+")
    if (seen.has(modelKey) || !haystack.includes(key)) continue;
    seen.add(modelKey);
    haystack = haystack.split(key).join("|"); // eşleşen kısmı tüket
    const prices = model.repairs.map((r) => `${r.name}: ${tl(r.price)} (${r.duration})`).join("; ");
    found.push(`- ${brand.name} ${model.name}: ${prices}`);
  }
  return found.length ? found.join("\n") : null;
}
