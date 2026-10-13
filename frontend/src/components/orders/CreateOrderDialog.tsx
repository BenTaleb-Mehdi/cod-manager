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
  Plus,
  Trash2,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { createOrderAction } from "@/actions/orders";
import { getInventoryAction } from "@/actions/inventory";
import { Product } from "@/types";
import { MOROCCAN_CITIES } from "@/lib/moroccan-data";
import { formatPriceMAD } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OrderItemRow {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateOrderDialog({ onSuccess, trigger }: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [shippingNote, setShippingNote] = useState("");

  // Items State (au moins 1 article par défaut)
  const [items, setItems] = useState<OrderItemRow[]>([
    { productId: "", quantity: 1, price: 0 },
  ]);

  // Charger les produits de l'inventaire quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      setError(null);
      setIsLoadingProducts(true);
      getInventoryAction()
        .then((res) => {
          if (res.success && res.data?.products) {
            setProducts(res.data.products);
            // Si le premier item n'a pas encore de produit sélectionné, on lui pré-sélectionne le premier disponible
            if (items[0]?.productId === "" && res.data.products.length > 0) {
              const first = res.data.products[0];
              setItems([
                {
                  productId: first.id,
                  quantity: 1,
                  price: Number(first.salePrice),
                },
              ]);
            }
          }
        })
        .catch((err) => {
          console.error("Erreur chargement produits:", err);
        })
        .finally(() => {
          setIsLoadingProducts(false);
        });
    }
  }, [open]);

  // Gérer la sélection de produit
  const handleProductSelect = (index: number, selectedId: string) => {
    const p = products.find((prod) => prod.id === selectedId);
    if (!p) return;

    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        productId: p.id,
        quantity: next[index]?.quantity || 1,
        price: Number(p.salePrice),
      };
      return next;
    });
  };

  // Gérer le changement de quantité
  const handleQuantityChange = (index: number, qty: number) => {
    const val = Math.max(1, qty);
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: val };
      return next;
    });
  };

  // Gérer le changement de prix (remise personnalisée)
  const handlePriceChange = (index: number, price: number) => {
    const val = Math.max(0, price);
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], price: val };
      return next;
    });
  };

  // Ajouter un nouvel article
  const handleAddItem = () => {
    const available = products.find(
      (p) => !items.some((item) => item.productId === p.id)
    ) || products[0];

    if (available) {
      setItems((prev) => [
        ...prev,
        {
          productId: available.id,
          quantity: 1,
          price: Number(available.salePrice),
        },
      ]);
    } else {
      setItems((prev) => [
        ...prev,
        { productId: "", quantity: 1, price: 0 },
      ]);
    }
  };

  // Supprimer un article
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calcul du montant total
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.quantity * item.price || 0),
    0
  );

  const resetForm = () => {
    setCustomerName("");
    setPhone("");
    setCity("Casablanca");
    setAddress("");
    setShippingNote("");
    setItems([{ productId: products[0]?.id || "", quantity: 1, price: Number(products[0]?.salePrice || 0) }]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError("Veuillez saisir le nom complet du client.");
      return;
    }

    const cleanPhone = phone.replace(/[\s.-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      setError("Veuillez saisir un numéro de téléphone valide (ex: 0612345678).");
      return;
    }

    if (!address.trim()) {
      setError("Veuillez saisir l'adresse de livraison complète.");
      return;
    }

    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      setError("Veuillez ajouter au moins un produit avec une quantité valide.");
      return;
    }

    // Vérifier les stocks par rapport aux produits chargés
    for (const item of validItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stock < item.quantity) {
        setError(
          `Stock insuffisant pour "${prod.name}" (Stock dispo : ${prod.stock}, demandé : ${item.quantity}).`
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await createOrderAction({
        customerName: customerName.trim(),
        phone: cleanPhone,
        city: city.trim(),
        address: address.trim(),
        shippingNote: shippingNote.trim() || undefined,
        items: validItems.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
        })),
      });

      if (res.success) {
        setOpen(false);
        resetForm();
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        setError(res.error || "Une erreur est survenue lors de la création de la commande.");
      }
    } catch (err: unknown) {
      console.error("Create order error:", err);
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-9 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nouvelle Commande</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="p-5 border-b bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                Créer une Commande Manuelle (Call Center / WhatsApp)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Saisissez les coordonnées du destinataire et composez le panier avec décrémentation automatique des stocks.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 space-y-5 text-xs">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1 : Coordonnées Destinataire */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                Informations Destinataire
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName">Nom & Prénom du Client *</Label>
                  <Input
                    id="customerName"
                    placeholder="Ex: Mohamed Alami"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone Mobile (06 / 07 / +212) *</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Ex: 0661234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">Ville de Livraison (Maroc) *</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Choisir la ville" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {MOROCCAN_CITIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shippingNote">Note de Livraison (Optionnel)</Label>
                  <Input
                    id="shippingNote"
                    placeholder="Ex: Appeler avant 14h, sonnette droite..."
                    value={shippingNote}
                    onChange={(e) => setShippingNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Adresse Complète (Quartier, Rue, N°) *</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Ex: Bd Zerktouni, Résidence Al Manar, Étage 2, N° 5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Sélection des Articles & Panier */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  <Package className="h-3.5 w-3.5 text-emerald-600" />
                  Articles Commandés
                </h3>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-7 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="h-3 w-3" />
                  <span>Ajouter un Article</span>
                </Button>
              </div>

              {isLoadingProducts ? (
                <div className="py-6 flex items-center justify-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Chargement des produits en stock...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="p-4 rounded-lg bg-muted/40 text-center text-muted-foreground text-xs">
                  Aucun produit disponible en inventaire. Veuillez d&apos;abord créer des produits dans la section Inventaire.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => {
                    const selectedProd = products.find((p) => p.id === item.productId);
                    const lineTotal = (item.quantity || 0) * (item.price || 0);

                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                      >
                        {/* Produit */}
                        <div className="flex-1 w-full space-y-1">
                          <Label className="text-[11px] text-muted-foreground">
                            Produit #{index + 1}
                          </Label>
                          <Select
                            value={item.productId}
                            onValueChange={(val) => handleProductSelect(index, val)}
                          >
                            <SelectTrigger className="h-9">
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
                                      ({p.stock} en stock) • {formatPriceMAD(p.salePrice)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedProd && (
                            <span className="text-[10px] text-muted-foreground">
                              SKU : <strong className="font-mono">{selectedProd.sku}</strong> • Stock restant :{" "}
                              <strong className={selectedProd.stock <= 5 ? "text-amber-600" : "text-emerald-600"}>
                                {selectedProd.stock} unités
                              </strong>
                            </span>
                          )}
                        </div>

                        {/* Quantité */}
                        <div className="w-24 space-y-1">
                          <Label className="text-[11px] text-muted-foreground">Qté</Label>
                          <Input
                            type="number"
                            min="1"
                            max={selectedProd?.stock || 99}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10) || 1)}
                            className="h-9 font-mono text-center"
                          />
                        </div>

                        {/* Prix Unitaire MAD */}
                        <div className="w-28 space-y-1">
                          <Label className="text-[11px] text-muted-foreground">Prix Unitaire (DH)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                            className="h-9 font-mono text-right"
                          />
                        </div>

                        {/* Total Ligne & Bouton Supprimer */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-4">
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground block">Sous-total</span>
                            <span className="font-mono font-bold text-xs text-foreground">
                              {formatPriceMAD(lineTotal)}
                            </span>
                          </div>

                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Récapitulatif Montant Total Cash on Delivery */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 block">
                    Total Net Cash On Delivery (à encaisser)
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    {items.reduce((acc, i) => acc + (i.quantity || 0), 0)} article(s) • Paiement à la réception
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-xl text-emerald-700 dark:text-emerald-300">
                    {formatPriceMAD(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-muted/20 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="h-9"
            >
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || products.length === 0}
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Créer la Commande</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
