"use client";

import React from "react";
import { DashboardKPIs } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceMAD } from "@/lib/utils";
import {
  Banknote,
  CheckCircle,
  Truck,
  PhoneForwarded,
  ArrowUpRight,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface KpiOverviewProps {
  kpis: DashboardKPIs;
}

export function KpiOverview({ kpis }: KpiOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 4 Cartes Principales de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Chiffre d'affaires Encaissé (DELIVERED) */}
        <Card className="relative overflow-hidden border-emerald-200/60 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CA Encaissé (Livrées)
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatPriceMAD(kpis.totalDeliveredRevenue)}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>{kpis.deliveredCount} colis encaissés</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Taux de Confirmation */}
        <Card className="relative overflow-hidden border-blue-200/60 dark:border-blue-900/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Taux de Confirmation
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {kpis.confirmationRate}%
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground mr-1">
                {kpis.totalOrders - kpis.cancelledCount}/{kpis.totalOrders}
              </span>
              commandes confirmées
            </div>
          </CardContent>
        </Card>

        {/* 3. Taux de Livraison */}
        <Card className="relative overflow-hidden border-sky-200/60 dark:border-sky-900/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Taux de Livraison
            </CardTitle>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <Truck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {kpis.deliveryRate}%
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span className="text-red-500 font-medium mr-1">
                {kpis.returnedCount} retours ({((kpis.returnedCount / (kpis.deliveredCount + kpis.returnedCount || 1)) * 100).toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Commandes en Attente d'Appel (NEW + NO_ANSWER) */}
        <Card className="relative overflow-hidden border-amber-200/60 dark:border-amber-900/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              À Confirmer (Call Center)
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <PhoneForwarded className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {kpis.pendingCallsCount}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Nouvelles + Relances</span>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs text-amber-600 font-semibold">
                <Link href="/orders?status=NEW">
                  Traiter maintenant
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de résumé du workflow des commandes */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entonnoir de Conversion COD
          </h4>
          <span className="text-xs font-medium text-muted-foreground">
            Total {kpis.totalOrders} commandes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <Link
            href="/orders?status=NEW"
            className="group block rounded-lg bg-blue-50/50 p-2.5 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 group-hover:underline">
              Nouvelles
            </span>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {kpis.newCount}
            </div>
          </Link>

          <Link
            href="/orders?status=NO_ANSWER"
            className="group block rounded-lg bg-amber-50/50 p-2.5 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 group-hover:underline">
              Pas de réponse
            </span>
            <div className="text-lg font-bold text-amber-900 dark:text-amber-100">
              {kpis.noAnswerCount}
            </div>
          </Link>

          <Link
            href="/orders?status=CONFIRMED"
            className="group block rounded-lg bg-emerald-50/50 p-2.5 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 group-hover:underline">
              Confirmées
            </span>
            <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              {kpis.confirmedCount}
            </div>
          </Link>

          <Link
            href="/orders?status=SHIPPED"
            className="group block rounded-lg bg-sky-50/50 p-2.5 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 hover:border-sky-300 dark:hover:border-sky-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-sky-700 dark:text-sky-300 group-hover:underline">
              Expédiées
            </span>
            <div className="text-lg font-bold text-sky-900 dark:text-sky-100">
              {kpis.shippedCount}
            </div>
          </Link>

          <Link
            href="/orders?status=DELIVERED"
            className="group block rounded-lg bg-teal-50/50 p-2.5 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 hover:border-teal-300 dark:hover:border-teal-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-teal-700 dark:text-teal-300 group-hover:underline">
              Livrées
            </span>
            <div className="text-lg font-bold text-teal-900 dark:text-teal-100">
              {kpis.deliveredCount}
            </div>
          </Link>

          <Link
            href="/orders?status=RETURNED"
            className="group block rounded-lg bg-red-50/50 p-2.5 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-red-700 dark:text-red-300 group-hover:underline">
              Retours
            </span>
            <div className="text-lg font-bold text-red-900 dark:text-red-100">
              {kpis.returnedCount}
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
