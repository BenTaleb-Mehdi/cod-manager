import React from "react";
import { getInvoicePrintDataAction } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoicePrintActions } from "@/components/invoices/InvoicePrintActions";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getInvoicePrintDataAction(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { invoice, order, store } = result.data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Actions barre (invisible lors de l'impression) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Retour aux Commandes
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Facture {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-muted-foreground">
              Commande #{order.id} • Statut : {invoice.status === "PAID" ? "Payée / Encaissée" : "En attente de paiement (COD)"}
            </p>
          </div>
        </div>

        {/* Client component pour déclencher window.print() */}
        <InvoicePrintActions />
      </div>

      {/* Facture format A4 imprimable */}
      <div
        id="printable-invoice"
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
              {order.items.map((item: any) => (
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
    </div>
  );
}
