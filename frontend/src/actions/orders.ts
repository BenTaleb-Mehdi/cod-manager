"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { Order, OrderStatus } from "@/types";

export interface OrdersListResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleOrderDetails extends Order {
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastLocationAt?: string | null;
  invoice?: {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    createdAt: string;
  } | null;
  trackingEvents?: Array<{
    id: string;
    status: OrderStatus;
    note?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
  }>;
}

/**
 * Récupère les commandes depuis l'API backend
 */
export async function getOrdersAction(params?: {
  status?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<OrdersListResponse>> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") query.set("status", params.status);
  if (params?.city && params.city !== "all") query.set("city", params.city);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<OrdersListResponse>(`/api/orders${qs}`);
}

/**
 * Récupère une commande par son ID depuis le backend
 */
export async function getOrderByIdAction(id: string): Promise<ApiResponse<SingleOrderDetails>> {
  return apiFetch<SingleOrderDetails>(`/api/orders/${id}`);
}

/**
 * Met à jour le statut d'une commande via l'API backend (ACID stock)
 */
export async function updateOrderStatusAction(input: {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  note?: string;
}): Promise<ApiResponse<{ orderId: string; newStatus: string }>> {
  return apiFetch<{ orderId: string; newStatus: string }>(
    `/api/orders/${input.orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
}

/**
 * Crée une nouvelle commande avec articles via l'API backend
 */
export async function createOrderAction(input: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  shippingNote?: string;
  items: Array<{ productId: string; quantity: number; price?: number }>;
}): Promise<ApiResponse<{ orderId: string; totalAmount: number }>> {
  return apiFetch<{ orderId: string; totalAmount: number }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Affecte des commandes en masse à un agent ou transporteur
 */
export async function bulkAssignOrdersAction(input: {
  type: "agent" | "courier";
  targetId: string;
  orderIds: string[];
}): Promise<ApiResponse<{ updatedCount: number }>> {
  return apiFetch<{ updatedCount: number }>("/api/orders/bulk-assign", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Ajoute un événement de suivi / tracking et met à jour les coordonnées GPS
 */
export async function addOrderTrackingEventAction(input: {
  orderId: string;
  trackingNumber?: string;
  courierId?: string;
  status?: OrderStatus;
  note: string;
  latitude?: number;
  longitude?: number;
}): Promise<ApiResponse<{ eventId: string; orderId: string; status: OrderStatus }>> {
  return apiFetch<{ eventId: string; orderId: string; status: OrderStatus }>(
    `/api/orders/${input.orderId}/tracking`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

