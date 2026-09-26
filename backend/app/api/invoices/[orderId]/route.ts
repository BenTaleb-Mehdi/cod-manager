import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/invoices/[orderId]
 * Récupère ou génère la facture imprimable A4/ticket thermique conforme aux règles marocaines
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Récupérer la commande avec ses items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        invoice: true,
      },
    });

    if (!order) {
      return errorResponse(`Commande introuvable avec l'ID: ${orderId}`, 404);
    }

    // Récupérer les paramètres légaux de la boutique (ICE, IF, Patente)
    let store = await db.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!store) {
      store = await db.storeSetting.create({
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

    // Si aucune facture n'existe pour cette commande, la créer automatiquement
    let invoice = order.invoice;
    if (!invoice) {
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${order.id.slice(0, 8).toUpperCase()}`;
      invoice = await db.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,
          subtotal: order.totalAmount,
          shippingCost: new Prisma.Decimal(0.0),
          total: order.totalAmount,
          status: order.status === "DELIVERED" ? "PAID" : "PENDING",
        },
      });
    }

    return jsonResponse({
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          subtotal: Number(invoice.subtotal),
          shippingCost: Number(invoice.shippingCost),
          total: Number(invoice.total),
          status: invoice.status,
          createdAt: invoice.createdAt.toISOString(),
        },
        order: {
          id: order.id,
          customerName: order.customerName,
          phone: order.phone,
          city: order.city,
          address: order.address,
          trackingNumber: order.trackingNumber,
          status: order.status,
          items: order.items.map((i) => ({
            id: i.id,
            sku: i.product.sku,
            name: i.product.name,
            quantity: i.quantity,
            price: Number(i.price),
            total: Number(i.price) * i.quantity,
          })),
        },
        store: {
          storeName: store.storeName,
          phone: store.phone,
          email: store.email,
          address: store.address,
          ice: store.ice,
          taxNumber: store.taxNumber,
          patente: store.patente,
        },
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/invoices/[orderId]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération de la facture.",
      500
    );
  }
}
