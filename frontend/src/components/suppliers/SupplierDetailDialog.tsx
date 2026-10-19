"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Phone,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  Loader2,
  FileText,
  Boxes,
} from "lucide-react";
import { Supplier } from "@/types";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { getSupplierDetailAction } from "@/actions/suppliers";

interface SupplierDetailDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailDialog({
  supplier,
  open,
  onOpenChange,
}: SupplierDetailDialogProps) {
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (supplier && open) {
      setIsLoading(true);
      getSupplierDetailAction(supplier.id)
        .then((res) => {
          if (res.success && res.data) {
            setDetailData(res.data);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setDetailData(null);
    }
  }, [supplier, open]);

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl">{supplier.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3" />
                  {formatMoroccanPhone(supplier.phone)}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  {supplier.city}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Métriques clés */}
        <div className="grid grid-cols-3 gap-3 py-2">
          <div className="rounded-lg border bg-muted/20 p-3 text-center">
            <span className="text-[11px] text-muted-foreground uppercase block font-medium">
              Solde Dû
            </span>
            <span
              className={`font-mono text-base font-bold ${
                supplier.balanceDue > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatPriceMAD(supplier.balanceDue)}
            </span>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3 text-center">
            <span className="text-[11px] text-muted-foreground uppercase block font-medium">
              Produits Liés
            </span>
            <span className="font-mono text-base font-bold text-foreground">
              {supplier.productsCount} réf.
            </span>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3 text-center">
            <span className="text-[11px] text-muted-foreground uppercase block font-medium">
              Réceptions
            </span>
            <span className="font-mono text-base font-bold text-foreground">
              {supplier.ordersCount} bons
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Chargement des données détaillées...</span>
          </div>
        ) : (
          <Tabs defaultValue="receipts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receipts" className="text-xs">
                Bons de Réception ({detailData?.supplyOrders?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="products" className="text-xs">
                Produits Liés ({detailData?.products?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Onglet 1 : Bons de réception */}
            <TabsContent value="receipts" className="space-y-3 pt-3">
              {detailData?.supplyOrders && detailData.supplyOrders.length > 0 ? (
                detailData.supplyOrders.map((so: any) => (
                  <div
                    key={so.id}
                    className="rounded-lg border bg-card p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {new Date(so.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {so.status}
                        </Badge>
                      </div>
                      <span className="font-mono font-bold text-sm text-foreground">
                        {formatPriceMAD(so.totalAmount)}
                      </span>
                    </div>

                    {so.note && (
                      <p className="text-[11px] text-muted-foreground italic">
                        Note: {so.note}
                      </p>
                    )}

                    {/* Liste des items reçus */}
                    <div className="border-t pt-2 space-y-1">
                      {so.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-muted-foreground"
                        >
                          <span className="truncate max-w-[280px]">
                            {item.quantity}x {item.productName} ({item.productSku})
                          </span>
                          <span className="font-mono text-foreground font-medium">
                            {formatPriceMAD(item.totalCost)} ({formatPriceMAD(item.unitCost)} / u)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  Aucun bon de réception enregistré pour ce fournisseur.
                </div>
              )}
            </TabsContent>

            {/* Onglet 2 : Produits liés */}
            <TabsContent value="products" className="space-y-2 pt-3">
              {detailData?.products && detailData.products.length > 0 ? (
                detailData.products.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-8 w-8 rounded object-cover border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted border flex items-center justify-center text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-foreground truncate">{p.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-right">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Achat</span>
                        <span className="font-semibold">{formatPriceMAD(p.costPrice)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Stock</span>
                        <span className="font-bold">{p.stock} u.</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  Aucun produit spécifiquement rattaché à ce fournisseur.
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
