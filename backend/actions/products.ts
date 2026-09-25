"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  CreateProductSchema,
  CreateCategorySchema,
  CreateProductInput,
  CreateCategoryInput,
} from "@/lib/validations";
import { ServerActionResponse } from "./orders";

/**
 * Server Action : Créer une catégorie de produits
 */
export async function createCategoryAction(
  rawInput: CreateCategoryInput
): Promise<ServerActionResponse<{ id: string; name: string; slug: string }>> {
  try {
    const validated = CreateCategorySchema.parse(rawInput);

    // Générer un slug si non fourni
    const slug =
      validated.slug ||
      validated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const category = await db.category.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
      },
    });

    revalidatePath("/inventory");
    return {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    };
  } catch (error: unknown) {
    console.error("[createCategoryAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur de création de catégorie.",
    };
  }
}

/**
 * Server Action : Créer un nouveau produit
 */
export async function createProductAction(
  rawInput: CreateProductInput
): Promise<ServerActionResponse<{ id: string; sku: string; name: string }>> {
  try {
    const validated = CreateProductSchema.parse(rawInput);

    // Vérifier l'unicité du SKU
    const existingSku = await db.product.findUnique({
      where: { sku: validated.sku },
    });

    if (existingSku) {
      return {
        success: false,
        error: `Le SKU "${validated.sku}" est déjà utilisé par un autre produit.`,
      };
    }

    const product = await db.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        description: validated.description,
        costPrice: validated.costPrice,
        salePrice: validated.salePrice,
        stock: validated.stock,
        categoryId: validated.categoryId,
      },
    });

    revalidatePath("/inventory");
    revalidatePath("/orders");

    return {
      success: true,
      data: {
        id: product.id,
        sku: product.sku,
        name: product.name,
      },
    };
  } catch (error: unknown) {
    console.error("[createProductAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur de création du produit.",
    };
  }
}
