import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const { messages } = await req.json() as {
      messages: { role: string; content: string }[];
    };

    if (!messages || !Array.isArray(messages)) {
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
