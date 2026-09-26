"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Building2, Plus, Loader2 } from "lucide-react";
import { MOROCCAN_CITIES } from "@/lib/moroccan-data";
import { createSupplierAction } from "@/actions/suppliers";
import { useRouter } from "next/navigation";

const AddSupplierSchema = z.object({
  name: z.string().min(2, "Le nom du fournisseur est obligatoire."),
  phone: z.string().min(8, "Numéro de téléphone marocain invalide."),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().optional(),
});

type AddSupplierFormValues = z.infer<typeof AddSupplierSchema>;

export function AddSupplierDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddSupplierFormValues>({
    resolver: zodResolver(AddSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "Casablanca",
      address: "",
    },
  });

  const onSubmit = async (values: AddSupplierFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createSupplierAction(values);
      if (res.success) {
        reset();
        setOpen(false);
        router.refresh();
      } else {
        alert(res.error || "Erreur lors de la création du fournisseur.");
      }
    } catch (e) {
      console.error("Error creating supplier:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 h-9">
          <Building2 className="h-4 w-4 text-primary" />
          <span>Nouveau Fournisseur</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Ajouter un Partenaire Fournisseur
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enregistrez un fournisseur grossiste pour le suivi des achats et réapprovisionnements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="name">Raison Sociale / Nom du Fournisseur</Label>
              <Input
                id="name"
                placeholder="Ex: Grossiste Casablanca Import"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone / WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="0661000000"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">Ville</Label>
                <Select
                  defaultValue="Casablanca"
                  onValueChange={(val) => setValue("city", val)}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Choisir la ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-[11px] text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Adresse du Dépôt / Magasin</Label>
              <Input
                id="address"
                placeholder="Ex: Derb Omar, Rue de Strasbourg, Casablanca"
                {...register("address")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Enregistrer Fournisseur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
