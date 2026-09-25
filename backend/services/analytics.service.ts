import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  city?: string;
  courierId?: string;
  assignedToId?: string;
}

export interface FinancialMetrics {
  totalOrders: number;
  totalRevenue: number;          // Chiffre d'affaires encaissé (commandes DELIVERED)
  potentialRevenue: number;      // Chiffre d'affaires potentiel (CONFIRMED + SHIPPED + DELIVERED)
  totalCostPrice: number;        // Coût d'achat total des marchandises livrées (COGS)
  netProfit: number;             // Bénéfice net (Revenue - Cost)
  netMarginPercentage: number;   // Marge nette en %
  confirmationRate: number;      // Taux de confirmation (%)
  deliveryRate: number;          // Taux de livraison (%)
  cancellationRate: number;      // Taux d'annulation (%)
  returnRate: number;            // Taux de retour (%)
}

export interface CityAnalytics {
  city: string;
  totalOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  deliveryRate: number;
  revenue: number;
}

export class AnalyticsService {
  /**
   * Calcul complet des indicateurs financiers et taux de conversion COD
   */
  static async getFinancialKPIs(filter?: AnalyticsFilter): Promise<FinancialMetrics> {
    const whereClause: Record<string, unknown> = {};

    if (filter?.startDate || filter?.endDate) {
      whereClause.createdAt = {
        ...(filter.startDate ? { gte: filter.startDate } : {}),
        ...(filter.endDate ? { lte: filter.endDate } : {}),
      };
    }

    if (filter?.city) {
      whereClause.city = filter.city;
    }
    if (filter?.courierId) {
      whereClause.courierId = filter.courierId;
    }
    if (filter?.assignedToId) {
      whereClause.assignedToId = filter.assignedToId;
    }

    // Récupérer toutes les commandes avec leurs articles et les prix de revient des produits
    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: {
                costPrice: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    const totalOrders = orders.length;

    if (totalOrders === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        potentialRevenue: 0,
        totalCostPrice: 0,
        netProfit: 0,
        netMarginPercentage: 0,
        confirmationRate: 0,
        deliveryRate: 0,
        cancellationRate: 0,
        returnRate: 0,
      };
    }

    // Comptage par statut
    let countNew = 0;
    let countConfirmed = 0;
    let countShipped = 0;
    let countDelivered = 0;
    let countReturned = 0;
    let countCancelled = 0;
    let countNoAnswer = 0;

    let deliveredRevenue = 0;
    let potentialRevenue = 0;
    let deliveredCostPrice = 0;

    for (const order of orders) {
      const orderTotal = Number(order.totalAmount);

      switch (order.status) {
        case OrderStatus.NEW:
          countNew++;
          break;
        case OrderStatus.CONFIRMED:
          countConfirmed++;
          potentialRevenue += orderTotal;
          break;
        case OrderStatus.SHIPPED:
          countShipped++;
          potentialRevenue += orderTotal;
          break;
        case OrderStatus.DELIVERED:
          countDelivered++;
          deliveredRevenue += orderTotal;
          potentialRevenue += orderTotal;

          // Calcul du coût d'achat des produits effectivement livrés
          for (const item of order.items) {
            const itemCost = Number(item.product.costPrice) * item.quantity;
            deliveredCostPrice += itemCost;
          }
          break;
        case OrderStatus.RETURNED:
          countReturned++;
          break;
        case OrderStatus.CANCELLED:
          countCancelled++;
          break;
        case OrderStatus.NO_ANSWER:
          countNoAnswer++;
          break;
      }
    }

    // 1. Taux de confirmation :
    // Sont considérées comme confirmées toutes les commandes validées par l'agent :
    // (CONFIRMED + SHIPPED + DELIVERED + RETURNED) par rapport au total des commandes
    const totalConfirmedStage =
      countConfirmed + countShipped + countDelivered + countReturned;
    const confirmationRate = totalOrders > 0
      ? Number(((totalConfirmedStage / totalOrders) * 100).toFixed(2))
      : 0;

    // 2. Taux de livraison :
    // Livrées / Total expédiées (DELIVERED + RETURNED + SHIPPED)
    const totalDispatched = countDelivered + countReturned + countShipped;
    const deliveryRate = totalDispatched > 0
      ? Number(((countDelivered / totalDispatched) * 100).toFixed(2))
      : 0;

    // 3. Taux d'annulation et de retour
    const cancellationRate = totalOrders > 0
      ? Number(((countCancelled / totalOrders) * 100).toFixed(2))
      : 0;

    const returnRate = (countDelivered + countReturned) > 0
      ? Number(((countReturned / (countDelivered + countReturned)) * 100).toFixed(2))
      : 0;

    // 4. Marge Nette & Bénéfice Net
    const netProfit = Number((deliveredRevenue - deliveredCostPrice).toFixed(2));
    const netMarginPercentage = deliveredRevenue > 0
      ? Number(((netProfit / deliveredRevenue) * 100).toFixed(2))
      : 0;

    return {
      totalOrders,
      totalRevenue: Number(deliveredRevenue.toFixed(2)),
      potentialRevenue: Number(potentialRevenue.toFixed(2)),
      totalCostPrice: Number(deliveredCostPrice.toFixed(2)),
      netProfit,
      netMarginPercentage,
      confirmationRate,
      deliveryRate,
      cancellationRate,
      returnRate,
    };
  }

  /**
   * Performance par Ville marocaine (Casablanca, Marrakech, Tanger, etc.)
   */
  static async getCityPerformance(): Promise<CityAnalytics[]> {
    const orders = await db.order.findMany({
      select: {
        city: true,
        status: true,
        totalAmount: true,
      },
    });

    const cityMap = new Map<string, {
      total: number;
      delivered: number;
      returned: number;
      revenue: number;
    }>();

    for (const order of orders) {
      const cityKey = order.city.trim().toLowerCase();
      const current = cityMap.get(cityKey) || {
        total: 0,
        delivered: 0,
        returned: 0,
        revenue: 0,
      };

      current.total += 1;
      if (order.status === OrderStatus.DELIVERED) {
        current.delivered += 1;
        current.revenue += Number(order.totalAmount);
      } else if (order.status === OrderStatus.RETURNED) {
        current.returned += 1;
      }

      cityMap.set(cityKey, current);
    }

    const result: CityAnalytics[] = [];
    for (const [cityKey, stats] of cityMap.entries()) {
      const deliveredOrReturned = stats.delivered + stats.returned;
      const deliveryRate = deliveredOrReturned > 0
        ? Number(((stats.delivered / deliveredOrReturned) * 100).toFixed(2))
        : 0;

      // Normaliser le nom de la ville avec première lettre majuscule
      const formattedCity = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);

      result.push({
        city: formattedCity,
        totalOrders: stats.total,
        deliveredOrders: stats.delivered,
        returnedOrders: stats.returned,
        deliveryRate,
        revenue: Number(stats.revenue.toFixed(2)),
      });
    }

    // Trier par chiffre d'affaires décroissant
    return result.sort((a, b) => b.revenue - a.revenue);
  }
}
