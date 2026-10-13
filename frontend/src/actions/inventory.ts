"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { Product, Category } from "@/types";

export interface InventoryResponse {
  products: Product[];
  categories: Category[];
  summary: {
    totalProducts: number;
    totalStockUnits: number;
    lowStockCount: number;
    totalInventoryCost: number;
  };
}

/**
 * Récupère l'inventaire complet (produits, catégories, stats) depuis le backend
 */
export async function getInventoryAction(): Promise<ApiResponse<InventoryResponse>> {
  return apiFetch<InventoryResponse>("/api/inventory");
}

/**
 * Crée un produit via l'API backend
 */
export async function createProductAction(input: {
  sku: string;
  name: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  supplierId?: string;
  imageUrl?: string | null;
}): Promise<ApiResponse<Product>> {
  return apiFetch<Product>("/api/inventory/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Crée une catégorie via l'API backend
 */
export async function createCategoryAction(input: {
  name: string;
  slug?: string;
  description?: string;
}): Promise<ApiResponse<Category>> {
  return apiFetch<Category>("/api/inventory/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
