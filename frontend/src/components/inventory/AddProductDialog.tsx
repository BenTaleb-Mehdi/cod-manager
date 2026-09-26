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
import {
  Plus,
  PackagePlus,
  Loader2,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { Product, Category } from "@/types";
import { formatPriceMAD } from "@/lib/utils";
import { createProductAction } from "@/actions/inventory";

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
    imageUrl: z
      .string()
      .refine(
        (val) =>
          !val ||
          val.startsWith("data:image/") ||
          val.startsWith("http://") ||
          val.startsWith("https://") ||
          val.startsWith("/"),
        "Format d'image non valide (sélectionnez un fichier ou collez une URL)."
      )
      .optional()
      .or(z.literal("")),
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
  trigger?: React.ReactNode;
}

export function AddProductDialog({
  categories,
  onProductCreated,
  trigger,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Drag and Drop Image state
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Synchroniser la catégorie par défaut dès que la liste est chargée depuis le backend
  React.useEffect(() => {
    if (categories.length > 0 && !watch("categoryId")) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, setValue, watch]);

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
        setFileName(file.name);
        setFileSize((file.size / 1024).toFixed(1) + " KB");
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
    setFileName(null);
    setFileSize(null);
    setValue("imageUrl", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: AddProductFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const selectedCategory = categories.find((c) => c.id === values.categoryId);

      // Appel de l'API backend pour enregistrer en base de données MySQL
      const res = await createProductAction({
        sku: values.sku,
        name: values.name,
        description: values.description,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl || undefined,
      });

      if (!res.success || !res.data) {
        setSubmitError(res.error || "Erreur lors de l'enregistrement du produit en base de données.");
        setIsSubmitting(false);
        return;
      }

      const createdProduct = res.data;
      const newProduct: Product = {
        id: createdProduct.id,
        name: createdProduct.name,
        sku: createdProduct.sku,
        description: createdProduct.description,
        costPrice: Number(createdProduct.costPrice),
        salePrice: Number(createdProduct.salePrice),
        stock: createdProduct.stock,
        categoryId: createdProduct.categoryId,
        category: createdProduct.category || selectedCategory,
        imageUrl: createdProduct.imageUrl || null,
        createdAt: createdProduct.createdAt || new Date().toISOString(),
      };

      if (onProductCreated) {
        onProductCreated(newProduct);
      }

      reset();
      handleRemoveImage();
      setUseUrlInput(false);
      setOpen(false);
    } catch (e) {
      console.error("Error creating product:", e);
      setSubmitError(e instanceof Error ? e.message : "Erreur inattendue lors de la création du produit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSubmitError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" className="gap-1.5 h-9 bg-primary">
            <PackagePlus className="h-4 w-4" />
            <span>Nouveau Produit</span>
          </Button>
        )}
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

        {submitError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Chargement des catégories...
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
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

          {/* Zone Image : Glisser-Déposer ou Parcourir */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <ImageIcon className="h-4 w-4 text-primary" />
                Image du Produit
              </Label>
              <button
                type="button"
                onClick={() => setUseUrlInput(!useUrlInput)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                <LinkIcon className="h-3 w-3" />
                {useUrlInput ? "Glisser-déposer une image" : "Ou coller une URL"}
              </button>
            </div>

            {/* Input fichier masqué */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {useUrlInput ? (
              <div className="space-y-1.5">
                <Input
                  id="prod-img"
                  placeholder="https://images.unsplash.com/..."
                  {...register("imageUrl")}
                  onChange={(e) => {
                    register("imageUrl").onChange(e);
                    setPreviewUrl(e.target.value.trim() || null);
                  }}
                />
                {previewUrl && (
                  <div className="relative mt-2 p-2 border rounded-lg bg-muted/20 flex items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Aperçu URL"
                      className="h-12 w-12 rounded object-cover border bg-background"
                      onError={() => setPreviewUrl(null)}
                    />
                    <span className="text-[11px] text-muted-foreground truncate">
                      Aperçu de l'URL chargée
                    </span>
                  </div>
                )}
              </div>
            ) : previewUrl ? (
              /* Aperçu de l'image glissée/sélectionnée */
              <div className="relative rounded-xl border bg-card p-3 flex items-center gap-3 shadow-sm">
                <img
                  src={previewUrl}
                  alt="Aperçu produit"
                  className="h-16 w-16 rounded-lg object-cover border bg-muted/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {fileName || "Image produit importée"}
                  </p>
                  {fileSize && (
                    <p className="text-[11px] text-muted-foreground font-mono">{fileSize}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Changer l'image
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 h-8 w-8 shrink-0"
                  title="Supprimer l'image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              /* Zone de Glisser-Déposer active */
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-muted-foreground/30 hover:border-primary hover:bg-muted/30"
                }`}
              >
                <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">
                    Glissez-déposez votre image ici, ou <span className="text-primary underline">parcourez</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Formats supportés : PNG, JPG, WebP jusqu'à 5 Mo
                  </p>
                </div>
              </div>
            )}

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
