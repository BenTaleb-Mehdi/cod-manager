import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const StoreSettingsSchema = z.object({
  storeName: z.string().min(2, "Le nom de la boutique est obligatoire."),
  phone: z.string().min(8, "Téléphone invalide."),
  email: z.string().email("Email invalide.").optional().or(z.literal("")),
  address: z.string().min(5, "L'adresse est requise."),
  ice: z.string().optional(),
  taxNumber: z.string().optional(),
  patente: z.string().optional(),
});

/**
 * GET /api/settings
 * Récupère les paramètres légaux et de la boutique
 */
export async function GET(_request: NextRequest) {
  try {
    let settings = await db.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await db.storeSetting.create({
        data: {
          id: "default",
          storeName: "Atlas Boutique COD",
          phone: "0661000000",
          email: "contact@atlasboutique.ma",
          address: "Bd Al Massira Al Khadra, Casablanca",
          ice: "002891823000045",
          taxNumber: "45129801",
          patente: "34192045",
        },
      });
    }

    return jsonResponse({
      success: true,
      data: settings,
    });
  } catch (error: unknown) {
    console.error("[GET /api/settings] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération des paramètres.",
      500
    );
  }
}

/**
 * PUT /api/settings
 * Met à jour les paramètres de la boutique
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = StoreSettingsSchema.parse(body);

    const updated = await db.storeSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        ...validated,
      },
      update: validated,
    });

    return jsonResponse({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("[PUT /api/settings] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la mise à jour des paramètres.",
      400
    );
  }
}
