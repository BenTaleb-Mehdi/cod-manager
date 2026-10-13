import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";

interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessageInput[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "La liste des messages ne peut être vide." },
        { status: 400 }
      );
    }

    // Tentative d'appel au backend principal (timeout de 8s pour basculer rapidement si MySQL/backend est lent)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Si le backend sur le port 3001 n'est pas joignable, fallback direct sur Gemini
    }

    // Fallback direct avec client Gemini si clé API disponible
    const ai = getGeminiClient();
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction:
          "Tu es l'assistant IA stratégique expert de COD Manager Maroc. Tu aides les gérants de boutiques e-commerce marocaines (Cash on Delivery) à optimiser leurs Reels, leurs ventes, leurs confirmations d'appels et à réduire leurs retours colis. Tu t'exprimes en français avec des touches naturelles de Darija marocaine.",
        temperature: 0.7,
      },
    });

    return NextResponse.json({
      success: true,
      reply: response.text || "Réponse indisponible.",
    });
  } catch (error: unknown) {
    console.error("[Frontend POST /api/ai-chat] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur de communication avec l'assistant IA.",
      },
      { status: 500 }
    );
  }
}
