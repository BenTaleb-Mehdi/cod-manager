import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/orders/[id]
 * Récupère le détail complet d'une commande (tracking, items, facture, historique)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        courier: {
          select: { id: true, name: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, salePrice: true, costPrice: true },
            },
          },
        },
        invoice: true,
        trackingEvents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return errorResponse(`Commande introuvable avec l'ID: ${id}`, 404);
    }

    const formattedOrder = {
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      shippingNote: order.shippingNote,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      attemptsCount: order.attemptsCount,
      trackingNumber: order.trackingNumber,
      courierId: order.courierId,
      courier: order.courier,
      assignedToId: order.assignedToId,
      assignedTo: order.assignedTo,
      lastLatitude: order.lastLatitude,
      lastLongitude: order.lastLongitude,
      lastLocationAt: order.lastLocationAt?.toISOString() || null,
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.product.name,
        productSku: i.product.sku,
        quantity: i.quantity,
        price: Number(i.price),
        total: Number(i.price) * i.quantity,
      })),
      invoice: order.invoice
        ? {
            id: order.invoice.id,
            invoiceNumber: order.invoice.invoiceNumber,
            status: order.invoice.status,
            subtotal: Number(order.invoice.subtotal),
            shippingCost: Number(order.invoice.shippingCost),
            total: Number(order.invoice.total),
            createdAt: order.invoice.createdAt.toISOString(),
          }
        : null,
      trackingEvents: order.trackingEvents.map((t) => ({
        id: t.id,
        status: t.status,
        note: t.note,
        latitude: t.latitude,
        longitude: t.longitude,
        createdAt: t.createdAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return jsonResponse({
      success: true,
      data: formattedOrder,
    });
  } catch (error: unknown) {
    console.error("[GET /api/orders/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération de la commande.",
      500
    );
  }
}
