import { NextRequest } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

/**
 * GET /api/analytics
 * Renvoie les KPIs financiers, taux COD et ventilation par ville marocaine
 */
export async function GET(_request: NextRequest) {
  try {
    const [financialKPIs, cityPerformance] = await Promise.all([
      AnalyticsService.getFinancialKPIs(),
      AnalyticsService.getCityPerformance(),
    ]);

    return jsonResponse({
      success: true,
      data: {
        kpis: financialKPIs,
        cities: cityPerformance,
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/analytics] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors du calcul des KPIs analytics.",
      500
    );
  }
}
