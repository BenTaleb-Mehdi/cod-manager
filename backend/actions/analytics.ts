"use server";

import {
  AnalyticsService,
  FinancialMetrics,
  CityAnalytics,
  AnalyticsFilter,
} from "@/services/analytics.service";
import { ServerActionResponse } from "./orders";

/**
 * Server Action : Récupérer les métriques financières et taux COD
 */
export async function getFinancialKPIsAction(
  filter?: AnalyticsFilter
): Promise<ServerActionResponse<FinancialMetrics>> {
  try {
    const data = await AnalyticsService.getFinancialKPIs(filter);
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("[getFinancialKPIsAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors du calcul des KPIs financiers.",
    };
  }
}

/**
 * Server Action : Récupérer les performances de livraison par ville marocaine
 */
export async function getCityPerformanceAction(): Promise<ServerActionResponse<CityAnalytics[]>> {
  try {
    const data = await AnalyticsService.getCityPerformance();
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("[getCityPerformanceAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la récupération des performances régionales.",
    };
  }
}
