import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { rateLimit, rateLimitGcTick } from "@/lib/rateLimit";

const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const SYSTEM_PROMPT = `Sen "Telefon Mühendisi" platformunun yapay zeka arıza teşhis asistanısın. Türkçe konuşuyorsun.

Görevin:
1. Kullanıcının telefon/elektronik cihaz sorununu analiz et
2. Olası arızaları listele (en fazla 3-4 madde)
3. Her arıza için tahmini fiyat aralığı ver (₺ cinsinden Türkiye fiyatları)
4. Tavsiyende bulun (kargo ile tamir, mağazaya getir veya uzaktan destek)
5. Acil ise uyar

Fiyat referansları (2026 Türkiye):
- Ekran değişimi iPhone: 800-4500₺ (modele göre)
- Ekran değişimi Samsung: 600-3500₺
- Batarya değişimi: 300-800₺  
- Anakart tamiri: 500-3000₺
- Su hasarı tamiri: 300-2000₺
- Yazılım güncelleme/format: 200-500₺
- Şarj soketi: 300-700₺

Yanıtların kısa, net ve dostane olsun. Fazla teknik jargon kullanma.
Sonunda her zaman bir aksiyon öner: tamir başvurusu, kargo ile gönderme veya arama.`;

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build history (exclude last user message, it goes as the prompt)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Anlaşıldı! Kullanıcılara en iyi arıza teşhisi ve fiyat tahmini hizmetini vereceğim. Hazırım!" }] },
        ...history,
      ],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
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
