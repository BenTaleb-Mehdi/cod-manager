"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsResponse } from "@/actions/analytics";
import { formatPriceMAD } from "@/lib/utils";
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Truck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  DollarSign,
  PackageCheck,
  RotateCcw,
  MapPin,
  Percent,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
} from "lucide-react";
import Link from "next/link";

interface OrdersAnalyticsSpaceProps {
  data: AnalyticsResponse["kpis"];
  cities: AnalyticsResponse["cities"];
}

export function OrdersAnalyticsSpace({ data, cities }: OrdersAnalyticsSpaceProps) {
  const [cityFilter, setCityFilter] = useState<string>("ALL");

  const totalOrders = data.totalOrders || 0;
  const countNew = data.countNew || 0;
  const countNoAnswer = data.countNoAnswer || 0;
  const countConfirmed = data.countConfirmed || 0;
  const countShipped = data.countShipped || 0;
  const countDelivered = data.countDelivered || 0;
  const countReturned = data.countReturned || 0;
  const countCancelled = data.countCancelled || 0;

  // Calcul du panier moyen (AOV)
  const averageOrderValue =
    countDelivered > 0 ? (data.totalRevenue / countDelivered) : 0;

  const filteredCities =
    cityFilter === "ALL"
      ? cities
      : cities.filter((c) => c.city.toLowerCase() === cityFilter.toLowerCase());

  // Villes avec un taux de livraison solide (>= 75%)
  const topCities = [...cities].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      {/* 1. Métriques Financières & Rentabilité COD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'Affaires Encaissé */}
        <Card className="shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              CA Encaissé (Livrées)
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatPriceMAD(data.totalRevenue)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{countDelivered} colis encaissés</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Panier : {formatPriceMAD(averageOrderValue)}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* CA Potentiel en cours */}
        <Card className="shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              CA Potentiel (Pipeline)
            </CardTitle>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
              {formatPriceMAD(data.potentialRevenue)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Confirmées + Expédiées + Livrées
            </p>
          </CardContent>
        </Card>

        {/* Coût des Marchandises (COGS) */}
        <Card className="shadow-xs hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Coût d'Achat Produits (COGS)
            </CardTitle>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <PackageCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatPriceMAD(data.totalCostPrice)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Prix de revient des articles livrés
            </p>
          </CardContent>
        </Card>

        {/* Marge Nette & Bénéfice */}
        <Card className="shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Bénéfice Brut & Marge
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {formatPriceMAD(data.netProfit)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Marge Réalisée</span>
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                {data.netMarginPercentage}%
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Funnel de Conversion COD Marocain */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Entonnoir de Conversion COD (Taux Clés)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Indicateurs vitaux pour piloter vos confirmations d'agents et le suivi des livreurs
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Total {totalOrders} commandes
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Taux de Confirmation */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Taux de Confirmation</span>
                <PhoneCall className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {data.confirmationRate}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(data.confirmationRate, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {countConfirmed + countShipped + countDelivered + countReturned} validées sur {totalOrders}
              </p>
            </div>

            {/* Taux de Livraison */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Taux de Livraison (Delivered)</span>
                <Truck className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {data.deliveryRate}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(data.deliveryRate, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {countDelivered} livrées sur {countDelivered + countReturned + countShipped} expédiées
              </p>
            </div>

            {/* Taux de Retour */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Taux de Retour</span>
                <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {data.returnRate}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(data.returnRate, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {countReturned} colis retournés au stock
              </p>
            </div>

            {/* Taux d'Annulation */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Taux d'Annulation</span>
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {data.cancellationRate}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(data.cancellationRate, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {countCancelled} commandes annulées
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Répartition Complète du Pipeline des Commandes */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span>Répartition par Statut de Commande</span>
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-primary gap-1">
              <Link href="/orders">
                Gérer les commandes
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Nouveau */}
            <div className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-center">
              <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">Nouvelle</span>
              <div className="text-xl font-bold font-mono text-blue-800 dark:text-blue-200 my-0.5">
                {countNew}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countNew / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Sans Réponse */}
            <div className="p-3 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-center">
              <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Pas de rép.</span>
              <div className="text-xl font-bold font-mono text-amber-800 dark:text-amber-200 my-0.5">
                {countNoAnswer}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countNoAnswer / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Confirmée */}
            <div className="p-3 rounded-lg border bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-center">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">Confirmée</span>
              <div className="text-xl font-bold font-mono text-indigo-800 dark:text-indigo-200 my-0.5">
                {countConfirmed}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countConfirmed / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Expédiée */}
            <div className="p-3 rounded-lg border bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40 text-center">
              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">Expédiée</span>
              <div className="text-xl font-bold font-mono text-purple-800 dark:text-purple-200 my-0.5">
                {countShipped}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countShipped / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Livrée */}
            <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-center">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Livrée</span>
              <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-200 my-0.5">
                {countDelivered}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countDelivered / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Retournée */}
            <div className="p-3 rounded-lg border bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 text-center">
              <span className="text-[11px] text-orange-700 dark:text-orange-300 font-medium">Retournée</span>
              <div className="text-xl font-bold font-mono text-orange-800 dark:text-orange-200 my-0.5">
                {countReturned}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countReturned / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Annulée */}
            <div className="p-3 rounded-lg border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-center">
              <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">Annulée</span>
              <div className="text-xl font-bold font-mono text-rose-800 dark:text-rose-200 my-0.5">
                {countCancelled}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {totalOrders > 0 ? ((countCancelled / totalOrders) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Performances Régionales par Ville Marocaine */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Performances par Ville (Taux de Réussite & Revenus)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Classement par chiffre d'affaires généré et taux de livraison dans chaque région
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono self-start sm:self-center">
              {cities.length} villes actives
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[10px] border-b">
                <tr>
                  <th className="py-3 px-4">Ville</th>
                  <th className="py-3 px-4 text-center">Total Commandes</th>
                  <th className="py-3 px-4 text-center">Livrées</th>
                  <th className="py-3 px-4 text-center">Taux Livraison</th>
                  <th className="py-3 px-4 text-right">CA Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topCities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Aucune donnée de commande par ville disponible pour le moment.
                    </td>
                  </tr>
                ) : (
                  topCities.map((c, i) => (
                    <tr key={c.city} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <span className="text-muted-foreground font-mono text-[10px]">#{i + 1}</span>
                        <span>{c.city}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {c.totalOrders}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-emerald-600 font-semibold">
                        {c.deliveredOrders}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${
                            c.deliveryRate >= 70
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : c.deliveryRate >= 50
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                          }`}
                        >
                          {c.deliveryRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                        {formatPriceMAD(c.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
