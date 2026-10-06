import { NextRequest } from "next/server";
import { generateReelScript } from "@/actions/ai-advisor";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, productDescription, salePrice, imageUrl, imageBase64, imageMimeType } = body;

    if (!productId && !productName && !imageBase64 && !imageUrl) {
      return errorResponse("Un identifiant de produit (productId), un nom ou une image est requis.", 400);
    }

    const result = await generateReelScript({
      productId,
      productName,
      productDescription,
      salePrice: salePrice ? Number(salePrice) : undefined,
      imageUrl,
      imageBase64,
      imageMimeType,
    });

    if (!result.success) {
      return errorResponse(result.error || "Échec de la création du script Reel.", 500);
    }
    return jsonResponse(result);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la création du script Reel.",
      500
    );
  }
}
