"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PackageCheck,
  Plus,
  Trash2,
  Loader2,
  Building2,
  ArrowRight,
  AlertCircle,
  Package,
} from "lucide-react";
import { Supplier, Product, Category } from "@/types";
import { formatPriceMAD } from "@/lib/utils";
import { receiveSupplyOrderAction } from "@/actions/suppliers";
import { getInventoryAction } from "@/actions/inventory";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StockItemRow {
  productId: string;
  quantity: number | "";
  unitCost: number | "";
}

interface ReceiveStockDialogProps {
  suppliers: Supplier[];
  products: Product[];
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ReceiveStockDialog({
  suppliers,
  products: initialProducts,
  trigger,
  onSuccess,
}: ReceiveStockDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [items, setItems] = useState<StockItemRow[]>([
    {
      productId: "",
      quantity: 10,
      unitCost: 50,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Synchroniser ou recharger les produits et le fournisseur sélectionné lors de l'ouverture
  useEffect(() => {
    if (open) {
      setError(null);
      if (suppliers.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(suppliers[0].id);
      }

      setIsLoadingProducts(true);
      getInventoryAction()
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.categories) {
              setCategories(res.data.categories);
            }
            const list = res.data.products || [];
            setProducts(list);
            if (list.length > 0) {
              setItems((prev) =>
                prev.map((it, idx) => {
                  const fallbackProduct = list[idx % list.length] || list[0];
                  return {
                    ...it,
                    productId: it.productId || fallbackProduct.id,
                    unitCost:
                      it.unitCost !== "" && Number(it.unitCost) > 0
                        ? it.unitCost
                        : Number(fallbackProduct.costPrice) || 50,
                  };
                })
              );
            }
          }
        })
        .catch((e) => console.error("Error fetching inventory products:", e))
        .finally(() => setIsLoadingProducts(false));
    }
  }, [open]);

  // Ajouter une nouvelle ligne d'article
  const handleAddItem = () => {
    // Proposer le premier produit non encore présent dans la liste
    const unusedProduct =
      products.find((p) => !items.some((it) => it.productId === p.id)) ||
      products[0];

    setItems((prev) => [
      ...prev,
      {
        productId: unusedProduct ? unusedProduct.id : "",
        quantity: 10,
        unitCost: unusedProduct ? Number(unusedProduct.costPrice) || 50 : 50,
      },
    ]);
  };

  // Supprimer une ligne
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Changement de produit
  const handleProductChange = (index: number, productId: string) => {
    const selectedProd = products.find((p) => p.id === productId);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          productId,
          unitCost: selectedProd ? Number(selectedProd.costPrice) : item.unitCost,
        };
      })
    );
  };

  // Changement de quantité
  const handleQuantityChange = (index: number, rawVal: string) => {
    const val = rawVal === "" ? "" : Math.max(1, parseInt(rawVal, 10) || 1);
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: val } : item))
    );
  };

  // Changement de coût unitaire
  const handleUnitCostChange = (index: number, rawVal: string) => {
    const val = rawVal === "" ? "" : Math.max(0, parseFloat(rawVal) || 0);
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, unitCost: val } : item))
    );
  };

  // Calcul du montant total
  const totalCalculated = items.reduce((sum, item) => {
    const q = typeof item.quantity === "number" ? item.quantity : 0;
    const c = typeof item.unitCost === "number" ? item.unitCost : 0;
    return sum + q * c;
  }, 0);

  const totalUnits = items.reduce((sum, item) => {
    const q = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + q;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedSupplierId) {
      setError("Veuillez sélectionner un fournisseur.");
      return;
    }

    if (items.length === 0) {
      setError("Veuillez ajouter au moins un produit à réceptionner.");
      return;
    }

    // Validation des lignes
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.productId) {
        setError(`Veuillez sélectionner un produit pour la ligne #${i + 1}.`);
        return;
      }
      if (typeof it.quantity !== "number" || it.quantity <= 0) {
        setError(`La quantité de la ligne #${i + 1} doit être supérieure à 0.`);
        return;
      }
      if (typeof it.unitCost !== "number" || it.unitCost <= 0) {
        setError(`Le coût unitaire de la ligne #${i + 1} doit être supérieur à 0.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await receiveSupplyOrderAction({
        supplierId: selectedSupplierId,
        note: note.trim() || undefined,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity as number,
          unitCost: it.unitCost as number,
        })),
      });

      if (res.success) {
        setOpen(false);
        setNote("");
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        setError(res.error || "Erreur lors de la réception des stocks.");
      }
    } catch (e: unknown) {
      console.error("Error receiving stock:", e);
      setError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
            <PackageCheck className="h-4 w-4" />
            <span>Réceptionner Stock</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="p-5 border-b bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <PackageCheck className="h-5 w-5 text-emerald-600" />
                Bon d'Entrée Stock (Réception Marchandise)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Incrémente directement vos stocks physiques et met à jour automatiquement la dette due au fournisseur.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Sélection Fournisseur & N° Bon de Livraison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="supplier-select">Fournisseur Partenaire *</Label>
                <Select
                  value={selectedSupplierId}
                  onValueChange={setSelectedSupplierId}
                >
                  <SelectTrigger id="supplier-select" className="h-9">
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note-input">Référence / N° Bon de Livraison (BL)</Label>
                <Input
                  id="note-input"
                  placeholder="Ex: BL-2026-0922 ou Facture Fournisseur"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Section Articles Réceptionnés */}
            <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between pb-1 border-b">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-foreground text-xs uppercase tracking-wide">
                    Articles Réceptionnés ({items.length})
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter Ligne
                </Button>
              </div>

              {isLoadingProducts ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span>Chargement de vos produits d&apos;inventaire...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">Aucun produit dans votre catalogue</p>
                    <p className="text-muted-foreground text-[11px]">
                      Pour réceptionner du stock et facturer un fournisseur, vous devez d&apos;abord créer vos produits dans la section Inventaire.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AddProductDialog
                      categories={categories}
                      onProductCreated={(newProd) => {
                        setProducts((prev) => [newProd, ...prev]);
                        setItems([
                          {
                            productId: newProd.id,
                            quantity: 10,
                            unitCost: Number(newProd.costPrice) || 50,
                          },
                        ]);
                      }}
                      trigger={
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Créer Produit Directement
                        </Button>
                      }
                    />
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link href="/inventory">Aller à l&apos;Inventaire</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* En-tête des colonnes */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted-foreground uppercase px-2">
                    <div className="col-span-5">Produit & Référence SKU</div>
                    <div className="col-span-2 text-center">Quantité Reçue</div>
                    <div className="col-span-2 text-right">Prix Achat (DH)</div>
                    <div className="col-span-2 text-right">Sous-Total</div>
                    <div className="col-span-1 text-center"></div>
                  </div>

                  {/* Lignes d'articles */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {items.map((item, idx) => {
                      const selectedProd = products.find((p) => p.id === item.productId);
                      const currentStock = selectedProd ? selectedProd.stock : 0;
                      const qty = typeof item.quantity === "number" ? item.quantity : 0;
                      const cost = typeof item.unitCost === "number" ? item.unitCost : 0;
                      const lineSubtotal = qty * cost;
                      const projectedStock = currentStock + qty;

                      return (
                        <div
                          key={idx}
                          className="rounded-lg border bg-muted/20 p-2.5 space-y-2 sm:space-y-0"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            {/* Produit */}
                            <div className="sm:col-span-5 space-y-1">
                              <span className="sm:hidden text-[10px] text-muted-foreground font-semibold block">
                                Produit #{idx + 1}
                              </span>
                              <Select
                                value={item.productId}
                                onValueChange={(val) => handleProductChange(idx, val)}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="Sélectionner un produit" />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                  {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      <div className="flex items-center justify-between w-full gap-2">
                                        <span className="font-medium truncate max-w-[200px]">
                                          {p.name}
                                        </span>
                                        <span className="font-mono text-muted-foreground text-[11px]">
                                          ({p.sku})
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Quantité */}
                            <div className="sm:col-span-2 space-y-1">
                              <span className="sm:hidden text-[10px] text-muted-foreground font-semibold block">
                                Quantité
                              </span>
                              <Input
                                type="number"
                                min="1"
                                className="h-9 text-xs font-mono text-center"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                placeholder="Qté"
                              />
                            </div>

                            {/* Coût unitaire */}
                            <div className="sm:col-span-2 space-y-1">
                              <span className="sm:hidden text-[10px] text-muted-foreground font-semibold block">
                                Prix Achat (DH)
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="h-9 text-xs font-mono text-right"
                                value={item.unitCost}
                                onChange={(e) => handleUnitCostChange(idx, e.target.value)}
                                placeholder="DH"
                              />
                            </div>

                            {/* Sous-total */}
                            <div className="sm:col-span-2 text-right">
                              <span className="sm:hidden text-[10px] text-muted-foreground block">
                                Sous-total :
                              </span>
                              <span className="font-mono font-bold text-xs text-foreground">
                                {formatPriceMAD(lineSubtotal)}
                              </span>
                            </div>

                            {/* Bouton Supprimer */}
                            <div className="sm:col-span-1 flex items-center justify-end sm:justify-center">
                              {items.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                                  title="Supprimer la ligne"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Impact Stock en direct */}
                          {selectedProd && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-muted/40">
                              <span>Stock actuel : <strong>{currentStock}</strong></span>
                              <ArrowRight className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Nouveau stock après réception : {projectedStock} unités (+{qty})
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total & Récapitulatif */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 block">
                    Montant Total de la Réception (Dette Fournisseur)
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    {totalUnits} unité(s) au total • Stocks incrémentés automatiquement
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-lg text-emerald-700 dark:text-emerald-300">
                    {formatPriceMAD(totalCalculated)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || products.length === 0}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="h-4 w-4" />
                  <span>Valider la Réception (+ Stock)</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
