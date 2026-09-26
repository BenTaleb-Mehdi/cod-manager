import React from "react";
import { getSuppliersAction } from "@/actions/suppliers";
import { getInventoryAction } from "@/actions/inventory";
import { AddSupplierDialog } from "@/components/suppliers/AddSupplierDialog";
import { ReceiveStockDialog } from "@/components/suppliers/ReceiveStockDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { Building2, DollarSign, PackageCheck, Phone, MapPin } from "lucide-react";

export default async function SuppliersPage() {
  const [suppliersRes, inventoryRes] = await Promise.all([
    getSuppliersAction(),
    getInventoryAction(),
  ]);

  const suppliers = suppliersRes.success && suppliersRes.data ? suppliersRes.data : [];
  const products = inventoryRes.success && inventoryRes.data ? inventoryRes.data.products : [];

  const totalBalanceDue = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);
  const totalSupplyOrders = suppliers.reduce((sum, s) => sum + s.ordersCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Gestion des Fournisseurs & Approvisionnements
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi des dettes fournisseurs, achats de marchandises et réassort automatique des stocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AddSupplierDialog />
          <ReceiveStockDialog suppliers={suppliers} products={products} />
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Fournisseurs
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {suppliers.length} partenaires
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actifs dans votre catalogue</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-200 dark:border-amber-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Solde Total Dû (Dettes Achats)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
              {formatPriceMAD(totalBalanceDue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Montant à régler aux fournisseurs</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bons de Réception
            </CardTitle>
            <PackageCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {totalSupplyOrders} réceptions
            </div>
            <p className="text-xs text-muted-foreground mt-1">Validées et injectées en stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Table des Fournisseurs */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Contact & Ville</TableHead>
              <TableHead className="text-center">Produits Liés</TableHead>
              <TableHead className="text-center">Réceptions</TableHead>
              <TableHead className="text-right">Solde Dû (DH)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">{supplier.name}</div>
                    {supplier.address && (
                      <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                        {supplier.address}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-mono text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {formatMoroccanPhone(supplier.phone)}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {supplier.city}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-bold text-xs">
                    {supplier.productsCount}
                  </TableCell>

                  <TableCell className="text-center font-bold text-xs">
                    {supplier.ordersCount}
                  </TableCell>

                  <TableCell className="text-right font-mono font-bold text-sm">
                    <span className={supplier.balanceDue > 0 ? "text-amber-600" : "text-emerald-600"}>
                      {formatPriceMAD(supplier.balanceDue)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Aucun fournisseur enregistré. Cliquez sur "Nouveau Fournisseur" pour débuter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
