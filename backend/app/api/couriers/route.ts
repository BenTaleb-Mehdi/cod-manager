import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const CreateCourierSchema = z.object({
  name: z.string().min(2, "Le nom de la société de livraison est requis."),
  phone: z.string().min(8, "Numéro de téléphone invalide."),
  apiEndpoint: z.string().url("URL de l'API invalide.").optional().or(z.literal("")),
  apiKey: z.string().optional(),
  webhookSecret: z.string().optional(),
  ipWhitelist: z.string().optional(),
});

/**
 * GET /api/couriers
 * Récupère la liste des sociétés de livraison partenaires avec les statistiques de commandes
 */
export async function GET(_request: NextRequest) {
  try {
    const couriers = await db.courier.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    const formatted = couriers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      apiEndpoint: c.apiEndpoint,
      apiKey: c.apiKey ? `${c.apiKey.slice(0, 4)}...${c.apiKey.slice(-4)}` : null,
      webhookSecret: c.webhookSecret ? "Configuré" : null,
      ipWhitelist: c.ipWhitelist,
      ordersCount: c._count.orders,
      createdAt: c.createdAt.toISOString(),
    }));

    return jsonResponse({
      success: true,
      data: formatted,
    });
  } catch (error: unknown) {
    console.error("[GET /api/couriers] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération des transporteurs.",
      500
    );
  }
}

/**
 * POST /api/couriers
 * Ajout d'une nouvelle société de livraison avec identifiants API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateCourierSchema.parse(body);

    const courier = await db.courier.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        apiEndpoint: validated.apiEndpoint || null,
        apiKey: validated.apiKey || null,
        webhookSecret: validated.webhookSecret || null,
        ipWhitelist: validated.ipWhitelist || null,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: {
          id: courier.id,
          name: courier.name,
          phone: courier.phone,
          apiEndpoint: courier.apiEndpoint,
          ordersCount: 0,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/couriers] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de l'ajout du transporteur.",
      400
    );
  }
}
