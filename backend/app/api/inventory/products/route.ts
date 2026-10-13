import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { CreateProductSchema } from "@/lib/validations/product";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import fs from "fs";
import path from "path";
import { ZodError } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * POST /api/inventory/products
 * Ajout d'un produit avec validation, traitement d'image et vérification d'intégrité relationnelle
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateProductSchema.parse(body);

    // 1. Vérification unicité du SKU
    const existingSku = await db.product.findUnique({
      where: { sku: validated.sku },
    });

    if (existingSku) {
      return errorResponse(`Le SKU "${validated.sku}" est déjà utilisé par un autre produit.`, 409);
    }

    // 2. Vérification et fallback pour la catégorie
    let targetCategoryId = validated.categoryId;
    let category = await db.category.findUnique({
      where: { id: targetCategoryId },
    });

    if (!category) {
      // Si la catégorie spécifiée n'existe pas en base, récupérer la première ou créer une catégorie par défaut
      let defaultCat = await db.category.findFirst({
        orderBy: { name: "asc" },
      });

      if (!defaultCat) {
        defaultCat = await db.category.create({
          data: {
            name: "Général",
            slug: "general",
            description: "Catégorie par défaut",
          },
        });
      }
      targetCategoryId = defaultCat.id;
    }

    // 3. Traitement de l'image (Support Base64 Drag & Drop et URLs externes)
    let finalImageUrl: string | null = null;
    if (validated.imageUrl && typeof validated.imageUrl === "string" && validated.imageUrl.trim() !== "") {
      const rawImg = validated.imageUrl.trim();
      if (rawImg.startsWith("data:image/")) {
        try {
          const matches = rawImg.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (matches) {
            let ext = matches[1].toLowerCase();
            if (ext === "jpeg") ext = "jpg";
            if (ext.includes("svg")) ext = "svg";
            const base64Data = matches[2];
            const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

            // 1) Sauvegarde dans backend/public/uploads/products
            const backendUploads = path.join(process.cwd(), "public", "uploads", "products");
            if (!fs.existsSync(backendUploads)) {
              fs.mkdirSync(backendUploads, { recursive: true });
            }
            fs.writeFileSync(path.join(backendUploads, fileName), Buffer.from(base64Data, "base64"));

            // 2) Sauvegarde miroir dans frontend/public/uploads/products pour service statique direct
            try {
              const frontendUploads = path.resolve(process.cwd(), "..", "frontend", "public", "uploads", "products");
              if (!fs.existsSync(frontendUploads)) {
                fs.mkdirSync(frontendUploads, { recursive: true });
              }
              fs.writeFileSync(path.join(frontendUploads, fileName), Buffer.from(base64Data, "base64"));
            } catch {
              // Ignore frontend write if directory isn't accessible
            }

            finalImageUrl = `/uploads/products/${fileName}`;
          }
        } catch (imgErr) {
          console.warn("[POST /api/inventory/products] Erreur enregistrement image base64:", imgErr);
          finalImageUrl = null;
        }
      } else {
        // URL classique : tronquer à 500 max pour respecter la colonne VARCHAR(500) MySQL
        finalImageUrl = rawImg.length > 500 ? rawImg.substring(0, 500) : rawImg;
      }
    }

    // 4. Enregistrement en base de données MySQL
    const createdProduct = await db.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        description: validated.description || null,
        costPrice: validated.costPrice,
        salePrice: validated.salePrice,
        stock: validated.stock,
        imageUrl: finalImageUrl,
        categoryId: targetCategoryId,
        supplierId: validated.supplierId ?? null,
      },
      include: {
        category: true,
      },
    });

    const cost = Number(createdProduct.costPrice);
    const sale = Number(createdProduct.salePrice);
    const margin = sale > 0 ? ((sale - cost) / sale) * 100 : 0;

    return jsonResponse(
      {
        success: true,
        data: {
          id: createdProduct.id,
          sku: createdProduct.sku,
          name: createdProduct.name,
          description: createdProduct.description,
          costPrice: cost,
          salePrice: sale,
          stock: createdProduct.stock,
          marginPercent: parseFloat(margin.toFixed(1)),
          imageUrl: createdProduct.imageUrl,
          categoryId: createdProduct.categoryId,
          category: createdProduct.category,
          createdAt: createdProduct.createdAt.toISOString(),
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("[POST /api/inventory/products] Error:", error);

    if (error instanceof ZodError) {
      const message = error.errors.map((e) => e.message).join(", ");
      return errorResponse(message, 400);
    }

    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la création du produit.",
      400
    );
  }
}
