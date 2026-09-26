"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSetting } from "@/types";
import { updateStoreSettingsAction } from "@/actions/settings";
import { Store, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface StoreSettingsFormProps {
  initialSettings: Partial<StoreSetting>;
}

export function StoreSettingsForm({ initialSettings }: StoreSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<StoreSetting>({
    defaultValues: {
      storeName: initialSettings.storeName || "Atlas Boutique COD",
      phone: initialSettings.phone || "0661000000",
      email: initialSettings.email || "contact@atlasboutique.ma",
      address: initialSettings.address || "Bd Al Massira Al Khadra, Casablanca",
      ice: initialSettings.ice || "002891823000045",
      taxNumber: initialSettings.taxNumber || "45129801",
      patente: initialSettings.patente || "34192045",
    },
  });

  const onSubmit = async (values: StoreSetting) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const res = await updateStoreSettingsAction(values);
      if (res.success) {
        setSuccessMessage("Paramètres et mentions légales mis à jour avec succès.");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(res.error || "Erreur lors de la mise à jour.");
      }
    } catch (e) {
      console.error("Error updating settings:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Identité de la Boutique */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            Identité Commerciale & Contact
          </CardTitle>
          <CardDescription className="text-xs">
            Ces informations apparaîtront sur vos factures A4 et tickets de livraison COD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="storeName">Nom Commercial de la Boutique</Label>
              <Input id="storeName" {...register("storeName", { required: true })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone Service Client</Label>
              <Input id="phone" {...register("phone", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email de Contact</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Adresse du Siège / Entrepôt</Label>
              <Input id="address" {...register("address", { required: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentions Légales Marocaines */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Mentions Légales Obligatoires (Maroc)
          </CardTitle>
          <CardDescription className="text-xs">
            Identifiants fiscaux exigés par la DGI pour la conformité de vos factures de vente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="ice">Identifiant Commun de l'Entreprise (ICE)</Label>
              <Input id="ice" placeholder="002891823000045" {...register("ice")} />
              <p className="text-[10px] text-muted-foreground">15 chiffres obligatoires</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taxNumber">Identifiant Fiscal (IF)</Label>
              <Input id="taxNumber" placeholder="45129801" {...register("taxNumber")} />
              <p className="text-[10px] text-muted-foreground">Numéro attribué par la DGI</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="patente">Numéro de Patente / Taxe Pro</Label>
              <Input id="patente" placeholder="34192045" {...register("patente")} />
              <p className="text-[10px] text-muted-foreground">Numéro de rôle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer les Paramètres
        </Button>
      </div>
    </form>
  );
}
