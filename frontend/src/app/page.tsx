import React from "react";
import { KpiOverview } from "@/components/dashboard/KpiOverview";
import { CityBreakdownCard } from "@/components/dashboard/CityBreakdownCard";
import { INITIAL_KPIS, INITIAL_CITY_STATS, MOCK_ORDERS } from "@/lib/moroccan-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/ui/badge";
import { formatPriceMAD } from "@/lib/utils";
import { ShoppingCart, PhoneCall, Plus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const pendingOrders = MOCK_ORDERS.filter(
    (o) => o.status === "NEW" || o.status === "NO_ANSWER"
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Vue d'ensemble COD Maroc
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Temps Réel
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi des ventes au comptant, flux des confirmations téléphoniques et rentabilité nette.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-9">
            <Link href="/orders?status=NEW">
              <PhoneCall className="h-4 w-4 text-amber-600" />
              <span>File d'appels ({pendingOrders.length})</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="gap-1.5 h-9">
            <Link href="/orders">
              <ShoppingCart className="h-4 w-4" />
              <span>Toutes les commandes</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Overview (Cartes de stats, taux de confirmation et livraison) */}
      <KpiOverview kpis={INITIAL_KPIS} />

      {/* Section 2 colonnes : Villes marocaines & File d'appels urgente */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performances régionales (Villes du Maroc) */}
        <CityBreakdownCard cities={INITIAL_CITY_STATS} />

        {/* File d'attente prioritaire Call Center */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-amber-600" />
                  Priorités Call Center (À Contacter)
                </CardTitle>
                <CardDescription className="text-xs">
                  Commandes récentes nécessitant validation ou relance
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-primary">
                <Link href="/orders">
                  Voir tout
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs shadow-none hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {order.customerName}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>{order.city}</span>
                      <span>•</span>
                      <span className="font-mono">{order.phone}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-bold text-foreground">
                      {formatPriceMAD(order.totalAmount)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {order.attemptsCount} appel(s) tenté(s)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
