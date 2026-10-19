import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const UpdateSupplierSchema = z.object({
  name: z.string().min(2, "Le nom du fournisseur est obligatoire (min 2 caractères).").optional(),
  phone: z.string().min(8, "Numéro de téléphone marocain invalide.").optional(),
  city: z.string().min(2, "La ville est requise.").optional(),
  address: z.string().nullable().optional(),
});

/**
 * GET /api/suppliers/[id]
 * Récupère le détail d'un fournisseur avec ses produits liés et l'historique de ses approvisionnements
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            sku: true,
            name: true,
            costPrice: true,
            salePrice: true,
            stock: true,
            imageUrl: true,
          },
        },
        supplyOrders: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, sku: true },
                },
              },
            },
          },
        },
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

    return jsonResponse({
      success: true,
      data: {
        id: supplier.id,
        name: supplier.name,
        phone: supplier.phone,
        city: supplier.city,
        address: supplier.address,
        balanceDue: Number(supplier.balanceDue),
        productsCount: supplier._count.products,
        ordersCount: supplier._count.supplyOrders,
        products: supplier.products.map((p) => ({
          ...p,
          costPrice: Number(p.costPrice),
          salePrice: Number(p.salePrice),
        })),
        supplyOrders: supplier.supplyOrders.map((so) => ({
          id: so.id,
          totalAmount: Number(so.totalAmount),
          status: so.status,
          note: so.note,
          createdAt: so.createdAt.toISOString(),
          items: so.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            quantity: item.quantity,
            unitCost: Number(item.unitCost),
            totalCost: Number(item.unitCost) * item.quantity,
          })),
        })),
        createdAt: supplier.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/suppliers/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération du fournisseur.",
      500
    );
  }
}

/**
 * PUT /api/suppliers/[id]
 * Met à jour les informations d'un fournisseur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validated = UpdateSupplierSchema.parse(body);

    const existingSupplier = await db.supplier.findUnique({
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

    if (!existingSupplier) {
      return errorResponse(`Fournisseur introuvable avec l'ID: ${id}`, 404);
    }

    const updated = await db.supplier.update({
      where: { id },
      data: {
        name: validated.name !== undefined ? validated.name.trim() : undefined,
        phone: validated.phone !== undefined ? validated.phone.trim() : undefined,
        city: validated.city !== undefined ? validated.city.trim() : undefined,
        address: validated.address !== undefined ? validated.address?.trim() || null : undefined,
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
        productsCount: updated._count.products,
        ordersCount: updated._count.supplyOrders,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[PUT /api/suppliers/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la mise à jour du fournisseur.",
      400
    );
  }
}

/**
 * DELETE /api/suppliers/[id]
 * Supprime un fournisseur si aucun produit ou bon de commande n'y est lié
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await db.supplier.findUnique({
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

    if (!existing) {
      return errorResponse(`Fournisseur introuvable avec l'ID: ${id}`, 404);
    }

    const prodCount = existing._count.products;
    const orderCount = existing._count.supplyOrders;

    if (prodCount > 0 || orderCount > 0) {
      return errorResponse(
        `Impossible de supprimer "${existing.name}". Il est lié à ${prodCount} produit(s) et ${orderCount} bon(s) de réception d'approvisionnement.`,
        400
      );
    }

    await db.supplier.delete({
      where: { id },
    });

    return jsonResponse({
      success: true,
      data: {
        id,
        message: `Fournisseur "${existing.name}" supprimé avec succès.`,
      },
    });
  } catch (error: unknown) {
    console.error("[DELETE /api/suppliers/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la suppression du fournisseur.",
      500
    );
  }
}
