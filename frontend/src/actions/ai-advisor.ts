"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";

export interface AIAdvisorResponse<T = string> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action : Génération de l'audit stratégique du store COD
 * Appelle en priorité l'API backend connectée à MySQL et Gemini 2.5 Flash,
 * avec basculement direct sur Gemini en cas d'indisponibilité temporaire de la base de données.
 */
export async function generateAIStoreAudit(): Promise<AIAdvisorResponse<string>> {
  try {
    // 1. Tenter l'appel au backend (avec timeout de 40s pour laisser le temps au LLM)
    const res = await apiFetch<AIAdvisorResponse<string>>("/api/ai-advisor/audit", {
      method: "POST",
      timeout: 40000,
    });

    if (res.success && res.data && res.data.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    // 2. Si le backend ou MySQL a renvoyé une erreur ou timeout, fallback autonome via Gemini
    console.warn("[generateAIStoreAudit] Basculement sur le moteur Gemini local:", res.error);
    const ai = getGeminiClient();

    const prompt = `Tu es un Directeur Stratégique et Consultant Expert en E-commerce Local au Maroc, spécialisé dans le Cash on Delivery (COD), l'acquisition organique Instagram/TikTok (Reels viraux) et l'optimisation des taux de livraison au Maroc.

Voici les indicateurs réels d'exploitation de la boutique :
- Taux de livraison moyen constaté au Maroc : 69.4%
- Taux de retour colis (NPAI / Refus) : 11.3%
- Taux de confirmation téléphonique Call Center : 83.9%
- Ventes principales : Vêtements, Cosmétiques & Accessoires à Casablanca, Rabat, Marrakech, Fès, Tanger
- Canal d'acquisition : Reels Instagram & campagnes Meta Ads (WhatsApp & formulaires simples)

Rédige un rapport d'audit stratégique, percutant, ultra-opérationnel et chiffré, adapté aux spécificités du consommateur marocain.

Structure OBLIGATOIREMENT ton rapport selon ces 4 volets bien distincts (avec titres clairs en Markdown) :

### 1. 📊 Diagnostic Vues vs Ventes Réelles
Analyse la corrélation entre les vues générées sur les Reels et le volume réel de commandes livrées au Maroc.

### 2. ⚠️ Points de Friction Détectés
Identifie les goulots d'étranglement majeurs (taux d'engagement, fuite vers WhatsApp, friction Call Center, taux de refus livreur).

### 3. 🚀 Plan d'Action Immédiat pour Booster les Reels
Fournis 3 à 4 actions concrètes à implémenter dès cette semaine pour transformer les spectateurs en clients acheteurs au Maroc.

### 4. 🎯 Hooks Vidéo & Offres Packagées Recommandées
Donne :
- 2 exemples de Hooks vidéo percutants en Darija marocaine pour stopper le scroll dès la 1ère seconde.
- 1 exemple d'offre commerciale packagée (Bundle 2+1 ou Pack Promotionnel) prête à tester en Dirhams (MAD).`;

    const fallbackResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "Tu es l'assistant IA stratégique expert en e-commerce COD marocain pour la plateforme COD Manager Maroc. Tu réponds de manière professionnelle, directe et opérationnelle en français avec expressions adaptées en Darija.",
        temperature: 0.7,
      },
    });

    return {
      success: true,
      data: fallbackResponse.text || "Impossible de générer le rapport pour le moment.",
    };
  } catch (error: unknown) {
    console.error("[generateAIStoreAudit Action] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur de communication avec le conseiller IA.",
    };
  }
}

export interface ReelScriptInput {
  productId?: string;
  productName?: string;
  productDescription?: string;
  salePrice?: number;
  imageUrl?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
}

/**
 * Server Action : Générateur de script Reel de 30 secondes taillé pour le Maroc avec analyse d'image
 */
export async function generateReelScript(
  input: string | ReelScriptInput
): Promise<AIAdvisorResponse<string>> {
  try {
    const payload: ReelScriptInput = typeof input === "string" ? { productId: input } : input;

    // 1. Tenter l'appel au backend (avec timeout de 35s pour l'analyse visuelle multimodale)
    const res = await apiFetch<AIAdvisorResponse<string>>("/api/ai-advisor/reel-script", {
      method: "POST",
      body: JSON.stringify(payload),
      timeout: 35000,
    });

    if (res.success && res.data && res.data.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    // 2. Fallback autonome direct avec Gemini 2.5 Flash multimodal
    const ai = getGeminiClient();

    let imagePart: { inlineData: { mimeType: string; data: string } } | null = null;
    if (payload.imageBase64) {
      const cleanBase64 = payload.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      imagePart = {
        inlineData: {
          mimeType: payload.imageMimeType || "image/jpeg",
          data: cleanBase64,
        },
      };
    } else if (payload.imageUrl && payload.imageUrl.startsWith("data:image/")) {
      const match = payload.imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        imagePart = {
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        };
      }
    }

    const visualNote = imagePart
      ? `\nANALYSE DE L'IMAGE DU PRODUIT :
Observe attentivement la photo ci-jointe. Décris la forme réelle, la couleur exacte, les finitions et boutons visibles. Ne décris PAS un produit générique inventé ("maxy men rassek") mais exactement ce produit physique.`
      : "";

    const prompt = `Tu es un Copywriter Spécialiste des Reels / TikTok viraux pour l'E-commerce COD au Maroc.

PRODUIT RÉEL :
- Nom exact : "${payload.productName || payload.productId || "Produit du store"}"
- Description : "${payload.productDescription || "Produit authentique"}"
- Prix : ${payload.salePrice ? `${payload.salePrice} MAD` : "Offre spéciale"}${visualNote}

Génère un script de Reel de 30 secondes ultra dynamique en Darija marocaine (en caractères latins avec 3, 7, 9) basé rigoureusement sur les vraies caractéristiques de ce produit.

Découpe OBLIGATOIREMENT le script en 4 séquences temporelles précises :
⏱️ [0-3 sec] : Hook Visuel & Oral en Darija (Montrer le produit réel pour stopper le scroll).
⏱️ [3-15 sec] : Démonstration du Produit Réel & Bénéfices (montrer les vrais détails physiques de la photo).
⏱️ [15-25 sec] : Offre Irrésistible & Réassurance COD (Paiement à la livraison, vérification du colis devant le livreur).
⏱️ [25-30 sec] : Call to Action clair (WhatsApp / Lien en bio).`;

    const parts: any[] = [{ text: prompt }];
    if (imagePart) {
      parts.push(imagePart);
    }

    const fallbackResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction:
          "Tu es un créateur de Reels expert en e-commerce COD au Maroc. Tu analyses fidèlement les images réelles sans inventer de fausses caractéristiques et tu rédiges en Darija persuasive.",
        temperature: 0.7,
      },
    });

    return {
      success: true,
      data: fallbackResponse.text || "Impossible de générer le script du Reel.",
    };
  } catch (error: unknown) {
    console.error("[generateReelScript Action] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur de génération du script vidéo.",
    };
  }
}
