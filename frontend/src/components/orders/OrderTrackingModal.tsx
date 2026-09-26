"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/types";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { getOrderByIdAction, SingleOrderDetails } from "@/actions/orders";
import { AddTrackingDialog } from "./AddTrackingDialog";
import { AddCourierDialog } from "@/components/settings/AddCourierDialog";
import {
  Navigation,
  MapPin,
  Truck,
  Phone,
  Clock,
  User,
  Package,
  RotateCw,
  ExternalLink,
  Plus,
  Key,
} from "lucide-react";
import Link from "next/link";

const MOROCCAN_CITY_COORDINATES: Record<string, [number, number]> = {
  casablanca: [33.5731, -7.5898],
  rabat: [34.0209, -6.8416],
  marrakech: [31.6295, -7.9811],
  tanger: [35.7595, -5.834],
  fes: [34.0331, -5.0003],
  agadir: [30.4278, -9.5981],
  meknes: [33.8938, -5.5516],
  oujda: [34.6867, -1.9114],
  kenitra: [34.261, -6.5802],
  tetouan: [35.5889, -5.3626],
  sale: [34.0531, -6.7985],
  temara: [33.9267, -6.9122],
  mohammedia: [33.6866, -7.3829],
  "el jadida": [33.2316, -8.5007],
  nador: [35.1688, -2.9335],
};

interface OrderTrackingModalProps {
  order: Order;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OrderTrackingModal({
  order,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: OrderTrackingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  const [details, setDetails] = useState<SingleOrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveTracking = async () => {
    setIsLoading(true);
    try {
      const res = await getOrderByIdAction(order.id);
      if (res.success && res.data) {
        setDetails(res.data);
      }
    } catch (e) {
      console.error("Error loading order tracking:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLiveTracking();
    }
  }, [open]);

  const currentOrder = details || order;
  const normalizedCity = (currentOrder.city || "Casablanca").trim().toLowerCase();
  const defaultCityCoords = MOROCCAN_CITY_COORDINATES[normalizedCity] || [33.5731, -7.5898];

  const mapLat = details?.lastLatitude ?? defaultCityCoords[0];
  const mapLng = details?.lastLongitude ?? defaultCityCoords[1];

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.04}%2C${mapLat - 0.04}%2C${mapLng + 0.04}%2C${mapLat + 0.04}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40"
            title="Voir Carte & Position Livreur"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Suivi & Carte</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[780px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header du Modal */}
        <div className="p-4 border-b bg-card flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-emerald-600" />
              <DialogTitle className="text-base font-bold">
                Suivi Colis & Position Livreur
              </DialogTitle>
              <OrderStatusBadge status={currentOrder.status} />
            </div>
            <DialogDescription className="text-xs">
              Commande #{currentOrder.id} • {currentOrder.customerName} ({currentOrder.city})
              {currentOrder.trackingNumber ? ` • N° Suivi : ${currentOrder.trackingNumber}` : ""}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={fetchLiveTracking}
              disabled={isLoading}
              title="Actualiser la position"
              className="h-8 w-8"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <AddCourierDialog
              onSuccess={fetchLiveTracking}
              trigger={
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs text-sky-700 border-sky-300 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-800">
                  <Key className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">+ API Société</span>
                </Button>
              }
            />

            <AddTrackingDialog
              order={currentOrder}
              onSuccess={fetchLiveTracking}
              trigger={
                <Button size="sm" className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Navigation className="h-3.5 w-3.5" />
                  <span>+ Étape / GPS</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Contenu Défilable : Carte GPS + Infos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Carte OpenStreetMap Interactive */}
          <div className="rounded-xl border overflow-hidden shadow-sm">
            <div className="bg-muted/30 px-3 py-2 border-b flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
                Position du Livreur en Temps Réel
              </span>
              {details?.lastLatitude ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Signal GPS Actif ({mapLat.toFixed(3)}, {mapLng.toFixed(3)})
                </span>
              ) : (
                <span className="text-muted-foreground text-[11px]">
                  Position basée sur la ville : {currentOrder.city}
                </span>
              )}
            </div>

            <div className="relative h-[280px] w-full bg-muted">
              <iframe
                title="Carte Livreur"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={osmEmbedUrl}
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-2.5 bg-card border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="truncate max-w-sm">
                <strong>Adresse de livraison :</strong> {currentOrder.address}, {currentOrder.city}
              </span>
              {details?.lastLocationAt && (
                <span>Dernier ping : {new Date(details.lastLocationAt).toLocaleTimeString("fr-FR")}</span>
              )}
            </div>
          </div>

          {/* Grille Résumé : Livreur, Destinataire & Montant */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Livreur */}
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-sky-600" />
                  Société de Livraison
                </span>
                <AddCourierDialog
                  onSuccess={fetchLiveTracking}
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
              <p className="font-semibold text-foreground text-xs">
                {currentOrder.courier ? currentOrder.courier.name : "Non assigné"}
              </p>
              {currentOrder.courier?.phone && (
                <p className="font-mono text-muted-foreground text-[11px]">
                  Tél : {currentOrder.courier.phone}
                </p>
              )}
              {currentOrder.courier?.apiEndpoint ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> API Connectée
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Suivi manuel</span>
              )}
            </div>

            {/* Client */}
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" />
                Destinataire (Client)
              </span>
              <p className="font-semibold text-foreground text-xs">
                {currentOrder.customerName}
              </p>
              <p className="font-mono text-muted-foreground text-[11px]">
                {formatMoroccanPhone(currentOrder.phone)}
              </p>
            </div>

            {/* Total à Encaisser */}
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-emerald-600" />
                Montant Cash on Delivery
              </span>
              <p className="font-mono font-bold text-foreground text-sm text-emerald-600">
                {formatPriceMAD(currentOrder.totalAmount)}
              </p>
              <p className="text-[10px] text-muted-foreground">Paiement à la livraison</p>
            </div>
          </div>

          {/* Timeline des étapes de livraison */}
          <div className="rounded-lg border bg-card p-3 space-y-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Historique des Scans & Étapes de Livraison
            </span>

            <div className="space-y-3 pt-1">
              {details?.trackingEvents && details.trackingEvents.length > 0 ? (
                details.trackingEvents.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-3 text-xs">
                    <span
                      className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                        idx === 0 ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-muted-foreground/60"
                      }`}
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <OrderStatusBadge status={event.status} />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(event.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-foreground text-[11px] font-medium pt-0.5">
                        {event.note || "Mise à jour transporteur"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-[11px] italic py-1">
                  Aucun événement de tracking enregistré pour le moment. Cliquez sur "+ Étape / GPS" ci-dessus pour ajouter le premier point de passage.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer avec lien vers la page complète */}
        <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-xs">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-primary gap-1">
            <Link href={`/orders/${currentOrder.id}/tracking`}>
              <span>Ouvrir la page de suivi plein écran</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
