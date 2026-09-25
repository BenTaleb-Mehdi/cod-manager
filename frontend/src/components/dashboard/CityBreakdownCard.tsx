"use client";

import React from "react";
import { CityStat } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPriceMAD } from "@/lib/utils";
import { MapPin, TrendingUp } from "lucide-react";

interface CityBreakdownCardProps {
  cities: CityStat[];
}

export function CityBreakdownCard({ cities }: CityBreakdownCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              Performances Régionales (Villes du Maroc)
            </CardTitle>
            <CardDescription className="text-xs">
              Taux de succès de livraison et chiffre d'affaires par agglomération
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cities.map((item) => (
            <div
              key={item.city}
              className="flex items-center justify-between rounded-lg border bg-muted/20 p-2.5 text-xs transition-colors hover:bg-muted/40"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <span>{item.city}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    ({item.totalOrders} commandes)
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Livrés: <strong className="text-emerald-600">{item.deliveredOrders}</strong>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-mono font-bold text-foreground">
                  {formatPriceMAD(item.revenue)}
                </div>
                <div className="flex items-center justify-end gap-1 text-[11px]">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="font-semibold text-emerald-600">
                    {item.deliveryRate}% succès
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
