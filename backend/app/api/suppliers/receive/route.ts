import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const ReceiveStockSchema = z.object({
  supplierId: z.string().min(1, "Fournisseur requis."),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Produit requis."),
        quantity: z.number().int().positive("La quantité doit être supérieure à zéro."),
        unitCost: z.number().positive("Le coût unitaire doit être positif."),
      })
    )
    .min(1, "Au moins un article doit être réceptionné."),
});

/**
 * POST /api/suppliers/receive
 * Enregistre un bon de réception fournisseur et incrémente les stocks physiques de manière atomique (ACID)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ReceiveStockSchema.parse(body);

    const result = await db.$transaction(
      async (tx) => {
        // 1. Calcul du montant total
        let totalAmount = new Prisma.Decimal(0);
        for (const item of validated.items) {
          const itemTotal = new Prisma.Decimal(item.unitCost).mul(item.quantity);
          totalAmount = totalAmount.add(itemTotal);
        }

        // 2. Création du bon d'approvisionnement
        const supplyOrder = await tx.supplyOrder.create({
          data: {
            supplierId: validated.supplierId,
            totalAmount,
            status: "RECEIVED",
            note: validated.note,
            items: {
              create: validated.items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                unitCost: new Prisma.Decimal(i.unitCost),
              })),
            },
          },
          include: { items: true },
        });

        // 3. Incrémentation atomique du stock de chaque produit
        for (const item of validated.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              costPrice: new Prisma.Decimal(item.unitCost), // mise à jour du dernier coût d'achat
            },
          });
        }

        // 4. Mise à jour de la dette fournisseur (balanceDue)
        await tx.supplier.update({
          where: { id: validated.supplierId },
          data: {
            balanceDue: { increment: totalAmount },
          },
        });

        return supplyOrder;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 10000,
      }
    );

    return jsonResponse(
      {
        success: true,
        data: {
          supplyOrderId: result.id,
          totalAmount: Number(result.totalAmount),
          itemsCount: result.items.length,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/suppliers/receive] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la réception des stocks.",
      400
    );
  }
}
