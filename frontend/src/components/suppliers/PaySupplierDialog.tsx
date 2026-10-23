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
import { DollarSign, CheckCircle2, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { Supplier } from "@/types";
import { formatPriceMAD } from "@/lib/utils";
import { paySupplierAction } from "@/actions/suppliers";

interface PaySupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: (updatedSupplier: Supplier) => void;
}

export function PaySupplierDialog({
  supplier,
  open,
  onOpenChange,
  onPaymentSuccess,
}: PaySupplierDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (supplier && open) {
      setAmount(supplier.balanceDue > 0 ? supplier.balanceDue : 0);
      setNote("");
      setErrorMsg(null);
    }
  }, [supplier, open]);

  if (!supplier) return null;

  const currentBalance = supplier.balanceDue;
  const remainingBalance = Math.max(0, currentBalance - (amount || 0));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg("Veuillez saisir un montant supérieur à 0 DH.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await paySupplierAction(supplier.id, {
        amount,
        note: note.trim() || undefined,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Erreur lors de l'enregistrement du règlement.");
        setIsSubmitting(false);
        return;
      }

      if (onPaymentSuccess) {
        onPaymentSuccess({
          ...supplier,
          balanceDue: res.data.balanceDue,
        });
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur imprévue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Règlement Fournisseur</DialogTitle>
              <DialogDescription>
                Enregistrer un paiement pour déduire la dette de « {supplier.name} ».
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

        <form onSubmit={handlePay} className="space-y-4 py-2">
          {/* Carte récapitulative de la dette */}
          <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Fournisseur :</span>
              <span className="font-semibold text-foreground">{supplier.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Dette actuelle (Solde Dû) :</span>
              <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                {formatPriceMAD(currentBalance)}
              </span>
            </div>
          </div>

          {/* Saisie du montant et boutons de presets */}
          <div className="space-y-2">
            <Label htmlFor="pay-amount" className="text-xs font-semibold">
              Montant du Règlement (DH) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pay-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="font-mono text-base font-bold"
              placeholder="0.00"
              required
            />

            {/* Raccourcis de montant */}
            {currentBalance > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => setAmount(currentBalance)}
                >
                  Régler la totalité ({formatPriceMAD(currentBalance)})
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() => setAmount(Math.round((currentBalance / 2) * 100) / 100)}
                >
                  50%
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay-note" className="text-xs font-semibold">
              Mode ou Référence de Paiement (Optionnel)
            </Label>
            <Input
              id="pay-note"
              placeholder="Ex: Virement bancaire, Espèces, Chèque N°..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Prévisualisation solde restant */}
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-xs">
            <span className="text-muted-foreground">Solde restant après règlement :</span>
            <span
              className={`font-mono font-bold ${
                remainingBalance === 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {formatPriceMAD(remainingBalance)}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Valider le règlement
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
