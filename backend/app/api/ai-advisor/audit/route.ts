import { NextRequest } from "next/server";
import { generateAIStoreAudit } from "@/actions/ai-advisor";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(_request: NextRequest) {
  try {
    const result = await generateAIStoreAudit();
    if (!result.success) {
      return errorResponse(result.error || "Échec de la génération de l'audit.", 500);
    }
    return jsonResponse(result);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la génération de l'audit.",
      500
    );
  }
}
