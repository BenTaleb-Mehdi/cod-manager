"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  Tag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Coins,
  Pencil,
  RotateCcw,
  Calendar,
  User,
  MapPin,
  ExternalLink,
  Power,
  Loader2,
} from "lucide-react";
import { Product } from "@/types";
import { formatPriceMAD, formatMoroccanDate } from "@/lib/utils";
import { getProductDetailAction, toggleProductActiveAction } from "@/actions/inventory";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProduct?: (product: Product) => void;
  onQuickStock?: (product: Product) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
}

export function ProductDetailDialog({
  product: initialProduct,
  open,
  onOpenChange,
  onEditProduct,
  onQuickStock,
  onProductUpdated,
}: ProductDetailDialogProps) {
  const [productData, setProductData] = useState<any>(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    if (initialProduct && open) {
      setProductData(initialProduct);
      setIsLoading(true);
      getProductDetailAction(initialProduct.id)
        .then((res) => {
          if (res.success && res.data) {
            setProductData(res.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialProduct, open]);

  if (!productData) return null;

  const cost = productData.costPrice || 0;
  const sale = productData.salePrice || 0;
  const stock = productData.stock || 0;
  const threshold = productData.lowStockThreshold ?? 5;
  const isActive = productData.isActive !== false;

  const marginUnit = sale - cost;
  const marginPercent = sale > 0 ? ((marginUnit / sale) * 100).toFixed(1) : "0";
  const stockValuation = stock * cost;
  const potentialRevenue = stock * sale;

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= threshold;

  const handleToggleActive = async () => {
    if (!productData) return;
    setIsTogglingStatus(true);
    const newStatus = !isActive;
    const res = await toggleProductActiveAction(productData.id, newStatus);
    setIsTogglingStatus(false);
    if (res.success && res.data) {
      const updated = {
        ...productData,
        ...res.data,
      };
      setProductData(updated);
      if (onProductUpdated) {
        onProductUpdated(updated);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        {/* En-tête avec bannière */}
        <div className="relative bg-gradient-to-r from-muted/50 via-muted/30 to-background border-b p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 select-all">
                  {productData.sku}
                </span>
                {productData.category && (
                  <Badge variant="outline" className="text-xs">
                    {productData.category.name}
                  </Badge>
                )}
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-zinc-500/15 text-muted-foreground border-zinc-500/30"
                  }
                >
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                    }`}
                  />
                  {isActive ? "Actif (En vente)" : "Inactif"}
                </Badge>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {productData.name}
              </DialogTitle>
              {productData.description && (
                <DialogDescription className="text-sm text-muted-foreground line-clamp-2">
                  {productData.description}
                </DialogDescription>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isTogglingStatus}
              onClick={handleToggleActive}
              className={`shrink-0 transition-colors ${
                isActive
                  ? "hover:bg-destructive/10 hover:text-destructive border-dashed"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
              }`}
            >
              {isTogglingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Power className="h-4 w-4 mr-1.5" />
              )}
              {isActive ? "Désactiver le produit" : "Activer le produit"}
            </Button>
          </div>
        </div>

        {/* Corps principal */}
        <div className="p-6 space-y-6">
          {/* Section 1 : Visuel & Tarifs / Stock */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Produit */}
            <div className="md:col-span-4 rounded-xl border bg-card p-3 flex flex-col items-center justify-center">
              {productData.imageUrl ? (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border bg-muted/20">
                  <img
                    src={productData.imageUrl}
                    alt={productData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full rounded-lg border border-dashed flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-4 text-center">
                  <Package className="h-10 w-10 stroke-[1.25] mb-2 opacity-60" />
                  <span className="text-xs">Aucune image disponible</span>
                </div>
              )}

              {/* État du stock */}
              <div className="w-full mt-3 pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Statut stock :</span>
                {isOutOfStock ? (
                  <Badge variant="destructive" className="font-medium text-[11px]">
                    <XCircle className="h-3 w-3 mr-1" /> Rupture de Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px]">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" /> Stock Faible (≤ {threshold})
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[11px]">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> En Stock ({stock})
                  </Badge>
                )}
              </div>
            </div>

            {/* Statistiques Financières & Stock */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Prix de vente */}
                <div className="rounded-xl border bg-card p-3.5 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Prix de Vente
                  </span>
                  <div className="text-lg font-bold font-mono text-foreground">
                    {formatPriceMAD(sale)}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Prix catalogue public</span>
                </div>

                {/* Prix d'achat */}
                <div className="rounded-xl border bg-card p-3.5 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Prix d'Achat
                  </span>
                  <div className="text-lg font-bold font-mono text-muted-foreground">
                    {formatPriceMAD(cost)}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Coût d'approvisionnement</span>
                </div>

                {/* Marge unitaire */}
                <div className="rounded-xl border bg-emerald-500/5 border-emerald-500/20 p-3.5 space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Marge Brute
                    </span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                    +{formatPriceMAD(marginUnit)}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {marginPercent}% de rentabilité
                  </span>
                </div>
              </div>

              {/* Ligne 2 : Stock & Capital immobilisé */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border bg-card p-3.5 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Stock Actuel
                  </span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {stock} <span className="text-xs font-normal text-muted-foreground">unités</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Seuil alerte : <span className="font-semibold">{threshold} pcs</span>
                  </span>
                </div>

                <div className="rounded-xl border bg-card p-3.5 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Capital Immobilisé
                  </span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {formatPriceMAD(stockValuation)}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Coût total en stock</span>
                </div>

                <div className="rounded-xl border bg-card p-3.5 space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    CA Potentiel Stock
                  </span>
                  <div className="text-xl font-bold font-mono text-primary">
                    {formatPriceMAD(potentialRevenue)}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Vente totale du stock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Ventes & Commandes récentes */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="border-b px-4 py-3 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Performance Commerciale
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">
                  Commandes : <strong className="text-foreground">{productData.ordersCount ?? 0}</strong>
                </span>
                <span className="text-muted-foreground">
                  Unités vendues : <strong className="text-emerald-600 dark:text-emerald-400">{productData.totalUnitsSold ?? 0}</strong>
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Chargement de l'historique...</span>
              </div>
            ) : productData.recentOrders && productData.recentOrders.length > 0 ? (
              <div className="divide-y max-h-56 overflow-y-auto">
                {productData.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-foreground">
                        {order.trackingNumber}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.customerName}
                      </span>
                      {order.city && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.city}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatMoroccanDate(order.createdAt)}
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {order.quantity} unité{order.quantity > 1 ? "s" : ""}
                      </Badge>
                      <span className="font-mono font-bold text-foreground">
                        {formatPriceMAD(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Aucune commande enregistrée pour ce produit pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Pied de page avec actions rapides */}
        <div className="border-t bg-muted/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Dernière mise à jour : {formatMoroccanDate(productData.updatedAt || new Date())}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onQuickStock && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onQuickStock(productData);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Ajuster Stock
              </Button>
            )}

            {onEditProduct && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEditProduct(productData);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Modifier
              </Button>
            )}

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
