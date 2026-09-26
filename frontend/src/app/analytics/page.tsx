import React from "react";
import { getAnalyticsAction } from "@/actions/analytics";
import { getSocialAnalyticsAction } from "@/actions/social-analytics";
import { MetaAnalyticsSpace } from "@/components/analytics/MetaAnalyticsSpace";
import { OrdersAnalyticsSpace } from "@/components/analytics/OrdersAnalyticsSpace";
import { CrossAnalyticsBanner } from "@/components/analytics/CrossAnalyticsBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Instagram,
  ShoppingCart,
  LayoutGrid,
  Settings,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyses & Performances | COD Manager",
  description:
    "Tableau de bord d'analyse pour le pilotage de l'espace Meta (Instagram & Ads) et de l'espace commandes COD au Maroc.",
};

interface AnalyticsPageProps {
  searchParams?: {
    tab?: string;
  };
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  // Chargement en parallèle des données analytiques Commandes et Meta
  const [ordersRes, metaRes] = await Promise.all([
    getAnalyticsAction(),
    getSocialAnalyticsAction(),
  ]);

  const ordersData = ordersRes.success && ordersRes.data ? ordersRes.data.kpis : null;
  const citiesData = ordersRes.success && ordersRes.data ? ordersRes.data.cities : [];
  const metaData = metaRes.success && metaRes.data ? metaRes.data : null;

  const defaultTab =
    searchParams?.tab === "meta"
      ? "meta"
      : searchParams?.tab === "orders"
      ? "orders"
      : searchParams?.tab === "all"
      ? "all"
      : "meta";

  return (
    <div className="space-y-6">
      {/* En-tête de la Page */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>Analyses & Pilotage des Performances</span>
            <Badge variant="secondary" className="text-xs font-normal">
              COD & Social
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            Espace unifié pour suivre l'acquisition Meta (Instagram & Ads) et la rentabilité de vos commandes COD au Maroc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Link href="/settings">
              <Settings className="h-3.5 w-3.5" />
              <span>Paramètres Meta</span>
            </Link>
          </Button>

          <Button asChild variant="default" size="sm" className="h-9 gap-1.5 text-xs">
            <Link href="/orders">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Voir les commandes</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Bannière de Synthèse Croisée ROAS / CPA (si données Meta Ads disponibles) */}
      {ordersData && (
        <CrossAnalyticsBanner
          deliveredRevenue={ordersData.totalRevenue}
          deliveredOrdersCount={ordersData.countDelivered || 0}
          netProfit={ordersData.netProfit}
          adsSpendUSD={metaData?.ads?.spend || 0}
          adsClicks={metaData?.ads?.clicks || 0}
        />
      )}

      {/* Navigation par Onglets : Espace Meta / Espace Commandes / Vue Complète */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <TabsList className="bg-muted/80 p-1 h-10 gap-1">
            <TabsTrigger value="meta" className="gap-2 text-xs font-semibold px-4 h-8 data-[state=active]:bg-background">
              <Instagram className="h-3.5 w-3.5 text-rose-500" />
              <span>Espace Meta (Instagram & Ads)</span>
              {metaData?.isConnected && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block ml-0.5" />
              )}
            </TabsTrigger>

            <TabsTrigger value="orders" className="gap-2 text-xs font-semibold px-4 h-8 data-[state=active]:bg-background">
              <ShoppingCart className="h-3.5 w-3.5 text-primary" />
              <span>Espace Commandes (COD & Marges)</span>
              {ordersData?.totalOrders !== undefined && (
                <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                  {ordersData.totalOrders}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="all" className="gap-2 text-xs font-semibold px-4 h-8 data-[state=active]:bg-background hidden sm:inline-flex">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Vue Complète (Tout-en-un)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. Onglet Espace Meta */}
        <TabsContent value="meta" className="space-y-6 mt-0">
          <MetaAnalyticsSpace initialData={metaData} />
        </TabsContent>

        {/* 2. Onglet Espace Commandes */}
        <TabsContent value="orders" className="space-y-6 mt-0">
          {ordersData ? (
            <OrdersAnalyticsSpace data={ordersData} cities={citiesData} />
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Chargement des statistiques de commandes...
            </div>
          )}
        </TabsContent>

        {/* 3. Onglet Vue Complète (Espace Meta + Espace Commandes) */}
        <TabsContent value="all" className="space-y-8 mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Instagram className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-foreground">
                1. Analyse Espace Meta (Réseaux Sociaux & Publicités)
              </h2>
            </div>
            <MetaAnalyticsSpace initialData={metaData} />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 border-b pb-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                2. Analyse Espace Commandes (Ventes COD & Rentabilité Maroc)
              </h2>
            </div>
            {ordersData ? (
              <OrdersAnalyticsSpace data={ordersData} cities={citiesData} />
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Chargement des statistiques de commandes...
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
