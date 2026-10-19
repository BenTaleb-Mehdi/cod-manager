import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const PaySupplierSchema = z.object({
  amount: z
    .coerce
    .number({ invalid_type_error: "Montant invalide." })
    .positive("Le montant du règlement doit être supérieur à 0."),
  note: z.string().optional(),
});

/**
 * POST /api/suppliers/[id]/pay
 * Enregistre un règlement / paiement de dette envers un fournisseur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validated = PaySupplierSchema.parse(body);

    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            supplyOrders: true,
          },
        },
      },
    });

    if (!supplier) {
      return errorResponse(`Fournisseur introuvable avec l'ID: ${id}`, 404);
    }

    const currentBalance = Number(supplier.balanceDue);
    const paymentAmount = new Prisma.Decimal(validated.amount);
    const newBalance = Math.max(0, currentBalance - validated.amount);

    const updated = await db.supplier.update({
      where: { id },
      data: {
        balanceDue: new Prisma.Decimal(newBalance),
      },
      include: {
        _count: {
          select: {
            products: true,
            supplyOrders: true,
          },
        },
      },
    });

    return jsonResponse({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        city: updated.city,
        address: updated.address,
        balanceDue: Number(updated.balanceDue),
        paidAmount: validated.amount,
        productsCount: updated._count.products,
        ordersCount: updated._count.supplyOrders,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[POST /api/suppliers/[id]/pay] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de l'enregistrement du règlement.",
      400
    );
  }
}
