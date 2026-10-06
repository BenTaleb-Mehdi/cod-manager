import { NextRequest } from "next/server";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";
import { getStoreContextFromDatabase } from "@/actions/ai-advisor";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

/**
 * POST /api/ai-chat
 * Chatbot conversationnel contextuel propulsé par Gemini 2.5 Flash
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessageInput[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return errorResponse("La liste des messages est requise et ne peut être vide.", 400);
    }

    // 1. Récupération du contexte temps réel du store
    let contextSummary = "";
    try {
      const context = await getStoreContextFromDatabase();
      const topReels = context.topPosts
        .slice(0, 3)
        .map((p) => `"${p.caption.slice(0, 40)}..." (${p.viewsCount.toLocaleString()} vues)`)
        .join("; ");

      contextSummary = `
DONNÉES EN TEMPS RÉEL DU STORE :
- Total des commandes : ${context.totalOrders}
- Commandes livrées (DELIVERED) : ${context.deliveredOrders} (Taux: ${context.deliveryRate}%)
- Retours colis (RETURNED) : ${context.returnedOrders} (Taux: ${context.returnRate}%)
- Taux de confirmation estimé : ${context.confirmationRate}%
- Portée Instagram : ${context.accountStats?.reach || "N/A"} | Abonnés : ${context.accountStats?.followersCount || "N/A"}
- Meilleurs Reels : ${topReels || "Aucun post pour le moment"}
`;
    } catch (e) {
      console.warn("[POST /api/ai-chat] Warning loading context:", e);
    }

    // 2. Construction de la consigne système (systemInstruction)
    const systemInstruction = `Tu es l'Assistant Stratégique IA de "COD Manager Maroc", le copilote expert des e-commerçants et managers de Call Center au Maroc.

${contextSummary}

TES DIRECTIVES PRINCIPALES :
1. Tu maîtrises parfaitement les spécificités du Cash on Delivery (COD) marocain :
   - Call Center : confirmation rapide des commandes sous 15-30 minutes, qualification d'adresses imprécises ("9ddam l jamâa", "9rib l rond-point"), gestion des reports.
   - Logistique : négociation transporteurs (Amana, Cathedis, Ozon, etc.), gestion des retours et NPAI.
   - Acquisition Meta & TikTok : formats Reels courts (7 à 15s), scripts en Darija, hooks visuels forts, offres irrésistibles (Bundle 2+1, Livraison Gratuite).
2. Langue : Tu réponds naturellement en Français fluide ou en Darija marocaine (caractères latins "3, 7, 9" ou arabes) selon la langue utilisée par l'utilisateur.
3. Style : Direct, ultra-opérationnel, chiffres à l'appui, bienveillant et orienté résultat net (MAD).`;

    // 3. Mapping vers la syntaxe attendue par le SDK @google/genai (role: 'user' | 'model')
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // 4. Appel au client Gemini
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Désolé, je n'ai pas pu formuler de réponse pour le moment.";

    return jsonResponse({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    console.error("[POST /api/ai-chat] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur interne du serveur de chat IA.",
      500
    );
  }
}
