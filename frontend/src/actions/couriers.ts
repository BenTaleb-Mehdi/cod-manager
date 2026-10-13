"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";

export interface CourierWithStats {
  id: string;
  name: string;
  phone: string;
  apiEndpoint?: string | null;
  apiKey?: string | null;
  webhookSecret?: string | null;
  ipWhitelist?: string | null;
  ordersCount: number;
  createdAt: string;
}

/**
 * Récupère la liste des transporteurs et sociétés de livraison
 */
export async function getCouriersAction(): Promise<ApiResponse<CourierWithStats[]>> {
  return apiFetch<CourierWithStats[]>("/api/couriers");
}

/**
 * Ajoute une nouvelle société de livraison avec ses identifiants API
 */
export async function createCourierAction(input: {
  name: string;
  phone: string;
  apiEndpoint?: string;
  apiKey?: string;
  webhookSecret?: string;
  ipWhitelist?: string;
}): Promise<ApiResponse<CourierWithStats>> {
  return apiFetch<CourierWithStats>("/api/couriers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
