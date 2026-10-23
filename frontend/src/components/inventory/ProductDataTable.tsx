"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, Category } from "@/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPriceMAD } from "@/lib/utils";
import {
  Search,
  AlertTriangle,
  ArrowUpDown,
  Layers,
  Package,
  Pencil,
  Trash2,
  Boxes,
  MoreHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Eye,
  Power,
  CheckCircle2,
} from "lucide-react";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { QuickStockDialog } from "./QuickStockDialog";
import { ProductDetailDialog } from "./ProductDetailDialog";
import { ExportProductsButton } from "./ExportProductsButton";
import { DownloadPdfCatalogButton } from "./DownloadPdfCatalogButton";
import { toggleProductActiveAction } from "@/actions/inventory";

interface ProductDataTableProps {
  products: Product[];
  categories?: Category[];
  onProductUpdated?: (updatedProduct: Product) => void;
  onProductDeleted?: (deletedProductId: string) => void;
}

export function ProductDataTable({
  products,
  categories = [],
  onProductUpdated,
  onProductDeleted,
}: ProductDataTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortField, setSortField] = useState<"name" | "stock" | "margin">("stock");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);

  // Catégories uniques combinant la prop categories et les catégories des produits
  const availableCategories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    categories.forEach((c) => {
      if (c && c.id) map.set(c.id, { id: c.id, name: c.name });
    });
    products.forEach((p) => {
      if (p.category && p.category.id) {
        map.set(p.category.id, { id: p.category.id, name: p.category.name });
      } else if (p.categoryId) {
        map.set(p.categoryId, { id: p.categoryId, name: "Général" });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, products]);

  // Filtrage et Tri
  const filteredAndSorted = useMemo(() => {
    return products
      .filter((p) => {
        // Filtre Catégorie
        if (selectedCategoryId !== "ALL") {
          const matchCatId = p.categoryId === selectedCategoryId || p.category?.id === selectedCategoryId;
          if (!matchCatId) return false;
        }

        // Filtre Statut Actif / Inactif
        if (statusFilter === "active" && p.isActive === false) return false;
        if (statusFilter === "inactive" && p.isActive !== false) return false;

        // Filtre Stock (utilise le seuil personnalisé de chaque produit)
        const threshold = p.lowStockThreshold ?? 5;
        if (stockFilter === "low" && (p.stock > threshold || p.stock === 0)) return false;
        if (stockFilter === "out" && p.stock > 0) return false;

        // Filtre Recherche
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === "stock") {
          return sortAsc ? a.stock - b.stock : b.stock - a.stock;
        }
        if (sortField === "margin") {
          const marginA = a.salePrice - a.costPrice;
          const marginB = b.salePrice - b.costPrice;
          return sortAsc ? marginA - marginB : marginB - marginA;
        }
        return 0;
      });
  }, [products, search, selectedCategoryId, stockFilter, statusFilter, sortField, sortAsc]);

  // Calculs pagination
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  // Reset page helper
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategoryId(val);
    setCurrentPage(1);
  };

  const handleStockFilterChange = (val: "all" | "low" | "out") => {
    setStockFilter(val);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategoryId("ALL");
    setStockFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const toggleSort = (field: "name" | "stock" | "margin") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
    setIsDetailDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenStock = (product: Product) => {
    setStockProduct(product);
    setIsStockDialogOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    const currentStatus = product.isActive !== false;
    const newStatus = !currentStatus;
    setTogglingActiveId(product.id);
    try {
      const res = await toggleProductActiveAction(product.id, newStatus);
      if (res.success && res.data) {
        if (onProductUpdated) {
          onProductUpdated({ ...product, ...res.data });
        }
      }
    } finally {
      setTogglingActiveId(null);
    }
  };

  const isFiltered =
    search.trim() !== "" ||
    selectedCategoryId !== "ALL" ||
    stockFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Barre d'outils avec Recherche, Filtres Catégories et Filtres Stock */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Champ de recherche */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher produit, SKU..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Sélecteur de Catégorie */}
            <div className="w-full sm:w-[220px]">
              <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-9 text-xs bg-background">
                  <div className="flex items-center gap-2 truncate">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Toutes les catégories" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="ALL" className="text-xs">
                    Toutes les catégories ({products.length})
                  </SelectItem>
                  {availableCategories.map((cat) => {
                    const count = products.filter(
                      (p) => p.categoryId === cat.id || p.category?.id === cat.id
                    ).length;
                    return (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs">
                        {cat.name} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton réinitialiser si filtre actif */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Effacer filtres</span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Filtres Statut Actif / Inactif */}
            <div className="flex items-center rounded-lg border bg-muted/20 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("active");
                  setCurrentPage(1);
                }}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors flex items-center gap-1 ${
                  statusFilter === "active"
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Actifs
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("inactive");
                  setCurrentPage(1);
                }}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors flex items-center gap-1 ${
                  statusFilter === "inactive"
                    ? "bg-zinc-200 dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Inactifs
              </button>
            </div>

            {/* Filtres d'état du stock */}
            <div className="flex items-center rounded-lg border bg-muted/20 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleStockFilterChange("all")}
                className={`rounded-md px-2 py-1 font-medium transition-colors ${
                  stockFilter === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Stock
              </button>
              <button
                type="button"
                onClick={() => handleStockFilterChange("low")}
                className={`rounded-md px-2 py-1 font-medium transition-colors flex items-center gap-1 ${
                  stockFilter === "low"
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Produits dont le stock est inférieur ou égal à leur seuil d'alerte personnalisé"
              >
                <AlertTriangle className="h-3 w-3" />
                Alerte Stock
              </button>
              <button
                type="button"
                onClick={() => handleStockFilterChange("out")}
                className={`rounded-md px-2 py-1 font-medium transition-colors ${
                  stockFilter === "out"
                    ? "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Rupture
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground pl-1">
              <Layers className="h-4 w-4" />
              <span>
                <strong>{totalItems}</strong> réf.
              </span>
            </div>

            {/* Bouton Télécharger Catalogue PDF (Produits Actifs) */}
            <DownloadPdfCatalogButton
              products={filteredAndSorted}
              size="sm"
            />

            {/* Bouton Exporter Excel dans la barre d'outils du tableau */}
            <ExportProductsButton
              products={filteredAndSorted}
              totalCount={products.length}
              filteredCount={filteredAndSorted.length}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Tableau des Produits avec Colonnes Calibrées */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[140px] whitespace-nowrap font-semibold">
                  SKU
                </TableHead>
                <TableHead className="min-w-[280px] max-w-[440px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 text-xs font-semibold whitespace-nowrap"
                    onClick={() => toggleSort("name")}
                  >
                    Produit & Catégorie
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] text-right whitespace-nowrap font-semibold">
                  Prix d'Achat
                </TableHead>
                <TableHead className="w-[120px] text-right whitespace-nowrap font-semibold">
                  Prix de Vente
                </TableHead>
                <TableHead className="w-[140px] text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-mr-3 ml-auto h-8 text-xs font-semibold whitespace-nowrap"
                    onClick={() => toggleSort("margin")}
                  >
                    Marge Nette (DH & %)
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] text-center whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mx-auto h-8 text-xs font-semibold whitespace-nowrap"
                    onClick={() => toggleSort("stock")}
                  >
                    Stock
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] text-right whitespace-nowrap font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const margin = product.salePrice - product.costPrice;
                  const marginPct =
                    product.salePrice > 0
                      ? ((margin / product.salePrice) * 100).toFixed(0)
                      : "0";
                  const threshold = product.lowStockThreshold ?? 5;
                  const isOut = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= threshold;
                  const isActive = product.isActive !== false;
                  const isTogglingThis = togglingActiveId === product.id;

                  return (
                    <TableRow key={product.id} className="hover:bg-muted/40 transition-colors">
                      {/* SKU : Badge sans coupure de ligne */}
                      <TableCell className="w-[140px] whitespace-nowrap align-middle">
                        <span className="font-mono text-xs font-bold text-foreground tracking-tight px-2 py-1 rounded bg-muted/60 border border-border/50 inline-block whitespace-nowrap select-all">
                          {product.sku}
                        </span>
                      </TableCell>

                      {/* Nom & Catégorie avec Image, Statut Actif/Inactif et clic pour détails */}
                      <TableCell className="min-w-[280px] max-w-[440px] align-middle">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(product)}
                            className="relative group shrink-0 focus:outline-none"
                            title="Cliquer pour voir les détails"
                          >
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover border bg-muted/20 transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted/40 border flex items-center justify-center text-muted-foreground transition-colors group-hover:bg-muted/70">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </button>

                          <div className="flex flex-col min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(product)}
                              className="text-left font-semibold text-foreground text-xs line-clamp-2 leading-snug break-words hover:text-primary hover:underline transition-colors"
                              title={`Voir la fiche détaillée de « ${product.name} »`}
                            >
                              {product.name}
                            </button>

                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {/* Statut Actif / Inactif en 1-clic */}
                              <button
                                type="button"
                                disabled={isTogglingThis}
                                onClick={() => handleToggleActive(product)}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
                                  isActive
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                    : "bg-zinc-500/10 text-muted-foreground border-zinc-500/20 hover:bg-zinc-500/20"
                                }`}
                                title={
                                  isActive
                                    ? "Produit actif (Cliquer pour désactiver)"
                                    : "Produit inactif (Cliquer pour activer)"
                                }
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                                  }`}
                                />
                                {isActive ? "Actif" : "Inactif"}
                              </button>

                              {product.category && (
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  {product.category.name}
                                </span>
                              )}

                              {product.description && (
                                <span
                                  className="text-[10px] text-muted-foreground/70 truncate max-w-[140px]"
                                  title={product.description}
                                >
                                  &bull; {product.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Prix d'Achat */}
                      <TableCell className="w-[120px] text-right font-mono text-xs text-muted-foreground whitespace-nowrap align-middle">
                        {formatPriceMAD(product.costPrice)}
                      </TableCell>

                      {/* Prix de Vente */}
                      <TableCell className="w-[120px] text-right font-mono text-xs font-semibold text-foreground whitespace-nowrap align-middle">
                        {formatPriceMAD(product.salePrice)}
                      </TableCell>

                      {/* Marge Calculée */}
                      <TableCell className="w-[140px] text-right font-mono text-xs whitespace-nowrap align-middle">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            +{formatPriceMAD(margin)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {marginPct}% de marge
                          </span>
                        </div>
                      </TableCell>

                      {/* Stock & Alerte selon seuil personnalisé */}
                      <TableCell className="w-[120px] text-center whitespace-nowrap align-middle">
                        {isOut ? (
                          <Badge variant="destructive" className="font-bold gap-1 animate-pulse">
                            Rupture (0)
                          </Badge>
                        ) : isLowStock ? (
                          <Badge
                            className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 font-bold text-[11px]"
                            title={`Stock ≤ seuil d'alerte configuré (${threshold} pcs)`}
                          >
                            <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                            {product.stock} (≤ {threshold})
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-mono">
                            {product.stock} en stock
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="w-[120px] text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-1">
                          {/* Bouton Voir Détails */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDetail(product)}
                            title="Voir les détails et rentabilité du produit"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Bouton Ajuster Stock */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenStock(product)}
                            title="Ajustement rapide du stock"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Boxes className="h-4 w-4" />
                          </Button>

                          {/* Bouton Modifier */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                            title="Modifier le produit"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Menu contextuel */}
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
                                Actions Produit
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleOpenDetail(product)}
                                className="gap-2 cursor-pointer font-medium"
                              >
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                <span>Voir détails complets</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(product)}
                                className="gap-2 cursor-pointer"
                              >
                                <Power className="h-3.5 w-3.5" />
                                <span>
                                  {isActive ? "Désactiver le produit" : "Activer le produit"}
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(product)}
                                className="gap-2 cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Modifier fiche & seuil</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenStock(product)}
                                className="gap-2 cursor-pointer"
                              >
                                <Boxes className="h-3.5 w-3.5" />
                                <span>Ajuster stock</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenDelete(product)}
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Aucun produit trouvé avec ces critères de recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Barre de Pagination Complète */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-muted/10 text-xs text-muted-foreground">
          {/* Informations sur les éléments affichés */}
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>
              Affichage de{" "}
              <strong>{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> à{" "}
              <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> sur{" "}
              <strong>{totalItems}</strong> référence(s)
              {totalItems !== products.length && ` (filtré sur ${products.length} total)`}
            </span>
          </div>

          {/* Contrôles de taille de page et boutons de navigation */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            {/* Sélecteur d'éléments par page */}
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Lignes :</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[72px] text-xs bg-background">
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Boutons de navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
                title="Première page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                title="Page précédente"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              <span className="px-2 font-medium text-foreground whitespace-nowrap">
                Page {currentPage} sur {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                title="Page suivante"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                title="Dernière page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Modifier Produit */}
      <EditProductDialog
        product={editingProduct}
        categories={categories}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onProductUpdated={onProductUpdated}
      />

      {/* Modal Ajuster Stock */}
      <QuickStockDialog
        product={stockProduct}
        open={isStockDialogOpen}
        onOpenChange={setIsStockDialogOpen}
        onStockUpdated={onProductUpdated}
      />

      {/* Modal Supprimer Produit */}
      <DeleteProductDialog
        product={deletingProduct}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onProductDeleted={onProductDeleted}
        onProductUpdated={onProductUpdated}
      />

      {/* Modal Détails Complets Produit */}
      <ProductDetailDialog
        product={detailProduct}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onEditProduct={handleOpenEdit}
        onQuickStock={handleOpenStock}
        onProductUpdated={onProductUpdated}
      />
    </div>
  );
}
