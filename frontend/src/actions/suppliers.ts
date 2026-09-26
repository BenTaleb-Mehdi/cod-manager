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
