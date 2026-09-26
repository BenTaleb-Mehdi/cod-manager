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
import { Truck, Key, Globe, Shield, Loader2, Plus } from "lucide-react";
import { createCourierAction } from "@/actions/couriers";
import { useRouter } from "next/navigation";

const AddCourierSchema = z.object({
  name: z.string().min(2, "Le nom du transporteur est obligatoire."),
  phone: z.string().min(8, "Numéro de téléphone invalide."),
  apiEndpoint: z.string().url("URL de l'API invalide.").optional().or(z.literal("")),
  apiKey: z.string().optional(),
  webhookSecret: z.string().optional(),
  ipWhitelist: z.string().optional(),
});

type AddCourierFormValues = z.infer<typeof AddCourierSchema>;

interface AddCourierDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddCourierDialog({ onSuccess, trigger }: AddCourierDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCourierFormValues>({
    resolver: zodResolver(AddCourierSchema),
    defaultValues: {
      name: "",
      phone: "",
      apiEndpoint: "",
      apiKey: "",
      webhookSecret: "",
      ipWhitelist: "",
    },
  });

  const onSubmit = async (values: AddCourierFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createCourierAction(values);
      if (res.success) {
        reset();
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        alert(res.error || "Erreur lors de l'ajout de la société de livraison.");
      }
    } catch (e) {
      console.error("Error creating courier:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 h-9 bg-primary">
            <Truck className="h-4 w-4" />
            <span>Ajouter Société de Livraison</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Nouvelle Société de Livraison (Transporteur COD)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configurez une société de livraison partenaire et connectez son API pour le tracking automatique des colis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            {/* Nom & Téléphone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="courierName">Nom du Transporteur</Label>
                <Input
                  id="courierName"
                  placeholder="Ex: Cathedis, Ozone, Sendit"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="courierPhone">Téléphone Contact</Label>
                <Input
                  id="courierPhone"
                  placeholder="0522001122"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Identifiants API & Webhook */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Intégration API & Webhooks
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apiEndpoint">URL de l'API Transporteur (Endpoint)</Label>
                <Input
                  id="apiEndpoint"
                  placeholder="https://api.transporteur.ma/v1/shipments"
                  {...register("apiEndpoint")}
                />
                {errors.apiEndpoint && (
                  <p className="text-[11px] text-destructive">{errors.apiEndpoint.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="apiKey" className="flex items-center gap-1">
                    <Key className="h-3 w-3 text-muted-foreground" />
                    Clé API (API Key)
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk_live_..."
                    {...register("apiKey")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="webhookSecret" className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    Secret Webhook
                  </Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    placeholder="whsec_..."
                    {...register("webhookSecret")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ipWhitelist">Whitelist IP (Optionnel, séparées par virgule)</Label>
                <Input
                  id="ipWhitelist"
                  placeholder="Ex: 196.200.12.4, 105.158.20.1"
                  {...register("ipWhitelist")}
                />
              </div>
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
              Enregistrer Société
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
