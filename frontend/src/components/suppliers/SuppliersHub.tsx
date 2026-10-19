"use client";

import React, { useState, useMemo } from "react";
import { Supplier, Product } from "@/types";
import { AddSupplierDialog } from "./AddSupplierDialog";
import { ReceiveStockDialog } from "./ReceiveStockDialog";
import { EditSupplierDialog } from "./EditSupplierDialog";
import { PaySupplierDialog } from "./PaySupplierDialog";
import { DeleteSupplierDialog } from "./DeleteSupplierDialog";
import { SupplierDetailDialog } from "./SupplierDetailDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import {
  Building2,
  DollarSign,
  PackageCheck,
  Phone,
  MapPin,
  Search,
  Pencil,
  Trash2,
  CreditCard,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { getSuppliersAction } from "@/actions/suppliers";

interface SuppliersHubProps {
  initialSuppliers: Supplier[];
  products: Product[];
}

export function SuppliersHub({ initialSuppliers, products }: SuppliersHubProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState("");
  const [balanceFilter, setBalanceFilter] = useState<"all" | "debt" | "paid">("all");
  const [sortField, setSortField] = useState<"name" | "balance" | "orders">("balance");
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default highest debt first

  // Modals state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSupplierCreated = (newSupplier: Supplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleStockReceived = async () => {
    try {
      const res = await getSuppliersAction();
      if (res.success && res.data) {
        setSuppliers(res.data);
      }
    } catch (err) {
      console.error("Failed to reload suppliers after stock receipt:", err);
    }
  };

  // Handlers for state mutation
  const handleSupplierUpdated = (updated: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  };

  const handleSupplierDeleted = (deletedId: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== deletedId));
  };

  // KPIs
  const totalBalanceDue = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);
  const totalSupplyOrders = suppliers.reduce((sum, s) => sum + s.ordersCount, 0);

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    return suppliers
      .filter((s) => {
        if (balanceFilter === "debt" && s.balanceDue <= 0) return false;
        if (balanceFilter === "paid" && s.balanceDue > 0) return false;

        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === "balance") {
          return sortAsc
            ? a.balanceDue - b.balanceDue
            : b.balanceDue - a.balanceDue;
        }
        if (sortField === "orders") {
          return sortAsc
            ? a.ordersCount - b.ordersCount
            : b.ordersCount - a.ordersCount;
        }
        return 0;
      });
  }, [suppliers, search, balanceFilter, sortField, sortAsc]);

  const toggleSort = (field: "name" | "balance" | "orders") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec boutons de création */}
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
          <AddSupplierDialog onSupplierCreated={handleSupplierCreated} />
          <ReceiveStockDialog
            suppliers={suppliers}
            products={products}
            onSuccess={handleStockReceived}
          />
        </div>
      </div>

      {/* Cartes statistiques dynamiques */}
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

      {/* Barre d'outils : Recherche et Filtres */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher fournisseur, ville, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/20 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setBalanceFilter("all")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                balanceFilter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tous ({suppliers.length})
            </button>
            <button
              type="button"
              onClick={() => setBalanceFilter("debt")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors flex items-center gap-1 ${
                balanceFilter === "debt"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Avec Solde Dû ({suppliers.filter((s) => s.balanceDue > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setBalanceFilter("paid")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                balanceFilter === "paid"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              À Jour ({suppliers.filter((s) => s.balanceDue === 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Table des Fournisseurs avec Colonne Actions */}
      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 text-xs font-semibold"
                  onClick={() => toggleSort("name")}
                >
                  Fournisseur & Ville
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>Contact Téléphonique</TableHead>
              <TableHead className="text-center">Produits Liés</TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mx-auto h-8 text-xs font-semibold"
                  onClick={() => toggleSort("orders")}
                >
                  Réceptions
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-mr-3 ml-auto h-8 text-xs font-semibold"
                  onClick={() => toggleSort("balance")}
                >
                  Solde Dû (DH)
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-muted/40 transition-colors">
                  {/* Fournisseur & Ville */}
                  <TableCell>
                    <div className="font-semibold text-foreground">{supplier.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{supplier.city}</span>
                      {supplier.address && (
                        <span className="truncate max-w-[200px]" title={supplier.address}>
                          &bull; {supplier.address}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <span className="font-mono text-xs text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatMoroccanPhone(supplier.phone)}
                    </span>
                  </TableCell>

                  {/* Produits Liés */}
                  <TableCell className="text-center font-bold text-xs">
                    <Badge variant="outline" className="font-mono">
                      {supplier.productsCount}
                    </Badge>
                  </TableCell>

                  {/* Réceptions */}
                  <TableCell className="text-center font-bold text-xs">
                    <Badge variant="secondary" className="font-mono">
                      {supplier.ordersCount}
                    </Badge>
                  </TableCell>

                  {/* Solde Dû */}
                  <TableCell className="text-right font-mono font-bold text-sm">
                    {supplier.balanceDue > 0 ? (
                      <Badge variant="destructive" className="font-mono font-bold">
                        {formatPriceMAD(supplier.balanceDue)}
                      </Badge>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        À jour (0 DH)
                      </span>
                    )}
                  </TableCell>

                  {/* Actions directes + Menu contextuel */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Bouton Payer / Régler si solde dû */}
                      {supplier.balanceDue > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsPayOpen(true);
                          }}
                          title="Régler solde fournisseur"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Bouton Détail */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDetailOpen(true);
                        }}
                        title="Consulter historique & produits"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Bouton Modifier */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsEditOpen(true);
                        }}
                        title="Modifier coordonnées"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs">
                            Actions Fournisseur
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setIsDetailOpen(true);
                            }}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Voir détails & réceptions</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setIsEditOpen(true);
                            }}
                            className="gap-2 cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Modifier les coordonnées</span>
                          </DropdownMenuItem>
                          {supplier.balanceDue > 0 && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsPayOpen(true);
                              }}
                              className="gap-2 cursor-pointer text-amber-600 dark:text-amber-400"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>Enregistrer un règlement</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setIsDeleteOpen(true);
                            }}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Aucun fournisseur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <EditSupplierDialog
        supplier={selectedSupplier}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSupplierUpdated={handleSupplierUpdated}
      />

      <PaySupplierDialog
        supplier={selectedSupplier}
        open={isPayOpen}
        onOpenChange={setIsPayOpen}
        onPaymentSuccess={handleSupplierUpdated}
      />

      <DeleteSupplierDialog
        supplier={selectedSupplier}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSupplierDeleted={handleSupplierDeleted}
      />

      <SupplierDetailDialog
        supplier={selectedSupplier}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
