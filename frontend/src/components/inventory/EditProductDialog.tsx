"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Pencil,
  Loader2,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
  Package,
} from "lucide-react";
import { Product, Category } from "@/types";
import { formatPriceMAD } from "@/lib/utils";
import { updateProductAction } from "@/actions/inventory";

const EditProductSchema = z
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
      .min(0, "Le stock ne peut pas être négatif."),
    lowStockThreshold: z
      .coerce
      .number({ invalid_type_error: "Seuil invalide." })
      .int("Le seuil doit être un entier.")
      .min(0, "Le seuil ne peut pas être négatif.")
      .default(5),
    isActive: z.boolean().default(true),
    imageUrl: z.string().optional().nullable().or(z.literal("")),
    description: z.string().max(1000).optional().nullable(),
  })
  .refine((data) => data.salePrice >= data.costPrice, {
    message: "Le prix de vente doit être supérieur ou égal au prix d'achat.",
    path: ["salePrice"],
  });

type EditProductFormValues = z.infer<typeof EditProductSchema>;

interface EditProductDialogProps {
  product: Product | null;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
}

export function EditProductDialog({
  product,
  categories,
  open,
  onOpenChange,
  onProductUpdated,
}: EditProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Drag & drop image state
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProductFormValues>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      lowStockThreshold: 5,
      isActive: true,
      imageUrl: "",
      description: "",
    },
  });

  // Recharger les données du formulaire lorsque le produit change ou que le modal s'ouvre
  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId || (categories[0]?.id ?? ""),
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold ?? 5,
        isActive: product.isActive !== false,
        imageUrl: product.imageUrl || "",
        description: product.description || "",
      });
      setPreviewUrl(product.imageUrl || null);
      setSubmitError(null);
      setUseUrlInput(false);
    }
  }, [product, open, categories, reset]);

  const costPrice = watch("costPrice") || 0;
  const salePrice = watch("salePrice") || 0;
  const calculatedMargin = salePrice - costPrice;
  const marginPercentage =
    salePrice > 0 ? ((calculatedMargin / salePrice) * 100).toFixed(1) : "0";

  // Génération automatique d'un SKU
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

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewUrl(result);
        setValue("imageUrl", result, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setValue("imageUrl", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: EditProductFormValues) => {
    if (!product) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await updateProductAction(product.id, {
        sku: values.sku,
        name: values.name,
        description: values.description || undefined,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl || null,
        lowStockThreshold: values.lowStockThreshold,
        isActive: values.isActive,
      });

      if (!res.success || !res.data) {
        setSubmitError(
          res.error || "Erreur lors de la mise à jour du produit en base de données."
        );
        setIsSubmitting(false);
        return;
      }

      const updated = res.data;
      const matchedCat = categories.find((c) => c.id === updated.categoryId);

      const normalizedUpdated: Product = {
        ...updated,
        category: updated.category || matchedCat,
      };

      if (onProductUpdated) {
        onProductUpdated(normalizedUpdated);
      }

      onOpenChange(false);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Une erreur imprévue est survenue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Modifier le Produit</DialogTitle>
              <DialogDescription>
                Mettez à jour les tarifs, le stock ou les informations de « {product.name} ».
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Ligne 1 : Nom du produit et SKU */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-product-name" className="text-xs font-semibold">
                Nom du Produit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-product-name"
                placeholder="Ex: Montre Connectée Pro Max"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-product-sku" className="text-xs font-semibold">
                  Code SKU Unique <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={handleAutoSku}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  <Sparkles className="h-3 w-3" />
                  Générer
                </button>
              </div>
              <Input
                id="edit-product-sku"
                placeholder="EX: MON-PRO-001"
                {...register("sku")}
                className={`font-mono uppercase ${
                  errors.sku ? "border-destructive" : ""
                }`}
              />
              {errors.sku && (
                <p className="text-xs text-destructive">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* Ligne 2 : Catégorie & Statut */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-product-category" className="text-xs font-semibold">
                Catégorie <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-product-category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-product-status" className="text-xs font-semibold">
                Statut du Produit
              </Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Select
                    value={field.value ? "active" : "inactive"}
                    onValueChange={(val) => field.onChange(val === "active")}
                  >
                    <SelectTrigger id="edit-product-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-emerald-700 dark:text-emerald-400">
                            Actif (Visible & En vente)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-zinc-400" />
                          <span className="font-medium text-muted-foreground">
                            Inactif (Désactivé)
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Ligne 3 : Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-product-desc" className="text-xs font-semibold">
              Description (Optionnel)
            </Label>
            <Input
              id="edit-product-desc"
              placeholder="Détails, couleur, caractéristiques..."
              {...register("description")}
            />
          </div>

          {/* Zone Tarification & Stock avec Seuil de Stock Faible */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Tarification & Gestion du Stock</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-cost-price" className="text-xs">
                  Prix d'Achat (DH) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-cost-price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("costPrice")}
                  className={errors.costPrice ? "border-destructive font-mono" : "font-mono"}
                />
                {errors.costPrice && (
                  <p className="text-xs text-destructive">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-sale-price" className="text-xs">
                  Prix de Vente (DH) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-sale-price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("salePrice")}
                  className={errors.salePrice ? "border-destructive font-mono" : "font-mono"}
                />
                {errors.salePrice && (
                  <p className="text-xs text-destructive">{errors.salePrice.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-product-stock" className="text-xs">
                  Stock Physique <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-product-stock"
                  type="number"
                  min="0"
                  {...register("stock")}
                  className={errors.stock ? "border-destructive font-mono" : "font-mono"}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-product-threshold" className="text-xs">
                  Seuil Alerte Stock
                </Label>
                <Input
                  id="edit-product-threshold"
                  type="number"
                  min="0"
                  placeholder="5"
                  {...register("lowStockThreshold")}
                  className={errors.lowStockThreshold ? "border-destructive font-mono" : "font-mono"}
                />
                {errors.lowStockThreshold && (
                  <p className="text-xs text-destructive">{errors.lowStockThreshold.message}</p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Alerte si stock ≤ seuil
                </p>
              </div>
            </div>

            {/* Marge calculée en temps réel */}
            <div className="flex items-center justify-between rounded-lg bg-card border px-3 py-2 text-xs">
              <span className="text-muted-foreground">Marge brute estimée :</span>
              <div className="flex items-center gap-2 font-mono">
                <span
                  className={`font-bold ${
                    calculatedMargin >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {calculatedMargin >= 0 ? "+" : ""}
                  {formatPriceMAD(calculatedMargin)}
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-semibold">
                  {marginPercentage}% de marge
                </span>
              </div>
            </div>
          </div>

          {/* Zone Photo du Produit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Photo du Produit</Label>
              <button
                type="button"
                onClick={() => setUseUrlInput(!useUrlInput)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {useUrlInput ? (
                  <>
                    <UploadCloud className="h-3 w-3" /> Fichier / Glisser-Déposer
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3 w-3" /> Saisir une URL Web
                  </>
                )}
              </button>
            </div>

            {useUrlInput ? (
              <Input
                placeholder="https://exemple.com/image.jpg"
                {...register("imageUrl")}
                onChange={(e) => {
                  register("imageUrl").onChange(e);
                  setPreviewUrl(e.target.value || null);
                }}
              />
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {previewUrl ? (
                  <div className="relative flex items-center gap-3 rounded-lg border bg-card p-2">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="h-16 w-16 rounded-md object-cover border bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        Photo actuelle du produit
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-primary hover:underline mt-1 block"
                      >
                        Changer la photo
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20 hover:border-primary/50 bg-muted/10"
                    }`}
                  >
                    <UploadCloud className="h-7 w-7 text-muted-foreground mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Cliquez ou glissez une image ici
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      PNG, JPG, WebP jusqu'à 5 Mo
                    </p>
                  </div>
                )}
              </div>
            )}
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
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
