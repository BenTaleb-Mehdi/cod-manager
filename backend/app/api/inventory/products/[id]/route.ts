import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import fs from "fs";
import path from "path";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/inventory/products/[id]
 * Récupère le détail d'un produit
 */
function parseProductMeta(rawDescription: string | null | undefined) {
  let text = rawDescription || "";
  let isActive = true;
  let lowStockThreshold = 5;

  if (rawDescription && rawDescription.trim().startsWith("{") && rawDescription.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(rawDescription);
      if (typeof parsed === "object" && parsed !== null) {
        text = parsed.text ?? "";
        if (typeof parsed.isActive === "boolean") isActive = parsed.isActive;
        if (typeof parsed.lowStockThreshold === "number" && !isNaN(parsed.lowStockThreshold)) {
          lowStockThreshold = parsed.lowStockThreshold;
        }
      }
    } catch {}
  }

  return { text, isActive, lowStockThreshold };
}

/**
 * GET /api/inventory/products/[id]
 * Récupère le détail d'un produit avec statistiques de vente et historique
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        orderItems: {
          take: 10,
          include: {
            order: {
              select: {
                id: true,
                customerName: true,
                city: true,
                trackingNumber: true,
                totalAmount: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
            supplyOrderItems: true,
          },
        },
      },
    });

    if (!product) {
      return errorResponse(`Produit introuvable avec l'ID: ${id}`, 404);
    }

    const meta = parseProductMeta(product.description);
    const totalUnitsSold = product.orderItems.reduce((acc, item) => acc + item.quantity, 0);

    return jsonResponse({
      success: true,
      data: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: meta.text,
        isActive: meta.isActive,
        lowStockThreshold: meta.lowStockThreshold,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        category: product.category,
        supplierId: product.supplierId,
        supplier: product.supplier,
        ordersCount: product._count.orderItems,
        supplyOrdersCount: product._count.supplyOrderItems,
        totalUnitsSold,
        recentOrders: product.orderItems.map((item) => ({
          id: item.order.id,
          trackingNumber: item.order.trackingNumber || `#${item.order.id.slice(0, 8)}`,
          customerName: item.order.customerName,
          city: item.order.city,
          totalAmount: Number(item.order.totalAmount),
          status: item.order.status,
          quantity: item.quantity,
          price: Number(item.price),
          createdAt: item.order.createdAt.toISOString(),
        })),
        createdAt: product.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/inventory/products/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération du produit.",
      500
    );
  }
}

/**
 * PUT /api/inventory/products/[id]
 * Met à jour un produit existant (informations, prix, stock, catégorie, image, statut actif, seuil alerte)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse(`Produit introuvable avec l'ID: ${id}`, 404);
    }

    // Métadonnées (description, isActive, lowStockThreshold)
    const currentMeta = parseProductMeta(existingProduct.description);
    const newText = body.description !== undefined ? (body.description?.trim() || "") : currentMeta.text;
    const newIsActive = body.isActive !== undefined ? Boolean(body.isActive) : currentMeta.isActive;
    const newThreshold =
      body.lowStockThreshold !== undefined
        ? Math.max(0, parseInt(body.lowStockThreshold, 10) || 0)
        : currentMeta.lowStockThreshold;

    const finalDescription = JSON.stringify({
      text: newText,
      isActive: newIsActive,
      lowStockThreshold: newThreshold,
    });

    // Vérification de l'unicité du SKU si modifié
    if (body.sku && body.sku.trim().toUpperCase() !== existingProduct.sku) {
      const newSku = body.sku.trim().toUpperCase();
      const skuConflict = await db.product.findFirst({
        where: {
          sku: newSku,
          NOT: { id },
        },
      });
      if (skuConflict) {
        return errorResponse(`Le SKU "${newSku}" est déjà utilisé par un autre produit.`, 409);
      }
    }

    // Vérification de l'existence de la catégorie si fournie
    let targetCategoryId = existingProduct.categoryId;
    if (body.categoryId && body.categoryId !== existingProduct.categoryId) {
      const categoryExists = await db.category.findUnique({
        where: { id: body.categoryId },
      });
      if (!categoryExists) {
        return errorResponse("La catégorie spécifiée n'existe pas.", 400);
      }
      targetCategoryId = body.categoryId;
    }

    // Validation des prix
    const newCostPrice = body.costPrice !== undefined ? Number(body.costPrice) : Number(existingProduct.costPrice);
    const newSalePrice = body.salePrice !== undefined ? Number(body.salePrice) : Number(existingProduct.salePrice);
    if (newCostPrice <= 0) {
      return errorResponse("Le prix d'achat doit être supérieur à zéro.", 400);
    }
    if (newSalePrice <= 0) {
      return errorResponse("Le prix de vente doit être supérieur à zéro.", 400);
    }
    if (newSalePrice < newCostPrice) {
      return errorResponse("Le prix de vente ne peut pas être inférieur au prix d'achat.", 400);
    }

    // Validation du stock
    let newStock = existingProduct.stock;
    if (body.stock !== undefined) {
      const parsedStock = parseInt(body.stock, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return errorResponse("Le stock doit être un entier positif ou nul.", 400);
      }
      newStock = parsedStock;
    }

    // Traitement de l'image (Base64 ou URL ou suppression)
    let finalImageUrl: string | null = existingProduct.imageUrl;
    if (body.imageUrl !== undefined) {
      if (body.imageUrl === null || body.imageUrl === "") {
        finalImageUrl = null;
      } else if (typeof body.imageUrl === "string" && body.imageUrl.trim() !== "") {
        const rawImg = body.imageUrl.trim();
        if (rawImg.startsWith("data:image/")) {
          try {
            const matches = rawImg.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
            if (matches) {
              let ext = matches[1].toLowerCase();
              if (ext === "jpeg") ext = "jpg";
              if (ext.includes("svg")) ext = "svg";
              const base64Data = matches[2];
              const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

              const backendUploads = path.join(process.cwd(), "public", "uploads", "products");
              if (!fs.existsSync(backendUploads)) {
                fs.mkdirSync(backendUploads, { recursive: true });
              }
              fs.writeFileSync(path.join(backendUploads, fileName), Buffer.from(base64Data, "base64"));

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
            console.warn("[PUT /api/inventory/products/[id]] Erreur enregistrement image base64:", imgErr);
          }
        } else {
          finalImageUrl = rawImg.length > 500 ? rawImg.substring(0, 500) : rawImg;
        }
      }
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        sku: body.sku ? body.sku.trim().toUpperCase() : undefined,
        name: body.name !== undefined ? body.name.trim() : undefined,
        description: finalDescription,
        costPrice: body.costPrice !== undefined ? newCostPrice : undefined,
        salePrice: body.salePrice !== undefined ? newSalePrice : undefined,
        stock: newStock,
        imageUrl: finalImageUrl,
        categoryId: targetCategoryId,
        supplierId: body.supplierId !== undefined ? body.supplierId : undefined,
      },
      include: {
        category: true,
      },
    });

    const cost = Number(updatedProduct.costPrice);
    const sale = Number(updatedProduct.salePrice);
    const margin = sale > 0 ? ((sale - cost) / sale) * 100 : 0;

    return jsonResponse({
      success: true,
      data: {
        id: updatedProduct.id,
        sku: updatedProduct.sku,
        name: updatedProduct.name,
        description: newText,
        isActive: newIsActive,
        lowStockThreshold: newThreshold,
        costPrice: cost,
        salePrice: sale,
        stock: updatedProduct.stock,
        marginPercent: parseFloat(margin.toFixed(1)),
        imageUrl: updatedProduct.imageUrl,
        categoryId: updatedProduct.categoryId,
        category: updatedProduct.category,
        createdAt: updatedProduct.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[PUT /api/inventory/products/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la mise à jour du produit.",
      500
    );
  }
}


/**
 * DELETE /api/inventory/products/[id]
 * Supprime un produit. Supporte ?force=true pour nettoyer les éléments de test orphelins (commandes & réceptions)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";

    const existingProduct = await db.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            supplyOrderItems: true,
          },
        },
      },
    });

    if (!existingProduct) {
      return errorResponse(`Produit introuvable avec l'ID: ${id}`, 404);
    }

    const orderCount = existingProduct._count.orderItems;
    const supplyCount = existingProduct._count.supplyOrderItems;

    if ((orderCount > 0 || supplyCount > 0) && !force) {
      return errorResponse(
        `Impossible de supprimer "${existingProduct.name}" car il est associé à ${orderCount} commande(s) et ${supplyCount} réception(s) fournisseur. Vous pouvez forcer la suppression ou passer son stock à 0.`,
        400
      );
    }

    await db.$transaction(async (tx) => {
      // 1. Nettoyer les lignes de réceptions d'approvisionnement liées
      if (supplyCount > 0) {
        await tx.supplyOrderItem.deleteMany({
          where: { productId: id },
        });

        // Nettoyer les bons de réception devenus vides
        await tx.supplyOrder.deleteMany({
          where: { items: { none: {} } },
        });
      }

      // 2. Nettoyer les lignes de commandes liées
      if (orderCount > 0) {
        await tx.orderItem.deleteMany({
          where: { productId: id },
        });

        // Nettoyer les commandes devenues vides
        await tx.order.deleteMany({
          where: { items: { none: {} } },
        });
      }

      // 3. Supprimer le produit
      await tx.product.delete({
        where: { id },
      });
    });

    return jsonResponse({
      success: true,
      data: {
        id,
        message: `Produit "${existingProduct.name}" supprimé avec succès.`,
      },
    });
  } catch (error: unknown) {
    console.error("[DELETE /api/inventory/products/[id]] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la suppression du produit.",
      500
    );
  }
}

