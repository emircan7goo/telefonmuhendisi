import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { rateLimit, rateLimitGcTick } from "@/lib/rateLimit";
import { BRAND_PRICE_RANGES_TEXT, mentionedModelPrices } from "@/lib/ai/repair-price-guide";
import { DEFAULT_SHOP_PHONE, SHOP_ADDRESS, formatTrPhone } from "@/lib/contact";
import { getShopSettings } from "@/lib/settings";

const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// Model adı ortamdan değiştirilebilir; varsayılan Google'ın güncel Flash takma adı.
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";

function buildSystemPrompt(shopPhone: string, modelPrices: string | null) {
  return `Sen "Telefon Mühendisi" (Karamürsel / Kocaeli) telefon tamir dükkanının yapay zeka arıza teşhis asistanısın. Türkçe konuşuyorsun.

Görevin:
1. Kullanıcının telefon/elektronik cihaz sorununu analiz et
2. Olası arızaları listele (en fazla 3-4 madde)
3. Fiyat sorulursa SADECE aşağıdaki liste fiyatlarını kullan (bunlar sitedeki tamir sihirbazıyla aynıdır)
4. Tavsiyede bulun: dükkana getirme, kargo ile gönderme veya (yazılımsal sorunlarda) uzaktan destek
5. Acil ise uyar (sıvı teması, şişmiş batarya vb.)

FİYAT KURALLARI (çok önemli):
- Aşağıdaki listede olmayan bir fiyat UYDURMA, liste dışı indirim veya kampanya vaat etme.
- Model aşağıda "kesin liste fiyatı" olarak geçiyorsa o fiyatı söyle.
- Model belli değilse marka aralığını ver ve modeli sor.
- Listede olmayan marka/model için fiyat verme; tamir talebi oluşturmasını veya WhatsApp'tan yazmasını öner.
- Liste fiyatları ön tekliftir; kesin fiyat cihaz incelendikten sonra netleşir, bunu belirt.
${modelPrices ? `
Kullanıcının bahsettiği modellerin kesin liste fiyatları:
${modelPrices}
` : ""}
Marka bazlı liste fiyat aralıkları (en ucuz–en pahalı model):
${BRAND_PRICE_RANGES_TEXT}

Dükkan bilgileri: ${SHOP_ADDRESS}. Telefon/WhatsApp: ${formatTrPhone(shopPhone)}.
Tamir talebi sitedeki "Onarım Merkezi" (/tamir) sayfasından oluşturulur.

Yanıtların kısa, net ve dostane olsun. Fazla teknik jargon kullanma.
Sonunda her zaman bir aksiyon öner: tamir talebi oluşturma, dükkana gelme, WhatsApp'tan yazma veya arama.`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "AI asistanı kullanmak için lütfen giriş yapın." },
        { status: 401 },
      );
    }

    // Not: in-memory limit izolasyon başına çalışır; Faz 3'te paylaşımlı store'a taşınacak.
    rateLimitGcTick();
    const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userLimit = rateLimit(`ai:user:${userId}`, { capacity: 10, refillPerSec: 1 / 30 });
    const ipLimit = rateLimit(`ai:ip:${ip}`, { capacity: 30, refillPerSec: 1 / 10 });
    if (!userLimit.ok || !ipLimit.ok) {
      const resetInMs = Math.max(userLimit.resetInMs, ipLimit.resetInMs);
      return NextResponse.json(
        { error: "Çok fazla mesaj gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(resetInMs / 1000)) } },
      );
    }

    const body = await req.json().catch(() => null) as {
      messages?: { role: string; content: string }[];
    } | null;
    const rawMessages = body?.messages;

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const isValid = rawMessages.every(
      (m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"),
    );
    if (!isValid) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    if (rawMessages.some((m) => m.content.length > MAX_MESSAGE_CHARS)) {
      return NextResponse.json(
        { error: `Mesajınız en fazla ${MAX_MESSAGE_CHARS} karakter olabilir.` },
        { status: 413 },
      );
    }

    // Sadece son mesajları gönder; geçmiş kullanıcı mesajıyla başlasın.
    let messages = rawMessages.slice(-MAX_HISTORY_MESSAGES);
    const firstUserIdx = messages.findIndex((m) => m.role === "user");
    messages = firstUserIdx === -1 ? [] : messages.slice(firstUserIdx);

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // Fiyat listesi: son kullanıcı mesajlarında geçen modeller varsa kesin fiyatları eklenir.
    const recentUserText = messages.filter((m) => m.role === "user").slice(-3).map((m) => m.content).join("\n");
    const settings = await getShopSettings();
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: buildSystemPrompt(settings.contactPhone || DEFAULT_SHOP_PHONE, mentionedModelPrices(recentUserText)),
    });

    // Build history (exclude last user message, it goes as the prompt)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.4,
      },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const content = result.response.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI servisi şu an kullanılamıyor." },
      { status: 500 }
    );
  }
}
