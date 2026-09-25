"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Plus, PackagePlus, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { Product, Category } from "@/types";
import { formatPriceMAD } from "@/lib/utils";

const AddProductSchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom du produit doit comporter au moins 2 caractères.")
      .max(255),
    sku: z
      .string()
      .min(3, "Le SKU doit comporter au moins 3 caractères.")
      .max(100)
      .transform((val) => val.toUpperCase().trim()),
    categoryId: z.string().min(1, "Veuillez sélectionner une catégorie."),
    costPrice: z
      .coerce
      .number({ invalid_type_error: "Prix d'achat invalide." })
      .positive("Le prix d'achat doit être supérieur à zéro."),
    salePrice: z
      .coerce
      .number({ invalid_type_error: "Prix de vente invalide." })
      .positive("Le prix de vente doit être supérieur à zéro."),
    stock: z
      .coerce
      .number({ invalid_type_error: "Stock invalide." })
      .int("Le stock doit être un entier.")
      .min(0, "Le stock initial ne peut pas être négatif."),
    imageUrl: z.string().url("URL de l'image invalide.").optional().or(z.literal("")),
    description: z.string().max(1000).optional(),
  })
  .refine((data) => data.salePrice >= data.costPrice, {
    message: "Le prix de vente doit être supérieur ou égal au prix d'achat.",
    path: ["salePrice"],
  });

type AddProductFormValues = z.infer<typeof AddProductSchema>;

interface AddProductDialogProps {
  categories: Category[];
  onProductCreated?: (newProduct: Product) => void;
}

export function AddProductDialog({
  categories,
  onProductCreated,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: categories[0]?.id || "",
      costPrice: 0,
      salePrice: 0,
      stock: 10,
      imageUrl: "",
      description: "",
    },
  });

  const costPrice = watch("costPrice") || 0;
  const salePrice = watch("salePrice") || 0;

  // Calcul dynamique de la marge brute et du taux de marge
  const calculatedMargin = salePrice - costPrice;
  const marginPercentage =
    salePrice > 0 ? ((calculatedMargin / salePrice) * 100).toFixed(1) : "0";

  // Génération automatique d'un SKU court à partir du nom
  const handleAutoSku = () => {
    const currentName = watch("name");
    if (!currentName) return;
    const prefix = currentName
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .slice(0, 3)
      .map((w) => w.slice(0, 3))
      .join("-");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setValue("sku", `${prefix}-${randomSuffix}`, { shouldValidate: true });
  };

  const onSubmit = async (values: AddProductFormValues) => {
    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find((c) => c.id === values.categoryId);

      const newProduct: Product = {
        id: `p-${Date.now()}`,
        name: values.name,
        sku: values.sku,
        description: values.description,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        stock: values.stock,
        categoryId: values.categoryId,
        category: selectedCategory,
        imageUrl: values.imageUrl || null,
        createdAt: new Date().toISOString(),
      };

      if (onProductCreated) {
        onProductCreated(newProduct);
      }

      reset();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 h-9 bg-primary">
          <PackagePlus className="h-4 w-4" />
          <span>Nouveau Produit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-primary" />
            Ajouter un Nouveau Produit
          </DialogTitle>
          <DialogDescription>
            Renseignez les informations produits et configurez le prix d'achat et de vente pour le suivi de rentabilité.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Nom du Produit */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-name">Nom du Produit</Label>
            <Input
              id="prod-name"
              placeholder="ex: Sérum Anti-Âge Argan 50ml"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* SKU et Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="prod-sku">Code SKU (Unique)</Label>
                <button
                  type="button"
                  onClick={handleAutoSku}
                  className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto SKU
                </button>
              </div>
              <Input
                id="prod-sku"
                placeholder="ex: SERUM-ARG-50"
                className="font-mono uppercase"
                {...register("sku")}
              />
              {errors.sku && (
                <p className="text-xs text-destructive font-medium">{errors.sku.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive font-medium">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          {/* Prix d'Achat, Prix de Vente et Stock Initial */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-cost">Prix Achat (DH)</Label>
              <Input
                id="prod-cost"
                type="number"
                step="0.01"
                placeholder="ex: 45"
                {...register("costPrice")}
              />
              {errors.costPrice && (
                <p className="text-xs text-destructive font-medium">{errors.costPrice.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-sale">Prix Vente (DH)</Label>
              <Input
                id="prod-sale"
                type="number"
                step="0.01"
                placeholder="ex: 199"
                {...register("salePrice")}
              />
              {errors.salePrice && (
                <p className="text-xs text-destructive font-medium">{errors.salePrice.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-stock">Stock Initial</Label>
              <Input
                id="prod-stock"
                type="number"
                step="1"
                placeholder="ex: 50"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-xs text-destructive font-medium">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Live Profit Margin Calculator Widget */}
          <div className="rounded-lg border bg-muted/40 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-foreground">Marge Unitaire Prévisionnelle:</span>
                <span className="ml-2 font-bold text-emerald-600">
                  {formatPriceMAD(calculatedMargin > 0 ? calculatedMargin : 0)}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground font-medium">
              Taux de marge: <strong className="text-foreground">{marginPercentage}%</strong>
            </div>
          </div>

          {/* Image URL & Description */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-img">URL de l'image (optionnelle)</Label>
            <Input
              id="prod-img"
              placeholder="https://..."
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive font-medium">{errors.imageUrl.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Enregistrer le produit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
