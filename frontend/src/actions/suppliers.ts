"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { Supplier } from "@/types";

/**
 * Récupère la liste des fournisseurs depuis le backend
 */
export async function getSuppliersAction(): Promise<ApiResponse<Supplier[]>> {
  return apiFetch<Supplier[]>("/api/suppliers");
}

/**
 * Crée un nouveau fournisseur via l'API backend
 */
export async function createSupplierAction(input: {
  name: string;
  phone: string;
  city: string;
  address?: string;
}): Promise<ApiResponse<Supplier>> {
  return apiFetch<Supplier>("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Enregistre un bon de réception de stock (ACID inventory increment)
 */
export async function receiveSupplyOrderAction(input: {
  supplierId: string;
  note?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
  }>;
}): Promise<ApiResponse<{ supplyOrderId: string; totalAmount: number; itemsCount: number }>> {
  return apiFetch<{ supplyOrderId: string; totalAmount: number; itemsCount: number }>(
    "/api/suppliers/receive",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

/**
 * Récupère le détail d'un fournisseur avec ses produits et son historique de réceptions
 */
export async function getSupplierDetailAction(id: string): Promise<ApiResponse<any>> {
  return apiFetch<any>(`/api/suppliers/${id}`);
}

/**
 * Met à jour un fournisseur existant
 */
export async function updateSupplierAction(
  id: string,
  input: {
    name?: string;
    phone?: string;
    city?: string;
    address?: string | null;
  }
): Promise<ApiResponse<Supplier>> {
  return apiFetch<Supplier>(`/api/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

/**
 * Supprime un fournisseur
 */
export async function deleteSupplierAction(
  id: string
): Promise<ApiResponse<{ id: string; message: string }>> {
  return apiFetch<{ id: string; message: string }>(`/api/suppliers/${id}`, {
    method: "DELETE",
  });
}

/**
 * Enregistre un règlement / paiement de dette envers un fournisseur
 */
export async function paySupplierAction(
  id: string,
  input: {
    amount: number;
    note?: string;
  }
): Promise<ApiResponse<Supplier>> {
  return apiFetch<Supplier>(`/api/suppliers/${id}/pay`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

