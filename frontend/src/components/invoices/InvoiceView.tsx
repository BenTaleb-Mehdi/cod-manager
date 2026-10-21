"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { ArrowLeft, Printer, Phone, MapPin, PackageCheck, FileText, Tag } from "lucide-react";
import Link from "next/link";
import { QRCodeImage } from "@/components/ui/QRCodeImage";

type DocType = "label" | "invoice";

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
  };
}

export function InvoiceView({ invoice, order, store }: InvoiceViewProps) {
  const [docType, setDocType] = useState<DocType>("label");

  const shortOrderId =
    order.id.length > 8 ? order.id.slice(0, 8).toUpperCase() : order.id.toUpperCase();

  const addressQuery = [order.address, order.city, "Maroc"].filter(Boolean).join(", ");
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-4 print:p-0 print:m-0 print:max-w-none">
      {/* Configuration dynamique de la taille d'impression */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: ${docType === "label" ? "100mm 150mm" : "A4 portrait"};
                margin: ${docType === "label" ? "4mm" : "12mm"};
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
        }}
      />

      {/* Barre de contrôle : Sélecteur de document & Impression */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 print:hidden">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/orders">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Retour
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {/* Bascule entre Bon de colis et Facture A4 */}
          <div className="inline-flex rounded-md border bg-neutral-100 p-0.5">
            <button
              type="button"
              onClick={() => setDocType("label")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                docType === "label"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              Bon Colis (À coller)
            </button>
            <button
              type="button"
              onClick={() => setDocType("invoice")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                docType === "invoice"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Facture A4
            </button>
          </div>

          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs text-white bg-black hover:bg-neutral-800"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer {docType === "label" ? "l'étiquette" : "la facture"}
          </Button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. BON DE COMMANDE / ÉTIQUETTE COLIS A6 (À COLLER SUR LE COLIS) */}
      {/* ============================================================== */}
      {docType === "label" && (
        <div className="flex justify-center print:block">
          <div className="w-[100mm] min-h-[145mm] bg-white text-black p-3.5 border-2 border-black rounded-lg text-xs font-sans space-y-2 shadow-sm print:border-2 print:border-black print:shadow-none print:w-[100mm] print:p-2.5">
            {/* Expéditeur & Ville Destination */}
            <div className="flex items-stretch border-2 border-black rounded overflow-hidden">
              <div className="flex-1 p-2 bg-white border-r-2 border-black">
                <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-500 block">
                  EXPÉDITEUR
                </span>
                <div className="font-black text-sm uppercase tracking-tight text-black">
                  {store.storeName}
                </div>
                <p className="text-[9px] text-neutral-600 line-clamp-1">{store.address}</p>
                <p className="text-[9px] font-bold text-neutral-800 mt-0.5">Tél : {store.phone}</p>
              </div>

              <div className="w-[38%] bg-black text-white p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">
                  VILLE
                </span>
                <span className="text-base font-black uppercase tracking-tight leading-tight">
                  {order.city}
                </span>
                <span className="text-[8px] font-mono text-neutral-400 mt-0.5">
                  #{shortOrderId}
                </span>
              </div>
            </div>

            {/* Destinataire */}
            <div className="border-2 border-black rounded p-2 bg-neutral-50 space-y-1">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-1">
                <span className="text-[8px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> DESTINATAIRE (LIVRAISON)
                </span>
                <span className="text-[8px] font-mono font-bold text-neutral-500">
                  {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>

              <div className="text-sm font-black uppercase text-neutral-900 pt-0.5">
                {order.customerName}
              </div>

              <div className="inline-flex items-center gap-1.5 bg-black text-white px-2 py-0.5 rounded font-mono font-black text-xs my-0.5">
                <Phone className="h-3 w-3" />
                <span>{formatMoroccanPhone(order.phone)}</span>
              </div>

              <p className="text-[11px] font-semibold text-neutral-800 leading-tight">
                {order.address}
              </p>
            </div>

            {/* Articles */}
            <div className="border-2 border-black rounded overflow-hidden">
              <div className="bg-black text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider flex justify-between">
                <span className="flex items-center gap-1">
                  <PackageCheck className="h-2.5 w-2.5" /> CONTENU DU COLIS
                </span>
                <span>QTÉ</span>
              </div>

              <div className="divide-y divide-neutral-200 text-[10px] bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="px-2 py-1 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-neutral-900 block truncate">{item.name}</span>
                      <span className="text-[8px] font-mono text-neutral-500">REF: {item.sku}</span>
                    </div>
                    <span className="font-mono font-black text-xs bg-neutral-100 text-black px-1.5 py-0.5 rounded border border-neutral-300 shrink-0">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Montant COD */}
            <div className="border-2 border-black rounded p-2 text-center bg-black text-white">
              <span className="text-[9px] font-bold tracking-wider uppercase block text-neutral-300">
                MONTANT À ENCAISSER (ESPÈCES / COD)
              </span>
              <div className="text-2xl font-black font-mono tracking-tight my-0.5">
                {formatPriceMAD(invoice.total)}
              </div>
              <span className="text-[8px] text-neutral-300 block uppercase">
                Livraison : {invoice.shippingCost > 0 ? formatPriceMAD(invoice.shippingCost) : "Gratuite"}
              </span>
            </div>

            {/* Localisation GPS / Google Maps pour le Livreur */}
            <div className="border-2 border-black rounded p-2 flex items-center justify-between gap-3 bg-neutral-50">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-black">
                  <MapPin className="h-3.5 w-3.5 text-black shrink-0" />
                  <span>LOCALISATION GPS (GOOGLE MAPS)</span>
                </div>
                <p className="text-[9px] text-neutral-600 leading-tight">
                  Scannez avec la caméra du téléphone pour ouvrir l'itinéraire sur <strong>Google Maps</strong>.
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-black hover:underline truncate max-w-[210px] pt-0.5"
                  title="Ouvrir l'adresse dans Google Maps"
                >
                  📍 {order.address}, {order.city}
                </a>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Cliquer pour tester ou ouvrir dans Google Maps"
                className="flex flex-col items-center bg-white p-1 rounded border-2 border-black shrink-0 hover:bg-neutral-50 transition-colors"
              >
                <QRCodeImage value={mapsUrl} size={76} quietZone={3} />
                <span className="text-[6.5px] font-mono font-black uppercase text-black mt-1">
                  GOOGLE MAPS ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FORMAT FACTURE A4 STANDARD                                 */}
      {/* ============================================================== */}
      {docType === "invoice" && (
        <div className="bg-white text-black p-8 border rounded-lg shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Header Facture */}
          <div className="flex items-start justify-between border-b pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{store.storeName}</h1>
              <p className="text-xs text-neutral-600 mt-1">{store.address}</p>
              <p className="text-xs text-neutral-600">Tél : {store.phone}</p>
              {store.email && <p className="text-xs text-neutral-600">Email : {store.email}</p>}
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-3 py-1 rounded">
                FACTURE COMMERCIALE
              </span>
              <p className="font-mono text-base font-bold pt-1">{invoice.invoiceNumber}</p>
              <p className="text-xs text-neutral-500">
                Date : {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-xs font-mono text-neutral-500">Commande #{shortOrderId}</p>
            </div>
          </div>

          {/* Client & Détails d'expédition */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b text-xs">
            <div>
              <span className="font-bold text-neutral-500 uppercase text-[10px]">Facturé à :</span>
              <p className="font-bold text-sm text-neutral-900 mt-1">{order.customerName}</p>
              <p className="font-mono font-semibold mt-0.5">{formatMoroccanPhone(order.phone)}</p>
              <p className="text-neutral-600 mt-1 leading-relaxed">{order.address}</p>
              <p className="font-semibold text-neutral-900">{order.city}, Maroc</p>
            </div>

            <div className="text-right">
              <span className="font-bold text-neutral-500 uppercase text-[10px]">Modalités :</span>
              <p className="font-medium mt-1">Règlement : Espèces à la livraison (COD)</p>
              <p className="text-neutral-600 mt-1">
                Statut : <strong className="text-neutral-900">{invoice.status === "PAID" ? "Payée" : "À encaisser"}</strong>
              </p>
              {order.trackingNumber && (
                <p className="font-mono text-neutral-600 mt-1">N° Suivi : {order.trackingNumber}</p>
              )}
            </div>
          </div>

          {/* Tableau des articles calibré */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse table-fixed">
              <thead>
                <tr className="border-b-2 border-black text-neutral-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="w-[18%] py-3 pr-2">Réf / SKU</th>
                  <th className="w-[42%] py-3 px-3">Description</th>
                  <th className="w-[12%] py-3 px-2 text-center">Quantité</th>
                  <th className="w-[14%] py-3 px-3 text-right whitespace-nowrap">Prix Unitaire</th>
                  <th className="w-[14%] py-3 pl-3 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 pr-2 font-mono text-[11px] text-neutral-500 align-top">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900 leading-snug align-top">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-neutral-800 align-top">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-neutral-700 whitespace-nowrap align-top">
                      {formatPriceMAD(item.price)}
                    </td>
                    <td className="py-3.5 pl-3 text-right font-mono font-bold text-neutral-900 whitespace-nowrap align-top">
                      {formatPriceMAD(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end border-t border-neutral-300 pt-4">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Sous-total articles :</span>
                <span className="font-mono font-semibold">{formatPriceMAD(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Frais de livraison :</span>
                <span className="font-mono font-semibold">
                  {invoice.shippingCost > 0 ? formatPriceMAD(invoice.shippingCost) : "Gratuit"}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-black pt-2 text-sm font-bold text-neutral-900">
                <span>Total Net à Payer :</span>
                <span className="font-mono text-base font-black">{formatPriceMAD(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Bas de page A4 */}
          <div className="border-t mt-12 pt-4 text-center text-[10px] text-neutral-500">
            <p>Merci pour votre commande chez {store.storeName}.</p>
            <p className="mt-0.5">Pour tout service après-vente, contactez le {store.phone}.</p>
          </div>
        </div>
      )}
    </div>
  );
}