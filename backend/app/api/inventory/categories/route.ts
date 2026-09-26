import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { CreateCategorySchema } from "@/lib/validations/category";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * POST /api/inventory/categories
 * Création d'une catégorie de produits
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateCategorySchema.parse(body);

    const slug =
      validated.slug ||
      validated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return errorResponse(`Une catégorie avec le slug "${slug}" existe déjà.`, 409);
    }

    const createdCategory = await db.category.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: {
          id: createdCategory.id,
          name: createdCategory.name,
          slug: createdCategory.slug,
          description: createdCategory.description,
          productCount: 0,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/inventory/categories] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la création de la catégorie.",
      400
    );
  }
}
