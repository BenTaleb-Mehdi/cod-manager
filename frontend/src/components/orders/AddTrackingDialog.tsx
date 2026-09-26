"use client";

import React, { useState } from "react";
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
import { Navigation, MapPin, Truck, Loader2, Plus, Key } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { MOCK_COURIERS, MOROCCAN_CITIES } from "@/lib/moroccan-data";
import { addOrderTrackingEventAction } from "@/actions/orders";
import { getCouriersAction } from "@/actions/couriers";
import { AddCourierDialog } from "@/components/settings/AddCourierDialog";
import { useRouter } from "next/navigation";

// Coordonnées approximatives par ville pour faciliter la saisie GPS
const CITY_COORDINATES: Record<string, [number, number]> = {
  Casablanca: [33.5731, -7.5898],
  Rabat: [34.0209, -6.8416],
  Marrakech: [31.6295, -7.9811],
  Tanger: [35.7595, -5.834],
  Fès: [34.0331, -5.0003],
  Agadir: [30.4278, -9.5981],
  Meknès: [33.8938, -5.5516],
  Oujda: [34.6867, -1.9114],
  Kénitra: [34.261, -6.5802],
  Tétouan: [35.5889, -5.3626],
  Salé: [34.0531, -6.7985],
  Temara: [33.9267, -6.9122],
  Mohammédia: [33.6866, -7.3829],
  "El Jadida": [33.2316, -8.5007],
  Nador: [35.1688, -2.9335],
};

interface AddTrackingDialogProps {
  order: Pick<Order, "id" | "status" | "city" | "trackingNumber" | "courierId">;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddTrackingDialog({ order, trigger, onSuccess }: AddTrackingDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [courierId, setCourierId] = useState(order.courierId || MOCK_COURIERS[0]?.id || "");
  const [couriersList, setCouriersList] = useState<{ id: string; name: string }[]>(MOCK_COURIERS);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");
  const [selectedCity, setSelectedCity] = useState(order.city || "Casablanca");

  const loadCouriers = async () => {
    try {
      const res = await getCouriersAction();
      if (res.success && res.data && res.data.length > 0) {
        setCouriersList(res.data);
        if (!courierId) {
          setCourierId(res.data[0].id);
        }
      }
    } catch (e) {
      console.error("Error loading couriers:", e);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadCouriers();
    }
  }, [open]);

  // Initialiser les coordonnées par rapport à la ville
  const initialCoords = CITY_COORDINATES[order.city] || [33.5731, -7.5898];
  const [latitude, setLatitude] = useState<number>(initialCoords[0]);
  const [longitude, setLongitude] = useState<number>(initialCoords[1]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    if (CITY_COORDINATES[cityName]) {
      setLatitude(CITY_COORDINATES[cityName][0]);
      setLongitude(CITY_COORDINATES[cityName][1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert("Veuillez saisir une description de l'étape de suivi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addOrderTrackingEventAction({
        orderId: order.id,
        trackingNumber: trackingNumber.trim() || undefined,
        courierId: courierId || undefined,
        status,
        note: note.trim(),
        latitude,
        longitude,
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
        alert(res.error || "Erreur lors de l'enregistrement du suivi.");
      }
    } catch (e) {
      console.error("Error adding tracking event:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1.5 h-9">
            <Navigation className="h-4 w-4 text-emerald-600" />
            <span>Mettre à jour Suivi & GPS</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-600" />
              Mise à jour Suivi & Position GPS
            </DialogTitle>
            <DialogDescription className="text-xs">
              Commande #{order.id} • Ajoutez un point de passage ou actualisez le tracking colis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            {/* N° de Tracking et Livreur */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="trackingNumber">N° de Suivi / Bon d'envoi</Label>
                <Input
                  id="trackingNumber"
                  placeholder="Ex: CAT-CAS-98124"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="courierId">Transporteur Associé</Label>
                  <AddCourierDialog
                    onSuccess={loadCouriers}
                    trigger={
                      <button
                        type="button"
                        className="text-[10px] text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5 font-medium"
                      >
                        <Plus className="h-2.5 w-2.5" /> API
                      </button>
                    }
                  />
                </div>
                <Select value={courierId} onValueChange={setCourierId}>
                  <SelectTrigger id="courierId">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriersList.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Statut de la commande */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Nouveau Statut de Livraison</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as OrderStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">CONFIRMED (Validée pour expédition)</SelectItem>
                  <SelectItem value="SHIPPED">SHIPPED (En cours de livraison)</SelectItem>
                  <SelectItem value="DELIVERED">DELIVERED (Livrée & Encaissée)</SelectItem>
                  <SelectItem value="NO_ANSWER">NO_ANSWER (Pas de réponse livreur)</SelectItem>
                  <SelectItem value="RETURNED">RETURNED (Colis retourné)</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED (Annulée)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description de l'étape */}
            <div className="space-y-1.5">
              <Label htmlFor="note">Événement / Étape de Livraison</Label>
              <Input
                id="note"
                placeholder="Ex: Colis scanné au centre de tri Casablanca Sud"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />
            </div>

            {/* Coordonnées GPS / Ville */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  Localisation sur Carte (Maroc)
                </span>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="h-7 w-36 text-[11px]">
                    <SelectValue placeholder="Choisir ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Latitude :</span>
                  <Input
                    type="number"
                    step="0.0001"
                    className="h-7 text-xs font-mono"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Longitude :</span>
                  <Input
                    type="number"
                    step="0.0001"
                    className="h-7 text-xs font-mono"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  />
                </div>
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
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Enregistrer l'étape de Suivi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
