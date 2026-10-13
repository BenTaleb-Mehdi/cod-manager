import { db } from "@/lib/db";
import { OrderStatus, Prisma } from "@prisma/client";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  BulkAssignToAgentInput,
  BulkAssignToCourierInput,
} from "@/lib/validations/order";

/**
 * Définition des états de stock :
 * - ACTIVE : Le stock est décompté / réservé dans les entrepôts.
 * - INACTIVE : Le stock est réinjecté dans l'inventaire physique (Annulé ou Retourné).
 */
const ACTIVE_STOCK_STATUSES: OrderStatus[] = [
  OrderStatus.NEW,
  OrderStatus.CONFIRMED,
  OrderStatus.NO_ANSWER,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const INACTIVE_STOCK_STATUSES: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.RETURNED,
];

export interface OrderServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class OrderService {
  /**
   * Création d'une commande avec items sous transaction ACID stricte.
   * - Vérifie l'existence et la suffisance des stocks de chaque produit.
   * - Décrémente le stock en temps réel.
   * - Calcule le montant total basé sur les prix de vente en base.
   */
  static async createOrderWithItems(
    input: CreateOrderInput
  ): Promise<Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>> {
    return await db.$transaction(
      async (tx) => {
        // 1. Extraire et valider l'existence de chaque produit & stock
        const productIds = input.items.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          throw new Error("Un ou plusieurs produits spécifiés sont introuvables.");
        }

        const productMap = new Map(products.map((p) => [p.id, p]));

        let calculatedTotal = new Prisma.Decimal(0);
        const orderItemsData: {
          productId: string;
          quantity: number;
          price: Prisma.Decimal;
        }[] = [];

        // 2. Vérification et décrémentation des stocks
        for (const item of input.items) {
          const product = productMap.get(item.productId);
          if (!product) {
            throw new Error(`Produit introuvable: ID ${item.productId}`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Stock insuffisant pour le produit "${product.name}" (SKU: ${product.sku}). En stock: ${product.stock}, demandé: ${item.quantity}.`
            );
          }

          // Décrémentation atomique
          const updatedProduct = await tx.product.update({
            where: { id: product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Protection contre les accès concurrents
          if (updatedProduct.stock < 0) {
            throw new Error(
              `Conflit de stock détecté pour le produit "${product.name}". Opération annulée.`
            );
          }

          // Prix unitaire retenu (soit fourni spécifiquement, soit prix de vente du produit)
          const unitPrice = item.price
            ? new Prisma.Decimal(item.price)
            : product.salePrice;

          const itemTotal = unitPrice.mul(item.quantity);
          calculatedTotal = calculatedTotal.add(itemTotal);

          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: unitPrice,
          });
        }

        // 3. Création de la commande et de ses items associés
        const createdOrder = await tx.order.create({
          data: {
            customerName: input.customerName,
            phone: input.phone,
            city: input.city,
            address: input.address,
            shippingNote: input.shippingNote,
            totalAmount: calculatedTotal,
            status: OrderStatus.NEW,
            courierId: input.courierId ?? null,
            assignedToId: input.assignedToId ?? null,
            items: {
              create: orderItemsData.map((oi) => ({
                productId: oi.productId,
                quantity: oi.quantity,
                price: oi.price,
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return createdOrder;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // 5s attente acquisition lock
        timeout: 10000, // 10s temps total transaction
      }
    );
  }

  /**
   * Mise à jour du statut d'une commande avec gestion intelligente et réversible des stocks.
   * - ACTIVE -> INACTIVE (CANCELLED / RETURNED) => Réincrémentation du stock.
   * - INACTIVE -> ACTIVE => Nouvelle décrémentation du stock (avec contrôle de disponibilité).
   * - Pas de double réincrémentation ni double décrémentation.
   */
  static async updateOrderStatus(
    input: UpdateOrderStatusInput
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>> {
    const targetStatus = input.status as OrderStatus;

    return await db.$transaction(
      async (tx) => {
        // Verrouiller la commande en lecture
        const currentOrder = await tx.order.findUnique({
          where: { id: input.orderId },
          include: { items: true },
        });

        if (!currentOrder) {
          throw new Error(`Commande introuvable avec l'ID: ${input.orderId}`);
        }

        const previousStatus = currentOrder.status;

        // Si le statut ne change pas et qu'aucun autre champ n'est modifié, retourner la commande existante
        if (
          previousStatus === targetStatus &&
          !input.trackingNumber &&
          !input.note
        ) {
          return currentOrder;
        }

        const wasActive = ACTIVE_STOCK_STATUSES.includes(previousStatus);
        const willBeInactive = INACTIVE_STOCK_STATUSES.includes(targetStatus);

        const wasInactive = INACTIVE_STOCK_STATUSES.includes(previousStatus);
        const willBeActive = ACTIVE_STOCK_STATUSES.includes(targetStatus);

        // CAS 1 : Passage d'un état actif vers un état inactif (Annulation ou Retour de livraison)
        // -> Restitution des stocks
        if (wasActive && willBeInactive) {
          for (const item of currentOrder.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        // CAS 2 : Réactivation d'une commande précédemment annulée/retournée
        // -> Re-décrémentation des stocks avec contrôle strict
        if (wasInactive && willBeActive) {
          for (const item of currentOrder.items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (!product) {
              throw new Error(`Produit introuvable ID: ${item.productId}`);
            }

            if (product.stock < item.quantity) {
              throw new Error(
                `Impossible de réactiver la commande : Stock insuffisant pour "${product.name}" (En stock: ${product.stock}, Requis: ${item.quantity}).`
              );
            }

            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }

        // Mise à jour de la commande
        const updatedOrder = await tx.order.update({
          where: { id: input.orderId },
          data: {
            status: targetStatus,
            trackingNumber: input.trackingNumber ?? currentOrder.trackingNumber,
            // Incrémenter le compteur de tentatives si pas de réponse ou relance
            attemptsCount:
              targetStatus === OrderStatus.NO_ANSWER
                ? { increment: 1 }
                : currentOrder.attemptsCount,
            shippingNote: input.note
              ? currentOrder.shippingNote
                ? `${currentOrder.shippingNote}\n[Note ${new Date().toISOString()}]: ${input.note}`
                : `[Note ${new Date().toISOString()}]: ${input.note}`
              : currentOrder.shippingNote,
          },
          include: {
            items: true,
          },
        });

        return updatedOrder;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        timeout: 10000,
      }
    );
  }

  /**
   * Assignation en masse (Bulk assign) de commandes à un agent du centre d'appels.
   */
  static async assignOrdersToAgent(input: BulkAssignToAgentInput): Promise<{ count: number }> {
    return await db.$transaction(async (tx) => {
      // Vérifier que l'agent existe et a un rôle valide
      const agent = await tx.user.findUnique({
        where: { id: input.agentId },
      });

      if (!agent) {
        throw new Error("L'agent spécifié n'existe pas.");
      }

      if (agent.role !== "AGENT" && agent.role !== "ADMIN") {
        throw new Error("L'utilisateur sélectionné n'est pas un agent ou admin.");
      }

      const updateResult = await tx.order.updateMany({
        where: {
          id: { in: input.orderIds },
        },
        data: {
          assignedToId: input.agentId,
        },
      });

      return updateResult;
    });
  }

  /**
   * Assignation en masse (Bulk assign) de commandes à un transporteur/livreur.
   */
  static async assignOrdersToCourier(input: BulkAssignToCourierInput): Promise<{ count: number }> {
    return await db.$transaction(async (tx) => {
      // Vérifier que le transporteur existe
      const courier = await tx.courier.findUnique({
        where: { id: input.courierId },
      });

      if (!courier) {
        throw new Error("Le transporteur/livreur spécifié n'existe pas.");
      }

      const updateResult = await tx.order.updateMany({
        where: {
          id: { in: input.orderIds },
        },
        data: {
          courierId: input.courierId,
        },
      });

      return updateResult;
    });
  }
}
