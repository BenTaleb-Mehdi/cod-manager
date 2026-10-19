"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2, Package, Boxes, ShieldAlert } from "lucide-react";
import { Product } from "@/types";
import { deleteProductAction, adjustProductStockAction } from "@/actions/inventory";

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductDeleted?: (id: string) => void;
  onProductUpdated?: (updated: Product) => void;
}

export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onProductDeleted,
  onProductUpdated,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingStock, setIsResettingStock] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canForce, setCanForce] = useState(false);

  const handleDelete = async (force: boolean = false) => {
    if (!product) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await deleteProductAction(product.id, force);
      if (!res.success) {
        setErrorMessage(
          res.error || "Une erreur est survenue lors de la suppression du produit."
        );
        // Activer l'option de suppression forcée si des commandes/réceptions bloquent
        setCanForce(true);
        setIsDeleting(false);
        return;
      }

      if (onProductDeleted) {
        onProductDeleted(product.id);
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erreur imprévue lors de la suppression."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleZeroStock = async () => {
    if (!product) return;
    setIsResettingStock(true);
    try {
      const res = await adjustProductStockAction(product.id, 0);
      if (res.success && res.data) {
        if (onProductUpdated) {
          onProductUpdated({ ...product, stock: 0 });
        }
        onOpenChange(false);
      } else {
        setErrorMessage(res.error || "Impossible de réinitialiser le stock.");
      }
    } catch (err) {
      setErrorMessage("Erreur lors de la mise à zéro du stock.");
    } finally {
      setIsResettingStock(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isDeleting && !isResettingStock) {
          setErrorMessage(null);
          setCanForce(false);
          onOpenChange(val);
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Supprimer le Produit</DialogTitle>
              <DialogDescription>
                Retirer définitivement « {product.name} » du catalogue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Suppression avec historique existant</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            {/* Boutons d'action rapides pour résoudre le blocage */}
            <div className="flex flex-col gap-2 pt-1 border-t border-destructive/20">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(true)}
                disabled={isDeleting}
                className="w-full gap-2 text-xs h-8"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Suppression forcée...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Forcer la suppression (nettoyer les données liées)
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZeroStock}
                disabled={isResettingStock}
                className="w-full gap-2 text-xs h-8 text-foreground"
              >
                {isResettingStock ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Mise à 0 du stock...
                  </>
                ) : (
                  <>
                    <Boxes className="h-3.5 w-3.5" />
                    Passer le stock à 0 (Garder l'historique)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-2.5">
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-10 w-10 rounded-md object-cover border bg-background shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-muted border flex items-center justify-center text-muted-foreground shrink-0">
                <Package className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {product.name}
              </h4>
              <p className="text-xs font-mono text-muted-foreground">
                SKU: {product.sku}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span>Stock physique actuel :</span>
            <span className="font-bold text-foreground">
              {product.stock} unité(s)
            </span>
          </div>
        </div>

        {!errorMessage && product.stock > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Ce produit a encore <strong>{product.stock}</strong> unité(s) en stock physique.
            </span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting || isResettingStock}
          >
            Annuler
          </Button>

          {!canForce && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDelete(false)}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Confirmer la suppression
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
