import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";

/**
 * Schéma de validation de la charge utile du Webhook Transporteur
 */
const WebhookRequestSchema = z.object({
  trackingNumber: z.string().min(1, "Le numéro de tracking est requis."),
  courierStatus: z.string().min(1, "Le statut du transporteur est requis."),
  timestamp: z.string().optional(),
  attemptsCount: z.number().int().min(0).optional(),
  note: z.string().optional(),
});

/**
 * Mapping des statuts courriers marocains usuels (ex: Ozone, Cathedis, Sendit, Speedaf)
 * vers l'énumération interne OrderStatus.
 */
function mapCourierStatusToInternal(courierStatus: string): OrderStatus | null {
  const normalized = courierStatus.trim().toUpperCase();

  switch (normalized) {
    case "DELIVERED":
    case "LIVRE":
    case "LIVRÉ":
    case "ENCAISSÉ":
    case "PAID":
      return OrderStatus.DELIVERED;

    case "RETURNED":
    case "RETOUR":
    case "RETOURNE":
    case "RETOURNÉ":
    case "REFUSÉ":
    case "REFUSED":
      return OrderStatus.RETURNED;

    case "SHIPPED":
    case "EXPEDIE":
    case "EXPÉDIÉ":
    case "EN_COURS_DE_LIVRAISON":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return OrderStatus.SHIPPED;

    case "NO_ANSWER":
    case "PAS_DE_REPONSE":
    case "CLIENT_INJOIGNABLE":
    case "REPORTÉ":
    case "POSTPONED":
      return OrderStatus.NO_ANSWER;

    case "CANCELLED":
    case "ANNULE":
    case "ANNULÉ":
      return OrderStatus.CANCELLED;

    default:
      return null;
  }
}

/**
 * Vérification de la signature HMAC ou de la clé secrète du Webhook
 */
function verifyWebhookAuthenticity(req: NextRequest, rawBodyText: string): boolean {
  const configuredSecret = process.env.COURIER_WEBHOOK_SECRET;
  if (!configuredSecret) {
    // Si pas de secret défini en environnement de dev, autoriser ou alerter
    return process.env.NODE_ENV === "development";
  }

  // 1. Vérification par en-tête d'API Key directe
  const apiKeyHeader = req.headers.get("x-courier-api-key") || req.headers.get("x-api-key");
  if (apiKeyHeader === configuredSecret) {
    return true;
  }

  // 2. Vérification par signature HMAC SHA-256 (recommandé pour les webhooks externes)
  const signatureHeader = req.headers.get("x-webhook-signature");
  if (signatureHeader) {
    const computedSignature = crypto
      .createHmac("sha256", configuredSecret)
      .update(rawBodyText)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(computedSignature)
    );
  }

  return false;
}

/**
 * POST /api/webhooks/courier
 * Point d'entrée pour la synchronisation asynchrone des colis avec les partenaires logistiques.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBodyText = await request.text();

    // 1. Contrôle d'authentification et intégrité
    const isAuthentic = verifyWebhookAuthenticity(request, rawBodyText);
    if (!isAuthentic) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "Signature ou clé secrète du webhook invalide.",
        },
        { status: 401 }
      );
    }

    // 2. Parsing et validation JSON
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Le corps de la requête doit être un JSON valide." },
        { status: 400 }
      );
    }

    const validationResult = WebhookRequestSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { trackingNumber, courierStatus, note } = validationResult.data;

    // 3. Mapping vers le statut métier interne
    const mappedStatus = mapCourierStatusToInternal(courierStatus);
    if (!mappedStatus) {
      return NextResponse.json(
        {
          error: "UNRECOGNIZED_STATUS",
          message: `Le statut transporteur "${courierStatus}" ne correspond à aucun statut système connu.`,
        },
        { status: 422 }
      );
    }

    // 4. Recherche de la commande par tracking number
    const order = await db.order.findUnique({
      where: { trackingNumber },
      select: { id: true, status: true },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "ORDER_NOT_FOUND",
          message: `Aucune commande associée au numéro de suivi "${trackingNumber}".`,
        },
        { status: 404 }
      );
    }

    // 5. Exécution de la mutation avec gestion du stock dans la transaction ACID
    const updatedOrder = await OrderService.updateOrderStatus({
      orderId: order.id,
      status: mappedStatus,
      trackingNumber,
      note: note ? `[Transporteur] ${courierStatus}: ${note}` : `[Transporteur] Statut mis à jour: ${courierStatus}`,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: updatedOrder.id,
          trackingNumber,
          previousStatus: order.status,
          currentStatus: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Webhook Courier] Internal Exception:", error);
    const message = error instanceof Error ? error.message : "Erreur interne de traitement.";
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message,
      },
      { status: 500 }
    );
  }
}
