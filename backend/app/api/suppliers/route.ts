import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const CreateSupplierSchema = z.object({
  name: z.string().min(2, "Le nom du fournisseur est obligatoire (min 2 caractères)."),
  phone: z.string().min(8, "Numéro de téléphone marocain invalide."),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().optional(),
});

/**
 * GET /api/suppliers
 * Récupère la liste des fournisseurs avec le solde dû et le nombre de produits liés
 */
export async function GET(_request: NextRequest) {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            products: true,
            supplyOrders: true,
          },
        },
      },
    });

    const formattedSuppliers = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      city: s.city,
      address: s.address,
      balanceDue: Number(s.balanceDue),
      productsCount: s._count.products,
      ordersCount: s._count.supplyOrders,
      createdAt: s.createdAt.toISOString(),
    }));

    return jsonResponse({
      success: true,
      data: formattedSuppliers,
    });
  } catch (error: unknown) {
    console.error("[GET /api/suppliers] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération des fournisseurs.",
      500
    );
  }
}

/**
 * POST /api/suppliers
 * Enregistrement d'un nouveau fournisseur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateSupplierSchema.parse(body);

    const supplier = await db.supplier.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        city: validated.city,
        address: validated.address,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: {
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          city: supplier.city,
          address: supplier.address,
          balanceDue: Number(supplier.balanceDue),
          productsCount: 0,
          ordersCount: 0,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/suppliers] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la création du fournisseur.",
      400
    );
  }
}
