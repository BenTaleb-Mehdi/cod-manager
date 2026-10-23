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
    activeInventoryCost?: number;
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
  lowStockThreshold?: number;
  isActive?: boolean;
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

/**
 * Met à jour un produit existant (informations, prix, stock, catégorie, image, statut actif, seuil alerte)
 */
export async function updateProductAction(
  id: string,
  input: {
    sku?: string;
    name?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    stock?: number;
    categoryId?: string;
    supplierId?: string;
    imageUrl?: string | null;
    isActive?: boolean;
    lowStockThreshold?: number;
  }
): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/api/inventory/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

/**
 * Récupère le détail complet d'un produit avec historique et statistiques
 */
export async function getProductDetailAction(id: string): Promise<ApiResponse<any>> {
  return apiFetch<any>(`/api/inventory/products/${id}`);
}

/**
 * Active ou désactive un produit
 */
export async function toggleProductActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/api/inventory/products/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });
}

/**
 * Supprime un produit via l'API backend (supporte force pour nettoyer les données orphelines)
 */
export async function deleteProductAction(
  id: string,
  force: boolean = false
): Promise<ApiResponse<{ id: string; message: string }>> {
  return apiFetch<{ id: string; message: string }>(
    `/api/inventory/products/${id}?force=${force ? "true" : "false"}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * Ajuste rapidement le stock d'un produit
 */
export async function adjustProductStockAction(
  id: string,
  stock: number
): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/api/inventory/products/${id}`, {
    method: "PUT",
    body: JSON.stringify({ stock }),
  });
}


