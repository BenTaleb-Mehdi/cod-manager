import React from "react";
import { KpiOverview } from "@/components/dashboard/KpiOverview";
import { CityBreakdownCard } from "@/components/dashboard/CityBreakdownCard";
import { INITIAL_KPIS, INITIAL_CITY_STATS } from "@/lib/moroccan-data";
import { getDashboardKPIsAction } from "@/actions/analytics";
import { getOrdersAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/ui/badge";
import { formatPriceMAD } from "@/lib/utils";
import { CreateOrderDialog } from "@/components/orders/CreateOrderDialog";
import { ShoppingCart, PhoneCall, Plus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [analyticsRes, ordersRes] = await Promise.all([
    getDashboardKPIsAction(),
    getOrdersAction({ limit: 10 }),
  ]);

  const kpis = analyticsRes.success && analyticsRes.data ? analyticsRes.data.kpis : INITIAL_KPIS;
  const cities = analyticsRes.success && analyticsRes.data ? analyticsRes.data.cities : INITIAL_CITY_STATS;
  const orders = ordersRes.success && ordersRes.data ? ordersRes.data.orders : [];

  const pendingOrders = orders.filter(
    (o) => o.status === "NEW" || o.status === "NO_ANSWER"
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Tableau de Bord Admin - COD Manager Maroc
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Back-Office
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestion des commandes du storefront Morly, call center et expéditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-9">
            <Link href="/" target="_blank">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Voir la Vitrine Morly</span>
            </Link>
          </Button>

          <CreateOrderDialog />

          <Button asChild variant="outline" size="sm" className="gap-1.5 h-9">
            <Link href="/orders?status=NEW">
              <PhoneCall className="h-4 w-4 text-amber-600" />
              <span>File d&apos;appels ({pendingOrders.length})</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <KpiOverview kpis={kpis} />

      {/* Grid: Recent Orders & City Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">
                  Dernières Commandes Clients
                </CardTitle>
                <CardDescription>
                  Commandes passées via la vitrine ou saisies manuellement
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/orders" className="text-xs gap-1">
                  Voir tout <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Aucune commande récente. Les commandes passées sur la vitrine apparaîtront ici.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {order.customerName}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.phone} • {order.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">
                          {formatPriceMAD(order.totalAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items?.length || 1} article(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <CityBreakdownCard stats={cities} />
        </div>
      </div>
    </div>
  );
}
