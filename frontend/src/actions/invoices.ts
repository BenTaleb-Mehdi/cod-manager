"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { StoreSetting } from "@/types";

export interface InvoicePrintData {
  invoice: {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    createdAt: string;
  };
  order: {
    id: string;
    customerName: string;
    phone: string;
    city: string;
    address: string;
    trackingNumber?: string | null;
    status: string;
    items: Array<{
      id: string;
      sku: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  };
  store: StoreSetting;
}

/**
 * Récupère les données complètes de facturation d'une commande
 */
export async function getInvoicePrintDataAction(
  orderId: string
): Promise<ApiResponse<InvoicePrintData>> {
  return apiFetch<InvoicePrintData>(`/api/invoices/${orderId}`);
}
