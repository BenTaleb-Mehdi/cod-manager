"use client";

import React, { useState, useEffect } from "react";
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
import { Building2, Pencil, Loader2, AlertCircle } from "lucide-react";
import { MOROCCAN_CITIES } from "@/lib/moroccan-data";
import { Supplier } from "@/types";
import { updateSupplierAction } from "@/actions/suppliers";

const EditSupplierSchema = z.object({
  name: z.string().min(2, "Le nom du fournisseur est obligatoire."),
  phone: z.string().min(8, "Numéro de téléphone marocain invalide."),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().optional().nullable(),
});

type EditSupplierFormValues = z.infer<typeof EditSupplierSchema>;

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierUpdated?: (updatedSupplier: Supplier) => void;
}

export function EditSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSupplierUpdated,
}: EditSupplierDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditSupplierFormValues>({
    resolver: zodResolver(EditSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "Casablanca",
      address: "",
    },
  });

  useEffect(() => {
    if (supplier && open) {
      reset({
        name: supplier.name,
        phone: supplier.phone,
        city: supplier.city || "Casablanca",
        address: supplier.address || "",
      });
      setErrorMsg(null);
    }
  }, [supplier, open, reset]);

  if (!supplier) return null;

  const onSubmit = async (values: EditSupplierFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await updateSupplierAction(supplier.id, {
        name: values.name,
        phone: values.phone,
        city: values.city,
        address: values.address || null,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Erreur lors de la mise à jour du fournisseur.");
        setIsSubmitting(false);
        return;
      }

      if (onSupplierUpdated) {
        onSupplierUpdated({
          ...supplier,
          ...res.data,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Modifier le Fournisseur</DialogTitle>
              <DialogDescription>
                Mettez à jour les coordonnées de « {supplier.name} ».
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-supplier-name" className="text-xs font-semibold">
              Raison Sociale / Nom du Fournisseur <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-supplier-name"
              placeholder="Ex: Grossiste Atlas Import"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-supplier-phone" className="text-xs font-semibold">
                Téléphone (Maroc) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-supplier-phone"
                placeholder="0661000000"
                {...register("phone")}
                className={errors.phone ? "border-destructive font-mono" : "font-mono"}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-supplier-city" className="text-xs font-semibold">
                Ville <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-supplier-city">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {MOROCCAN_CITIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-supplier-address" className="text-xs font-semibold">
              Adresse Entrepôt / Dépôt (Optionnel)
            </Label>
            <Input
              id="edit-supplier-address"
              placeholder="Ex: Derb Omar, Magasin N° 45, Casablanca"
              {...register("address")}
            />
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
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
