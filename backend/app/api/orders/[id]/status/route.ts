import { NextRequest } from "next/server";
import { OrderService } from "@/services/order.service";
import { UpdateOrderStatusSchema } from "@/lib/validations/order";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * PATCH /api/orders/[id]/status
 * Met à jour le statut avec gestion ACID des stocks (réincrémentation si ANNULÉ/RETOURNÉ)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const validatedData = UpdateOrderStatusSchema.parse({
      orderId: id,
      status: body.status,
      trackingNumber: body.trackingNumber,
      note: body.note,
    });

    const updatedOrder = await OrderService.updateOrderStatus(validatedData);

    return jsonResponse({
      success: true,
      data: {
        orderId: updatedOrder.id,
        newStatus: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        attemptsCount: updatedOrder.attemptsCount,
        updatedAt: updatedOrder.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[PATCH /api/orders/[id]/status] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la mise à jour du statut.",
      400
    );
  }
}
