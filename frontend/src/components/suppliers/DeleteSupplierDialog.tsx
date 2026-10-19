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
import { AlertTriangle, Trash2, Loader2, Building2 } from "lucide-react";
import { Supplier } from "@/types";
import { formatPriceMAD } from "@/lib/utils";
import { deleteSupplierAction } from "@/actions/suppliers";

interface DeleteSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierDeleted?: (id: string) => void;
}

export function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSupplierDeleted,
}: DeleteSupplierDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!supplier) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await deleteSupplierAction(supplier.id);
      if (!res.success) {
        setErrorMessage(
          res.error || "Une erreur est survenue lors de la suppression du fournisseur."
        );
        setIsDeleting(false);
        return;
      }

      if (onSupplierDeleted) {
        onSupplierDeleted(supplier.id);
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

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isDeleting) {
        setErrorMessage(null);
        onOpenChange(val);
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Supprimer le Fournisseur</DialogTitle>
              <DialogDescription>
                Retirer définitivement ce fournisseur de votre répertoire.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Suppression impossible</p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-muted border flex items-center justify-center text-muted-foreground shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {supplier.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {supplier.city} &bull; {supplier.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
            <div>
              <span className="text-muted-foreground block">Produits associés :</span>
              <span className="font-bold text-foreground">{supplier.productsCount}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Bons de réception :</span>
              <span className="font-bold text-foreground">{supplier.ordersCount}</span>
            </div>
          </div>
        </div>

        {supplier.balanceDue > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Ce fournisseur a un solde impayé de <strong>{formatPriceMAD(supplier.balanceDue)}</strong>.
            </span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
