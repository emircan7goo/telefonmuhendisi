/**
 * Tamir durum makinesi — tamir durumlarının, etiketlerinin ve izinli geçişlerin
 * TEK kaynağı. Saf modül (DB/Node bağımlılığı yok): hem server action'lar hem
 * client component'ler buradan import eder.
 *
 * Akış:
 *   pending → diagnosing → awaiting_customer_approval ─┬→ customer_agreed → shipped_to_shop → received_by_shop ─┐
 *                                  ↑   │                └→ in_progress (mağaza / uzaktan)                       │
 *                                  │   └→ customer_counter_offer                                              ↓
 *                                  └──────────────── (personel yeni teklif) ◄──────────────────────── in_progress
 *   in_progress → pending_payment → completed      (her aktif aşamadan → cancelled)
 */

export const REPAIR_STATUSES = [
  "pending",
  "diagnosing",
  "awaiting_customer_approval",
  "customer_counter_offer",
  "customer_agreed",
  "shipped_to_shop",
  "received_by_shop",
  "in_progress",
  "pending_payment",
  "completed",
  "cancelled",
] as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[number];
export type RepairActor = "staff" | "customer";

/** Eski/alternatif isimler → kanonik durum. DB'de kalmış eski kayıtlar da doğru yorumlanır. */
const LEGACY_ALIASES: Record<string, RepairStatus> = {
  pending_quote: "pending",
  negotiating: "awaiting_customer_approval",
  awaiting_shipment: "customer_agreed",
  received: "received_by_shop",
  repairing: "in_progress",
  shipped: "completed",
  delivered: "completed",
};

export function isRepairStatus(value: unknown): value is RepairStatus {
  return typeof value === "string" && (REPAIR_STATUSES as readonly string[]).includes(value);
}

/** Kanonik durum veya eski isim ise kanonik durumu, tanınmayan değerde null döner. */
export function parseRepairStatus(value: unknown): RepairStatus | null {
  if (isRepairStatus(value)) return value;
  return (typeof value === "string" && LEGACY_ALIASES[value]) || null;
}

/** DB'den okunan değeri yorumlamak için: tanınmayan değerler "pending" kabul edilir. */
export function normalizeRepairStatus(value: string | null | undefined): RepairStatus {
  return parseRepairStatus(value) ?? "pending";
}

interface StatusMeta {
  /** Personel panelindeki etiket */
  label: string;
  /** Müşteriye gösterilen etiket */
  customerLabel: string;
  /** Tailwind rozet sınıfları */
  badge: string;
  /** /takip zaman çizelgesindeki aşama (0-4) */
  stage: number;
}

export const REPAIR_STATUS_META: Record<RepairStatus, StatusMeta> = {
  pending:                    { label: "Talep Alındı",            customerLabel: "Talep Alındı",            badge: "bg-slate-100 text-slate-700",     stage: 0 },
  diagnosing:                 { label: "Arıza Tespiti",           customerLabel: "Arıza Tespiti",           badge: "bg-blue-100 text-blue-700",       stage: 2 },
  awaiting_customer_approval: { label: "Müşteri Onayı Bekliyor",  customerLabel: "Onayınız Bekleniyor",     badge: "bg-purple-100 text-purple-700",   stage: 0 },
  customer_counter_offer:     { label: "Müşteri Karşı Teklifi",   customerLabel: "Teklifiniz İnceleniyor",  badge: "bg-orange-100 text-orange-700",   stage: 0 },
  customer_agreed:            { label: "Kargo Bekleniyor",        customerLabel: "Fiyat Onaylandı",         badge: "bg-pink-100 text-pink-700",       stage: 1 },
  shipped_to_shop:            { label: "Kargoda (Bize Geliyor)",  customerLabel: "Kargoda (Bize Geliyor)",  badge: "bg-cyan-100 text-cyan-700",       stage: 1 },
  received_by_shop:           { label: "Dükkana Ulaştı",          customerLabel: "Teslim Alındı",           badge: "bg-violet-100 text-violet-700",   stage: 2 },
  in_progress:                { label: "Onarımda (Masada)",       customerLabel: "Onarımda",                badge: "bg-indigo-100 text-indigo-700",   stage: 3 },
  pending_payment:            { label: "Ödeme Bekleniyor",        customerLabel: "Ödeme Bekleniyor",        badge: "bg-teal-100 text-teal-700",       stage: 4 },
  completed:                  { label: "Tamamlandı",              customerLabel: "Tamamlandı ✓",            badge: "bg-emerald-100 text-emerald-700", stage: 4 },
  cancelled:                  { label: "İptal Edildi",            customerLabel: "İptal",                   badge: "bg-red-100 text-red-700",         stage: 0 },
};

export function repairStatusMeta(status: string | null | undefined): StatusMeta {
  return REPAIR_STATUS_META[normalizeRepairStatus(status)];
}

/** Personelin (admin/teknisyen) yapabileceği geçişler. */
const STAFF_TRANSITIONS: Record<RepairStatus, readonly RepairStatus[]> = {
  pending:                    ["diagnosing", "awaiting_customer_approval", "received_by_shop", "in_progress", "cancelled"],
  diagnosing:                 ["awaiting_customer_approval", "in_progress", "cancelled"],
  // Personel yeni teklif verebilir veya müşterinin telefonda/yüz yüze verdiği onayı işleyebilir
  awaiting_customer_approval: ["awaiting_customer_approval", "diagnosing", "customer_agreed", "in_progress", "cancelled"],
  customer_counter_offer:     ["awaiting_customer_approval", "customer_agreed", "in_progress", "cancelled"],
  customer_agreed:            ["shipped_to_shop", "received_by_shop", "cancelled"],
  shipped_to_shop:            ["received_by_shop", "in_progress", "cancelled"],
  received_by_shop:           ["diagnosing", "awaiting_customer_approval", "in_progress", "cancelled"],
  // Onarım sırasında ek arıza çıkarsa yeniden teklif
  in_progress:                ["awaiting_customer_approval", "pending_payment", "completed", "cancelled"],
  pending_payment:            ["in_progress", "completed", "cancelled"],
  completed:                  ["in_progress"], // garanti / yeniden açma
  cancelled:                  ["pending"],     // yeniden açma
};

/** Müşterinin kendi tamiri üzerinde yapabileceği geçişler. */
const CUSTOMER_TRANSITIONS: Record<RepairStatus, readonly RepairStatus[]> = {
  pending:                    ["cancelled"],
  diagnosing:                 ["cancelled"],
  awaiting_customer_approval: ["customer_agreed", "in_progress", "customer_counter_offer", "cancelled"],
  customer_counter_offer:     ["cancelled"],
  customer_agreed:            ["shipped_to_shop"],
  shipped_to_shop:            [],
  received_by_shop:           [],
  in_progress:                [],
  pending_payment:            [],
  completed:                  [],
  cancelled:                  [],
};

export function allowedNextStatuses(current: string, actor: RepairActor): readonly RepairStatus[] {
  const from = normalizeRepairStatus(current);
  return (actor === "staff" ? STAFF_TRANSITIONS : CUSTOMER_TRANSITIONS)[from];
}

export function canTransition(current: string, next: string, actor: RepairActor): boolean {
  const to = parseRepairStatus(next);
  return to !== null && allowedNextStatuses(current, actor).includes(to);
}

export class RepairTransitionError extends Error {}

/** Geçersiz geçişte hata fırlatır; geçerliyse kanonik hedef durumu döner. */
export function assertTransition(current: string, next: string, actor: RepairActor): RepairStatus {
  const to = parseRepairStatus(next);
  if (!to) throw new RepairTransitionError(`Geçersiz tamir durumu: ${next}`);
  if (!allowedNextStatuses(current, actor).includes(to)) {
    const fromLabel = repairStatusMeta(current).label;
    throw new RepairTransitionError(`"${fromLabel}" durumundan "${REPAIR_STATUS_META[to].label}" durumuna geçilemez.`);
  }
  return to;
}

/** Personel select kutuları için: mevcut durum + izinli sonraki durumlar. */
export function staffStatusOptions(current: string): RepairStatus[] {
  const from = normalizeRepairStatus(current);
  return REPAIR_STATUSES.filter((s) => s === from || STAFF_TRANSITIONS[from].includes(s));
}

/** Müşteri teklifi kabul ettiğinde gidilecek durum: kargo ise cihaz beklenir, değilse onarım başlar. */
export function acceptedStatusFor(repairType: string): RepairStatus {
  return repairType === "cargo" ? "customer_agreed" : "in_progress";
}

/** Bu durumlara geçerken fiyat teklifinin (estimatedPrice) dolu olması gerekir. */
export const PRICE_REQUIRED_STATUSES: readonly RepairStatus[] = ["awaiting_customer_approval"];

/** Onay sonrası aşamalar: finalPrice boşsa teklif fiyatı kesinleşir. */
export const PRICE_LOCKING_STATUSES: readonly RepairStatus[] = [
  "customer_agreed",
  "in_progress",
  "pending_payment",
  "completed",
];

export function isTerminalRepairStatus(status: string): boolean {
  const s = normalizeRepairStatus(status);
  return s === "completed" || s === "cancelled";
}

/** Durum değişikliğinde sohbete düşülen sistem mesajı. */
export function repairStatusSystemMessage(status: RepairStatus, ctx: { price?: string | null; trackingCode?: string | null } = {}): string | null {
  switch (status) {
    case "awaiting_customer_approval":
      return ctx.price ? `Fiyat teklifi sunuldu: ${ctx.price} ₺. Müşteri onayı bekleniyor.` : null;
    case "customer_counter_offer":
      return ctx.price ? `Müşteri karşı teklif sundu: ${ctx.price} ₺. Yetkili incelemesi bekleniyor.` : null;
    case "customer_agreed":
      return "Müşteri teklifi onayladı. Kargo bekleniyor.";
    case "shipped_to_shop":
      return `Müşteri cihazı kargoya verdi. (Takip: ${ctx.trackingCode || "Belirtilmedi"})`;
    case "received_by_shop":
      return "Cihaz servise ulaştı.";
    case "in_progress":
      return "Onarım başladı.";
    case "pending_payment":
      return "Onarım tamamlandı. Ödeme bekleniyor.";
    case "completed":
      return "Süreç tamamlandı. Cihaz kargolanıyor/teslim ediliyor.";
    case "cancelled":
      return "Tamir talebi iptal edildi.";
    default:
      return null;
  }
}

/** "1.234,50" / "1234.5" gibi girdileri 2 haneli pozitif fiyat string'ine çevirir; geçersizse null. */
export function parsePrice(input: unknown): string | null {
  if (input === null || input === undefined) return null;
  const raw = String(input).trim().replace(/\s/g, "");
  if (!raw) return null;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0 || value > 1_000_000) return null;
  return value.toFixed(2);
}
