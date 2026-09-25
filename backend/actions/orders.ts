"use server";

import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order.service";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  BulkAssignToAgentSchema,
  BulkAssignToCourierSchema,
  CreateOrderInput,
  UpdateOrderStatusInput,
  BulkAssignToAgentInput,
  BulkAssignToCourierInput,
} from "@/lib/validations/order";

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action : Créer une commande avec vérification et décrémentation atomique des stocks.
 */
export async function createOrderWithItemsAction(
  rawInput: CreateOrderInput
): Promise<ServerActionResponse<{ orderId: string; totalAmount: string }>> {
  try {
    const validatedData = CreateOrderSchema.parse(rawInput);

    const order = await OrderService.createOrderWithItems(validatedData);

    revalidatePath("/orders");
    revalidatePath("/analytics");
    revalidatePath("/inventory");

    return {
      success: true,
      data: {
        orderId: order.id,
        totalAmount: order.totalAmount.toString(),
      },
    };
  } catch (error: unknown) {
    console.error("[createOrderWithItemsAction] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inattendue lors de la création de la commande.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server Action : Mise à jour du statut d'une commande avec gestion des stocks.
 * En cas de passage à CANCELLED ou RETURNED, les stocks sont réinjectés de manière ACID.
 */
export async function updateOrderStatusAction(
  rawInput: UpdateOrderStatusInput
): Promise<ServerActionResponse<{ orderId: string; newStatus: string }>> {
  try {
    const validatedData = UpdateOrderStatusSchema.parse(rawInput);

    const updatedOrder = await OrderService.updateOrderStatus(validatedData);

    revalidatePath("/orders");
    revalidatePath(`/orders/${updatedOrder.id}`);
    revalidatePath("/analytics");
    revalidatePath("/inventory");

    return {
      success: true,
      data: {
        orderId: updatedOrder.id,
        newStatus: updatedOrder.status,
      },
    };
  } catch (error: unknown) {
    console.error("[updateOrderStatusAction] Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur inattendue lors de la mise à jour du statut.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server Action : Affectation en masse de commandes à un agent de confirmation.
 */
export async function assignOrdersToAgentAction(
  rawInput: BulkAssignToAgentInput
): Promise<ServerActionResponse<{ updatedCount: number }>> {
  try {
    const validatedData = BulkAssignToAgentSchema.parse(rawInput);

    const result = await OrderService.assignOrdersToAgent(validatedData);

    revalidatePath("/orders");

    return {
      success: true,
      data: {
        updatedCount: result.count,
      },
    };
  } catch (error: unknown) {
    console.error("[assignOrdersToAgentAction] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur lors de l'assignation aux agents.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server Action : Affectation en masse de commandes à un transporteur/livreur.
 */
export async function assignOrdersToCourierAction(
  rawInput: BulkAssignToCourierInput
): Promise<ServerActionResponse<{ updatedCount: number }>> {
  try {
    const validatedData = BulkAssignToCourierSchema.parse(rawInput);

    const result = await OrderService.assignOrdersToCourier(validatedData);

    revalidatePath("/orders");
    revalidatePath("/couriers");

    return {
      success: true,
      data: {
        updatedCount: result.count,
      },
    };
  } catch (error: unknown) {
    console.error("[assignOrdersToCourierAction] Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de l'assignation au transporteur.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
