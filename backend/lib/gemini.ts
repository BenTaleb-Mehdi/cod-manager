import { GoogleGenAI } from "@google/genai";

let geminiClientInstance: GoogleGenAI | null = null;

/**
 * Initialisation centralisée du client officiel Google Gen AI SDK
 * Utilise la variable d'environnement GEMINI_API_KEY
 */
export function getGeminiClient(): GoogleGenAI {
  if (geminiClientInstance) {
    return geminiClientInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "La variable d'environnement GEMINI_API_KEY n'est pas configurée. Veuillez ajouter GEMINI_API_KEY dans votre fichier .env."
    );
  }

  geminiClientInstance = new GoogleGenAI({ apiKey });
  return geminiClientInstance;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
