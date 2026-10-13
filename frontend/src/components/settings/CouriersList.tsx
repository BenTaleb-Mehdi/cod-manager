"use client";

import React, { useState, useEffect } from "react";
import { getCouriersAction, CourierWithStats } from "@/actions/couriers";
import { AddCourierDialog } from "./AddCourierDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, Globe, Shield, Phone, Key, RotateCw } from "lucide-react";
import { formatMoroccanPhone } from "@/lib/utils";

export function CouriersList() {
  const [couriers, setCouriers] = useState<CourierWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCouriers = async () => {
    setIsLoading(true);
    try {
      const res = await getCouriersAction();
      if (res.success && res.data) {
        setCouriers(res.data);
      }
    } catch (e) {
      console.error("Error loading couriers:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            Sociétés de Livraison & Intégrations API
          </CardTitle>
          <CardDescription className="text-xs">
            Gérez vos transporteurs partenaires et configurez les clés API / Webhooks pour la synchronisation automatique des colis.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={fetchCouriers}
            disabled={isLoading}
            className="h-8 w-8"
            title="Rafraîchir"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <AddCourierDialog onSuccess={fetchCouriers} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Société de Livraison</TableHead>
                <TableHead>Contact Téléphonique</TableHead>
                <TableHead>API & Webhook</TableHead>
                <TableHead className="text-center">Colis Traités</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couriers.length > 0 ? (
                couriers.map((courier) => (
                  <TableRow key={courier.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-sky-600" />
                        {courier.name}
                      </div>
                      {courier.apiEndpoint && (
                        <div className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                          {courier.apiEndpoint}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {formatMoroccanPhone(courier.phone)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {courier.apiKey ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Key className="h-3 w-3" />
                            API Active
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] italic">
                            Sans clé API
                          </span>
                        )}
                        {courier.webhookSecret && (
                          <span className="flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200">
                            <Shield className="h-3 w-3" />
                            Webhook
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono font-bold text-foreground">
                      {courier.ordersCount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                    Aucune société de livraison configurée. Cliquez sur "Ajouter Société de Livraison" pour connecter vos transporteurs (ex: Cathedis, Ozone, Sendit).
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
