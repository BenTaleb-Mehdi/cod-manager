import { NextRequest } from "next/server";
import { OrderService } from "@/services/order.service";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";
import crypto from "crypto";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const ShippingWebhookSchema = z.object({
  trackingNumber: z.string().min(1, "Numéro de tracking requis."),
  courierStatus: z.string().min(1, "Statut du transporteur requis."),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  note: z.string().optional(),
  timestamp: z.string().optional(),
});

function mapCourierStatus(status: string): OrderStatus | null {
  const s = status.trim().toUpperCase();
  if (["DELIVERED", "LIVRE", "LIVRÉ", "ENCAISSÉ", "PAID"].includes(s)) return OrderStatus.DELIVERED;
  if (["RETURNED", "RETOUR", "RETOURNE", "RETOURNÉ", "REFUSÉ"].includes(s)) return OrderStatus.RETURNED;
  if (["SHIPPED", "EXPEDIE", "EXPÉDIÉ", "EN_COURS_DE_LIVRAISON", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s)) return OrderStatus.SHIPPED;
  if (["NO_ANSWER", "PAS_DE_REPONSE", "CLIENT_INJOIGNABLE", "REPORTÉ"].includes(s)) return OrderStatus.NO_ANSWER;
  if (["CANCELLED", "ANNULE", "ANNULÉ"].includes(s)) return OrderStatus.CANCELLED;
  return null;
}

/**
 * POST /api/webhooks/shipping
 * Webhook pour les transporteurs marocains (Cathedis, Ozone, Sendit, Speedaf, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Authentification par clé secrète ou HMAC si configurée
    const secret = process.env.COURIER_WEBHOOK_SECRET;
    const apiKeyHeader = request.headers.get("x-courier-api-key") || request.headers.get("x-api-key");
    const signatureHeader = request.headers.get("x-webhook-signature");

    if (secret && process.env.NODE_ENV === "production") {
      let isAuthorized = apiKeyHeader === secret;
      if (!isAuthorized && signatureHeader) {
        const computed = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
        isAuthorized = crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(computed));
      }
      if (!isAuthorized) {
        return errorResponse("Non autorisé : clé webhook ou signature invalide.", 401);
      }
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return errorResponse("JSON invalide.", 400);
    }

    const validated = ShippingWebhookSchema.parse(parsed);
    const targetStatus = mapCourierStatus(validated.courierStatus);

    if (!targetStatus) {
      return errorResponse(`Statut transporteur inconnu: "${validated.courierStatus}".`, 422);
    }

    const order = await db.order.findUnique({
      where: { trackingNumber: validated.trackingNumber },
      select: { id: true, status: true },
    });

    if (!order) {
      return errorResponse(`Aucune commande avec le tracking "${validated.trackingNumber}".`, 404);
    }

    // Mise à jour ACID du statut
    const updated = await OrderService.updateOrderStatus({
      orderId: order.id,
      status: targetStatus,
      trackingNumber: validated.trackingNumber,
      note: validated.note || `Mise à jour transporteur: ${validated.courierStatus}`,
    });

    // Enregistrer les coordonnées GPS si transmises
    if (validated.latitude !== undefined && validated.longitude !== undefined) {
      await db.order.update({
        where: { id: order.id },
        data: {
          lastLatitude: validated.latitude,
          lastLongitude: validated.longitude,
          lastLocationAt: new Date(),
        },
      });
    }

    // Ajouter un événement de suivi dans l'historique
    await db.orderTrackingEvent.create({
      data: {
        orderId: order.id,
        status: targetStatus,
        note: validated.note || `Événement ${validated.courierStatus}`,
        latitude: validated.latitude,
        longitude: validated.longitude,
      },
    });

    return jsonResponse({
      success: true,
      data: {
        orderId: order.id,
        trackingNumber: validated.trackingNumber,
        previousStatus: order.status,
        newStatus: updated.status,
      },
    });
  } catch (error: unknown) {
    console.error("[POST /api/webhooks/shipping] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur interne du webhook.",
      500
    );
  }
}
