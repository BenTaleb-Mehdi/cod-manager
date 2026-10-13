import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { OrderService } from "@/services/order.service";
import { CreateOrderSchema } from "@/lib/validations/order";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { OrderStatus, Prisma } from "@prisma/client";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/orders
 * Filtre les commandes par statut, ville, recherche client, pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (statusParam && Object.values(OrderStatus).includes(statusParam as OrderStatus)) {
      where.status = statusParam as OrderStatus;
    }

    if (city && city !== "all") {
      where.city = city;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { phone: { contains: search } },
        { trackingNumber: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const [total, orders] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          invoice: {
            select: { id: true, invoiceNumber: true, status: true, total: true },
          },
        },
      }),
    ]);

    // Format clean pour le frontend
    const formattedOrders = orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      phone: o.phone,
      city: o.city,
      address: o.address,
      shippingNote: o.shippingNote,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      attemptsCount: o.attemptsCount,
      trackingNumber: o.trackingNumber,
      courierId: o.courierId,
      courier: o.courier,
      assignedToId: o.assignedToId,
      assignedTo: o.assignedTo,
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.product.name,
        productSku: i.product.sku,
        quantity: i.quantity,
        price: Number(i.price),
      })),
      invoice: o.invoice
        ? {
            id: o.invoice.id,
            invoiceNumber: o.invoice.invoiceNumber,
            status: o.invoice.status,
            total: Number(o.invoice.total),
          }
        : null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));

    return jsonResponse({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/orders] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération des commandes.",
      500
    );
  }
}

/**
 * POST /api/orders
 * Création d'une commande avec vérification et décrémentation atomique des stocks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateOrderSchema.parse(body);

    const createdOrder = await OrderService.createOrderWithItems(validatedData);

    return jsonResponse(
      {
        success: true,
        data: {
          orderId: createdOrder.id,
          totalAmount: Number(createdOrder.totalAmount),
          customerName: createdOrder.customerName,
          status: createdOrder.status,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/orders] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la création de la commande.",
      400
    );
  }
}
