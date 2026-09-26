import React from "react";
import { getOrderByIdAction } from "@/actions/orders";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import {
  MapPin,
  Truck,
  ArrowLeft,
  Calendar,
  Phone,
  User,
  Package,
  Navigation,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddTrackingDialog } from "@/components/orders/AddTrackingDialog";


// Coordonnées GPS des principales villes marocaines
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

export default async function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getOrderByIdAction(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;
  const normalizedCity = order.city.trim().toLowerCase();
  const defaultCityCoords = MOROCCAN_CITY_COORDINATES[normalizedCity] || [33.5731, -7.5898];

  const mapLat = order.lastLatitude ?? defaultCityCoords[0];
  const mapLng = order.lastLongitude ?? defaultCityCoords[1];

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.05}%2C${mapLat - 0.05}%2C${mapLng + 0.05}%2C${mapLat + 0.05}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div className="space-y-6">
      {/* Header avec retour */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon-sm" className="h-9 w-9">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Suivi de Colis #{order.id}
              <OrderStatusBadge status={order.status} />
            </h1>
            <p className="text-xs text-muted-foreground">
              {order.trackingNumber ? `N° de suivi : ${order.trackingNumber}` : "En attente d'expédition"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AddTrackingDialog order={order} />

          {order.invoice && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 h-9">
              <Link href={`/orders/${order.id}/invoice`}>
                <Package className="h-4 w-4" />
                <span>Voir Facture #{order.invoice.invoiceNumber}</span>
              </Link>
            </Button>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne Gauche : Carte GPS */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    Localisation GPS du Colis
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {order.lastLatitude && order.lastLongitude
                      ? `Position GPS réelle transmise par le livreur (${order.lastLatitude.toFixed(4)}, ${order.lastLongitude.toFixed(4)})`
                      : `Destination prévue : ${order.city} (En attente du signal GPS transporteur)`}
                  </CardDescription>
                </div>
                {order.lastLatitude && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Signal GPS Actif
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[380px] w-full bg-muted">
                <iframe
                  title="Carte de livraison"
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
              <div className="p-4 bg-card border-t flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  <span>
                    <strong>Adresse de livraison :</strong> {order.address}, {order.city}
                  </span>
                </div>
                {order.lastLocationAt && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Dernier ping : {new Date(order.lastLocationAt).toLocaleTimeString("fr-FR")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chronologie des événements de suivi */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Historique des Étapes de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-muted">
                {order.trackingEvents && order.trackingEvents.length > 0 ? (
                  order.trackingEvents.map((event: any, index: number) => (
                    <div key={event.id} className="relative flex items-start gap-4 pl-8">
                      <span
                        className={`absolute left-2 top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
                          index === 0 ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/60"
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={event.status} />
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(event.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-foreground font-medium pt-1">
                          {event.note || "Mise à jour du statut transporteur."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground pl-8">
                    Aucun événement de suivi enregistré pour le moment.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite : Coordonnées Client & Transporteur */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Informations Destinataire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Client :</span>
                <p className="font-semibold text-foreground text-sm">{order.customerName}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Téléphone :</span>
                <p className="font-mono font-semibold text-foreground">
                  <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                    {formatMoroccanPhone(order.phone)}
                  </a>
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Destination :</span>
                <p className="font-medium text-foreground">{order.city}</p>
                <p className="text-muted-foreground mt-0.5">{order.address}</p>
              </div>

              {order.shippingNote && (
                <div className="rounded-md bg-amber-50 p-2.5 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  <span className="font-semibold">Note pour le livreur :</span>
                  <p className="mt-0.5">{order.shippingNote}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4 text-sky-600" />
                Transporteur & Prise en Charge
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Société de livraison :</span>
                <p className="font-semibold text-foreground">
                  {order.courier ? order.courier.name : "Non encore assigné"}
                </p>
                {order.courier?.phone && (
                  <p className="text-muted-foreground font-mono mt-0.5">Tél : {order.courier.phone}</p>
                )}
              </div>

              <div>
                <span className="text-muted-foreground">Agent Call Center assigné :</span>
                <p className="font-semibold text-foreground">
                  {order.assignedTo ? order.assignedTo.name : "Non assigné"}
                </p>
              </div>

              <div className="border-t pt-2 flex items-center justify-between">
                <span className="font-semibold">Montant à encaisser :</span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {formatPriceMAD(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
