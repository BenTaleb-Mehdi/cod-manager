"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { ArrowLeft, Printer, FileText, Receipt, QrCode } from "lucide-react";
import Link from "next/link";
import { QRCodeImage } from "@/components/ui/QRCodeImage";

interface InvoiceViewProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    createdAt: string;
  };
  order: {
    id: string;
    customerName: string;
    phone: string;
    city: string;
    address: string;
    trackingNumber?: string | null;
    status: string;
    items: Array<{
      id: string;
      sku: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  };
  store: {
    storeName: string;
    phone: string;
    email?: string | null;
    address: string;
    ice?: string | null;
    taxNumber?: string | null;
    patente?: string | null;
  };
}

export function InvoiceView({ invoice, order, store }: InvoiceViewProps) {
  const [printFormat, setPrintFormat] = useState<"a4" | "thermal">("a4");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const qrUrl = origin
    ? `${origin}/orders/${order.id}/tracking`
    : `/orders/${order.id}/tracking`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 print:p-0 print:m-0 print:max-w-none print:space-y-0">
      {/* Barre d'actions & navigation - Masquée à l'impression */}
      <div className="space-y-3 print:hidden">
        {/* Lien de retour discret et propre */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href="/orders">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Retour aux Commandes
            </Link>
          </Button>

          <span className="font-mono text-xs text-muted-foreground">
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Titre & Barre de contrôles parfaitement alignés */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {printFormat === "a4"
                  ? `Facture ${invoice.invoiceNumber}`
                  : `Ticket de Livraison (80mm)`}
              </h1>
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  invoice.status === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {invoice.status === "PAID" ? "Payée / Encaissée" : "À encaisser (COD)"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client : <strong className="text-foreground">{order.customerName}</strong> ({order.city}) • {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Contrôles de format et bouton d'impression (Toujours sur une seule ligne) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            {/* Sélecteur de format */}
            <div className="inline-flex items-center rounded-lg border bg-muted/60 p-0.5">
              <button
                type="button"
                onClick={() => setPrintFormat("a4")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  printFormat === "a4"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Facture A4</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat("thermal")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  printFormat === "thermal"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Ticket 80mm</span>
              </button>
            </div>

            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 h-9 bg-primary shadow-sm hover:bg-primary/90"
            >
              <Printer className="h-4 w-4" />
              <span>
                {printFormat === "a4" ? "Imprimer Facture A4" : "Imprimer Ticket"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. FORMAT FACTURE A4                                          */}
      {/* ============================================================== */}
      {printFormat === "a4" && (
        <div
          id="printable-invoice-a4"
          className="rounded-xl border bg-white text-slate-900 p-8 shadow-sm print:border-0 print:shadow-none print:p-0 print:m-0"
        >
          {/* En-tête Facture */}
          <div className="flex items-start justify-between border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {store.storeName}
              </h2>
              <p className="text-xs text-slate-600 mt-1">{store.address}</p>
              <p className="text-xs text-slate-600">Tél : {store.phone}</p>
              {store.email && <p className="text-xs text-slate-600">Email : {store.email}</p>}

              {/* Mentions légales marocaines obligatoires */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                {store.ice && <span><strong>ICE :</strong> {store.ice}</span>}
                {store.taxNumber && <span><strong>IF :</strong> {store.taxNumber}</span>}
                {store.patente && <span><strong>Patente :</strong> {store.patente}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              {/* QR Code pour scanner et afficher les détails de la commande */}
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white shadow-xs">
                <QRCodeImage value={qrUrl} size={80} />
                <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-tight text-center">
                  Scan Commande
                </span>
              </div>

              <div className="text-right space-y-1">
                <div className="inline-block bg-slate-900 text-white font-mono font-bold text-sm px-3 py-1 rounded">
                  FACTURE
                </div>
                <p className="font-mono text-base font-bold text-slate-900 pt-1">
                  {invoice.invoiceNumber}
                </p>
                <p className="text-xs text-slate-500">
                  Date : {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <div className="pt-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      invoice.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {invoice.status === "PAID" ? "Payée à la livraison" : "À encaisser (COD)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées Client */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Facturé à (Client) :
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">{order.customerName}</p>
              <p className="text-slate-600 font-mono mt-0.5">{formatMoroccanPhone(order.phone)}</p>
              <p className="text-slate-600 mt-1">{order.address}</p>
              <p className="text-slate-900 font-semibold">{order.city}, Maroc</p>
            </div>

            <div className="text-right">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Détails Expédition :
              </span>
              <p className="font-medium text-slate-800 mt-1">Mode de règlement : Espèces (Cash on Delivery)</p>
              {order.trackingNumber && (
                <p className="font-mono text-slate-600 mt-0.5">
                  N° de suivi colis : <strong>{order.trackingNumber}</strong>
                </p>
              )}
              <p className="text-slate-500 mt-1">Ville de destination : {order.city}</p>
            </div>
          </div>

          {/* Tableau des Articles */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Réf / SKU</th>
                  <th className="py-2.5">Désignation</th>
                  <th className="py-2.5 text-center">Quantité</th>
                  <th className="py-2.5 text-right">Prix Unitaire</th>
                  <th className="py-2.5 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-mono font-medium text-slate-700">{item.sku}</td>
                    <td className="py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatPriceMAD(item.price)}</td>
                    <td className="py-3 text-right font-mono font-semibold">{formatPriceMAD(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end border-t pt-4">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total articles :</span>
                <span className="font-mono font-semibold">{formatPriceMAD(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison :</span>
                <span className="font-mono font-semibold">
                  {invoice.shippingCost > 0 ? formatPriceMAD(invoice.shippingCost) : "Gratuit"}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900">
                <span>Total TTC (Dirhams) :</span>
                <span className="font-mono text-base text-slate-900">
                  {formatPriceMAD(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Pied de page Facture */}
          <div className="border-t mt-8 pt-4 text-center text-[10px] text-slate-500">
            <p>
              Merci pour votre commande chez {store.storeName} ! Pour toute assistance ou réclamation, contactez notre service client au {store.phone}.
            </p>
            <p className="mt-1 font-mono">
              Document généré électroniquement • Conforme à la réglementation du commerce électronique au Maroc
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FORMAT TICKET THERMIQUE 80MM (Format Caisse / Livreur COD)  */}
      {/* ============================================================== */}
      {printFormat === "thermal" && (
        <div className="flex justify-center print:block">
          <div
            id="printable-invoice-thermal"
            className="w-[80mm] max-w-full bg-white text-slate-950 p-4 font-mono text-xs border border-dashed border-slate-300 shadow-sm rounded-lg print:border-none print:shadow-none print:p-0 print:w-[80mm] print:mx-auto"
          >
            {/* Header Boutique */}
            <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-400">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {store.storeName}
              </h2>
              <p className="text-[10px] text-slate-600">{store.address}</p>
              <p className="text-[10px] text-slate-600">Tél : {store.phone}</p>
              {store.ice && <p className="text-[9px] text-slate-500">ICE : {store.ice}</p>}
            </div>

            {/* Titre Ticket & Date */}
            <div className="py-2 border-b border-dashed border-slate-400 text-center">
              <span className="font-bold text-xs uppercase tracking-tight block">
                BORDEREAU LIVRAISON COD
              </span>
              <span className="text-[10px] text-slate-600 block">
                N° {invoice.invoiceNumber}
              </span>
              <span className="text-[9px] text-slate-500 block">
                Date : {new Date(invoice.createdAt).toLocaleDateString("fr-FR")} {new Date(invoice.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Info Client & Expédition (Clé pour le livreur) */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                CLIENT DESTINATAIRE :
              </div>
              <div className="font-bold text-xs text-slate-900 uppercase">
                {order.customerName}
              </div>
              <div className="text-xs font-bold text-slate-900 py-0.5">
                📞 {formatMoroccanPhone(order.phone)}
              </div>
              <div className="text-[11px] font-semibold text-slate-800">
                Ville : {order.city}
              </div>
              <div className="text-[10px] text-slate-600 leading-tight">
                {order.address}
              </div>

              {order.trackingNumber && (
                <div className="mt-2 pt-1 border-t border-dotted border-slate-300">
                  <span className="text-[9px] text-slate-500 uppercase block">Code Suivi Colis :</span>
                  <span className="font-bold text-xs tracking-wider block text-slate-900">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Articles */}
            <div className="py-2 border-b border-dashed border-slate-400">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-dotted border-slate-300 text-[9px] text-slate-500 uppercase">
                    <th className="py-1">Article</th>
                    <th className="py-1 text-center">Qté</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-slate-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1.5 pr-1 font-sans">
                        <div className="font-medium text-slate-900 line-clamp-1">{item.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{item.sku}</div>
                      </td>
                      <td className="py-1.5 text-center font-bold">{item.quantity}</td>
                      <td className="py-1.5 text-right font-semibold whitespace-nowrap">
                        {formatPriceMAD(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux & Montant COD à encaisser */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Sous-total :</span>
                <span>{formatPriceMAD(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Livraison :</span>
                <span>{invoice.shippingCost > 0 ? formatPriceMAD(invoice.shippingCost) : "Gratuite"}</span>
              </div>

              {/* Cadre spécial pour le livreur */}
              <div className="mt-2 border-2 border-slate-900 rounded p-2 text-center bg-slate-50">
                <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-600">
                  MONTANT COD À ENCAISSER
                </span>
                <span className="text-base font-black text-slate-900 block my-0.5 tracking-tight">
                  {formatPriceMAD(invoice.total)}
                </span>
                <span className="text-[9px] block text-slate-600 font-medium uppercase">
                  Espèces à la livraison
                </span>
              </div>
            </div>

            {/* QR Code pour scan rapide livreur / client */}
            <div className="py-2.5 border-b border-dashed border-slate-400 flex flex-col items-center justify-center text-center">
              <QRCodeImage value={qrUrl} size={76} />
              <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
                Scanner pour détails & localisation
              </span>
            </div>

            {/* Footer Ticket */}
            <div className="pt-2 text-center text-[9px] text-slate-500 space-y-0.5">
              <p>Merci pour votre commande !</p>
              <p>Service client : {store.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
