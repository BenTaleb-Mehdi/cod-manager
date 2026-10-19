"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Plus, Minus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Product } from "@/types";
import { adjustProductStockAction } from "@/actions/inventory";

interface QuickStockDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStockUpdated?: (updatedProduct: Product) => void;
}

export function QuickStockDialog({
  product,
  open,
  onOpenChange,
  onStockUpdated,
}: QuickStockDialogProps) {
  const [currentStock, setCurrentStock] = useState(0);
  const [adjustmentMode, setAdjustmentMode] = useState<"add" | "set">("add");
  const [quantityValue, setQuantityValue] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product && open) {
      setCurrentStock(product.stock);
      setAdjustmentMode("add");
      setQuantityValue(10);
      setErrorMsg(null);
    }
  }, [product, open]);

  if (!product) return null;

  const targetStock =
    adjustmentMode === "add" ? currentStock + quantityValue : quantityValue;

  const handleApply = async () => {
    if (targetStock < 0) {
      setErrorMsg("Le stock final ne peut pas être inférieur à 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await adjustProductStockAction(product.id, targetStock);
      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Erreur lors de la mise à jour du stock.");
        setIsSubmitting(false);
        return;
      }

      if (onStockUpdated) {
        onStockUpdated({
          ...product,
          stock: targetStock,
        });
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Ajustement Rapide du Stock</DialogTitle>
              <DialogDescription>
                Mise à jour rapide des unités disponibles pour « {product.name} ».
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* État actuel du produit */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm">
            <div>
              <p className="font-semibold text-foreground">{product.name}</p>
              <p className="text-xs font-mono text-muted-foreground">
                SKU: {product.sku}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Stock actuel</span>
              <span className="font-mono text-lg font-bold text-foreground">
                {currentStock}
              </span>
            </div>
          </div>

          {/* Mode d'ajustement */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={adjustmentMode === "add" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAdjustmentMode("add");
                setQuantityValue(10);
              }}
              className="text-xs"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter / Déduire
            </Button>
            <Button
              type="button"
              variant={adjustmentMode === "set" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAdjustmentMode("set");
                setQuantityValue(currentStock);
              }}
              className="text-xs"
            >
              Définir quantité exacte
            </Button>
          </div>

          {adjustmentMode === "add" ? (
            <div className="space-y-3">
              <Label className="text-xs font-semibold">
                Quantité à ajouter (ou valeur négative pour déduire)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantityValue((prev) => prev - 5)}
                  className="h-9 w-9 shrink-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(parseInt(e.target.value) || 0)}
                  className="text-center font-mono font-bold text-base"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantityValue((prev) => prev + 5)}
                  className="h-9 w-9 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Raccourcis rapides */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[5, 10, 20, 50, 100].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs px-2.5 font-mono"
                    onClick={() => setQuantityValue(num)}
                  >
                    +{num}
                  </Button>
                ))}
                {[-5, -10].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 font-mono text-muted-foreground"
                    onClick={() => setQuantityValue(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nouveau stock total</Label>
              <Input
                type="number"
                min="0"
                value={quantityValue}
                onChange={(e) =>
                  setQuantityValue(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="text-center font-mono font-bold text-lg"
              />
            </div>
          )}

          {/* Prévisualisation résultat */}
          <div className="flex items-center justify-between rounded-lg border border-dashed px-3 py-2 text-xs">
            <span className="text-muted-foreground">Nouveau stock calculé :</span>
            <span
              className={`font-mono font-bold text-sm ${
                targetStock <= 5 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {targetStock} unités
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={isSubmitting || targetStock < 0}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Application...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Valider le stock
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
