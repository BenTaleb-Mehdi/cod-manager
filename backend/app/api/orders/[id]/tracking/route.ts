import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { OrderService } from "@/services/order.service";
import { OrderStatus } from "@prisma/client";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const AddTrackingEventSchema = z.object({
  trackingNumber: z.string().optional(),
  courierId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  note: z.string().min(1, "La note ou description d'étape est requise."),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * POST /api/orders/[id]/tracking
 * Ajoute un événement de suivi / tracking, met à jour la position GPS et le transporteur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validated = AddTrackingEventSchema.parse(body);

    const order = await db.order.findUnique({
      where: { id },
      include: { trackingEvents: true },
    });

    if (!order) {
      return errorResponse(`Commande introuvable avec l'ID: ${id}`, 404);
    }

    const currentStatus = validated.status || order.status;

    // 1. Si le statut change, passer par OrderService pour gestion ACID des stocks
    if (validated.status && validated.status !== order.status) {
      await OrderService.updateOrderStatus({
        orderId: order.id,
        status: validated.status,
        trackingNumber: validated.trackingNumber || order.trackingNumber || undefined,
        note: validated.note,
      });
    }

    // 2. Mettre à jour les informations de transporteur, tracking et GPS
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        trackingNumber: validated.trackingNumber || order.trackingNumber,
        courierId: validated.courierId || order.courierId,
        ...(validated.latitude !== undefined && validated.longitude !== undefined
          ? {
              lastLatitude: validated.latitude,
              lastLongitude: validated.longitude,
              lastLocationAt: new Date(),
            }
          : {}),
      },
    });

    // 3. Créer l'événement de suivi dans l'historique
    const event = await db.orderTrackingEvent.create({
      data: {
        orderId: order.id,
        status: currentStatus,
        note: validated.note,
        latitude: validated.latitude ?? order.lastLatitude,
        longitude: validated.longitude ?? order.lastLongitude,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: {
          eventId: event.id,
          orderId: updatedOrder.id,
          status: updatedOrder.status,
          trackingNumber: updatedOrder.trackingNumber,
          lastLatitude: updatedOrder.lastLatitude,
          lastLongitude: updatedOrder.lastLongitude,
          createdAt: event.createdAt.toISOString(),
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/orders/[id]/tracking] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de l'ajout de l'étape de tracking.",
      400
    );
  }
}
