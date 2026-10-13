"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPriceMAD } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Zap,
  DollarSign,
  Scale,
} from "lucide-react";

interface CrossAnalyticsBannerProps {
  deliveredRevenue: number;
  deliveredOrdersCount: number;
  netProfit: number;
  adsSpendUSD?: number;
  adsClicks?: number;
}

export function CrossAnalyticsBanner({
  deliveredRevenue,
  deliveredOrdersCount,
  netProfit,
  adsSpendUSD = 0,
  adsClicks = 0,
}: CrossAnalyticsBannerProps) {
  // Conversion approximative 1 USD = 10 MAD
  const adsSpendMAD = adsSpendUSD * 10;

  // Calcul du ROAS (Chiffre d'Affaires Livré / Dépenses Publicitaires en DH)
  const roas = adsSpendMAD > 0 ? (deliveredRevenue / adsSpendMAD).toFixed(2) : null;

  // Coût par Commande Livrée (CPA)
  const cpa =
    deliveredOrdersCount > 0 && adsSpendMAD > 0
      ? (adsSpendMAD / deliveredOrdersCount).toFixed(0)
      : null;

  // Bénéfice Net après déduction du budget Ads
  const netProfitAfterAds = netProfit - adsSpendMAD;

  // Taux de conversion Clics -> Commandes
  const clickToOrderRate =
    adsClicks > 0 && deliveredOrdersCount > 0
      ? ((deliveredOrdersCount / adsClicks) * 100).toFixed(1)
      : null;

  if (adsSpendUSD <= 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Synthèse Croisée : Espace Meta Ads ⇄ Espace Commandes COD
                </h3>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-mono">
                  ROI & ROAS
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Impact direct de votre investissement publicitaire Meta sur vos encaissements réels à la livraison.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-0 border-border/50">
            {/* ROAS */}
            <div className="bg-card/80 p-2.5 rounded-lg border shadow-2xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">ROAS Encaissé</span>
              <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {roas ? `${roas}x` : "—"}
              </div>
              <span className="text-[10px] text-muted-foreground">CA Livré / Ads</span>
            </div>

            {/* CPA */}
            <div className="bg-card/80 p-2.5 rounded-lg border shadow-2xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">CPA / Colis</span>
              <div className="text-base font-bold font-mono text-primary">
                {cpa ? `${cpa} DH` : "—"}
              </div>
              <span className="text-[10px] text-muted-foreground">Coût acqu. livrée</span>
            </div>

            {/* Taux Conversion */}
            <div className="bg-card/80 p-2.5 rounded-lg border shadow-2xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Clic → Vente</span>
              <div className="text-base font-bold font-mono text-sky-600 dark:text-sky-400">
                {clickToOrderRate ? `${clickToOrderRate}%` : "—"}
              </div>
              <span className="text-[10px] text-muted-foreground">Taux de conversion</span>
            </div>

            {/* Bénéfice Réel après Pub */}
            <div className="bg-card/80 p-2.5 rounded-lg border shadow-2xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Net Après Ads</span>
              <div className={`text-base font-bold font-mono ${netProfitAfterAds >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                {formatPriceMAD(netProfitAfterAds)}
              </div>
              <span className="text-[10px] text-muted-foreground">Marge nette finale</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
