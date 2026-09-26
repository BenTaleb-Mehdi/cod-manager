"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { DashboardKPIs, CityStat } from "@/types";

export interface AnalyticsResponse {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    potentialRevenue: number;
    totalCostPrice: number;
    netProfit: number;
    netMarginPercentage: number;
    confirmationRate: number;
    deliveryRate: number;
    cancellationRate: number;
    returnRate: number;
    countNew?: number;
    countNoAnswer?: number;
    countConfirmed?: number;
    countShipped?: number;
    countDelivered?: number;
    countReturned?: number;
    countCancelled?: number;
  };
  cities: CityStat[];
}

/**
 * Récupère les données d'analyse et KPIs financiers depuis le backend
 */
export async function getAnalyticsAction(): Promise<ApiResponse<AnalyticsResponse>> {
  return apiFetch<AnalyticsResponse>("/api/analytics");
}

/**
 * Récupère les KPIs pour le dashboard sous format adapté au composant KpiOverview
 */
export async function getDashboardKPIsAction(): Promise<ApiResponse<{ kpis: DashboardKPIs; cities: CityStat[] }>> {
  const res = await getAnalyticsAction();

  if (!res.success || !res.data) {
    return {
      success: false,
      error: res.error || "Impossible de charger les métriques.",
    };
  }

  const { kpis, cities } = res.data;

  const countNew = kpis.countNew ?? 0;
  const countNoAnswer = kpis.countNoAnswer ?? 0;
  const countConfirmed = kpis.countConfirmed ?? 0;
  const countShipped = kpis.countShipped ?? 0;
  const countDelivered = kpis.countDelivered ?? 0;
  const countReturned = kpis.countReturned ?? 0;
  const countCancelled = kpis.countCancelled ?? 0;

  const dashboardKpis: DashboardKPIs = {
    totalDeliveredRevenue: kpis.totalRevenue,
    totalOrders: kpis.totalOrders,
    confirmationRate: kpis.confirmationRate,
    deliveryRate: kpis.deliveryRate,
    pendingCallsCount: countNew + countNoAnswer,
    newCount: countNew,
    noAnswerCount: countNoAnswer,
    confirmedCount: countConfirmed,
    shippedCount: countShipped,
    deliveredCount: countDelivered,
    returnedCount: countReturned,
    cancelledCount: countCancelled,
  };


  return {
    success: true,
    data: {
      kpis: dashboardKpis,
      cities,
    },
  };
}
