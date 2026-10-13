import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/inventory
 * Récupère tous les produits, leurs catégories, les alertes de stock et métriques d'inventaire
 */
export async function GET(_request: NextRequest) {
  try {
    let [products, categories] = await Promise.all([
      db.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      db.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
    ]);

    // Auto-seed default categories if database has no categories yet
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Cosmétiques & Beauté", slug: "cosmetiques-beaute", description: "Produits de beauté et soins" },
        { name: "Santé & Bien-être", slug: "sante-bien-etre", description: "Compléments et soins de santé" },
        { name: "Maison & Cuisine", slug: "maison-cuisine", description: "Articles de maison et gadgets pratiques" },
        { name: "High-Tech & Accessoires", slug: "high-tech-accessoires", description: "Accessoires électroniques" },
        { name: "Général", slug: "general", description: "Catégorie générale" },
      ];

      for (const cat of defaultCategories) {
        try {
          await db.category.create({ data: cat });
        } catch {}
      }

      categories = await db.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
    }

    const formattedProducts = products.map((p) => {
      const cost = Number(p.costPrice);
      const sale = Number(p.salePrice);
      const margin = sale > 0 ? ((sale - cost) / sale) * 100 : 0;

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        costPrice: cost,
        salePrice: sale,
        stock: p.stock,
        marginPercent: parseFloat(margin.toFixed(1)),
        categoryId: p.categoryId,
        category: p.category,
        imageUrl: p.imageUrl || null,
        supplierId: ((p as Record<string, unknown>).supplierId as string) || null,
        supplierName: null,
        createdAt: p.createdAt.toISOString(),
      };
    });

    const formattedCategories = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      productCount: c._count.products,
      createdAt: c.createdAt.toISOString(),
    }));

    // Stats d'inventaire globales
    const totalStockUnits = formattedProducts.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = formattedProducts.filter((p) => p.stock <= 5).length;
    const totalInventoryCost = formattedProducts.reduce(
      (sum, p) => sum + p.costPrice * p.stock,
      0
    );

    return jsonResponse({
      success: true,
      data: {
        products: formattedProducts,
        categories: formattedCategories,
        summary: {
          totalProducts: formattedProducts.length,
          totalStockUnits,
          lowStockCount,
          totalInventoryCost,
        },
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/inventory] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération de l'inventaire.",
      500
    );
  }
}
