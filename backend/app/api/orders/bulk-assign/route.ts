import { NextRequest } from "next/server";
import { OrderService } from "@/services/order.service";
import { BulkAssignToAgentSchema, BulkAssignToCourierSchema } from "@/lib/validations/order";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * POST /api/orders/bulk-assign
 * Body: { type: "agent" | "courier", targetId: string, orderIds: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, targetId, orderIds } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return errorResponse("Veuillez sélectionner au moins une commande.", 400);
    }

    if (type === "agent") {
      const validated = BulkAssignToAgentSchema.parse({
        agentId: targetId,
        orderIds,
      });
      const result = await OrderService.assignOrdersToAgent(validated);
      return jsonResponse({
        success: true,
        data: { updatedCount: result.count },
      });
    } else if (type === "courier") {
      const validated = BulkAssignToCourierSchema.parse({
        courierId: targetId,
        orderIds,
      });
      const result = await OrderService.assignOrdersToCourier(validated);
      return jsonResponse({
        success: true,
        data: { updatedCount: result.count },
      });
    } else {
      return errorResponse("Type d'assignation invalide. Doit être 'agent' ou 'courier'.", 400);
    }
  } catch (error: unknown) {
    console.error("[POST /api/orders/bulk-assign] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de l'assignation en masse.",
      400
    );
  }
}
