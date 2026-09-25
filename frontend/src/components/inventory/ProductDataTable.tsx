"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types";
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
import { formatPriceMAD } from "@/lib/utils";
import { Search, AlertTriangle, ArrowUpDown, Layers } from "lucide-react";

interface ProductDataTableProps {
  products: Product[];
}

export function ProductDataTable({ products }: ProductDataTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "stock" | "margin">("stock");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredAndSorted = useMemo(() => {
    return products
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
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
  }, [products, search, sortField, sortAsc]);

  const toggleSort = (field: "name" | "stock" | "margin") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher produit, SKU, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>
            <strong>{filteredAndSorted.length}</strong> produit(s) référencé(s)
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">SKU</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 text-xs font-semibold"
                  onClick={() => toggleSort("name")}
                >
                  Produit & Catégorie
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Prix d'Achat</TableHead>
              <TableHead className="text-right">Prix de Vente</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-mr-3 ml-auto h-8 text-xs font-semibold"
                  onClick={() => toggleSort("margin")}
                >
                  Marge Nette (DH & %)
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mx-auto h-8 text-xs font-semibold"
                  onClick={() => toggleSort("stock")}
                >
                  Stock
                  <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((product) => {
                const margin = product.salePrice - product.costPrice;
                const marginPct =
                  product.salePrice > 0
                    ? ((margin / product.salePrice) * 100).toFixed(0)
                    : "0";
                const isLowStock = product.stock <= 5;

                return (
                  <TableRow key={product.id}>
                    {/* SKU */}
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {product.sku}
                    </TableCell>

                    {/* Nom & Catégorie */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{product.name}</span>
                        {product.category && (
                          <span className="text-[11px] text-muted-foreground">
                            {product.category.name}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Prix d'Achat */}
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {formatPriceMAD(product.costPrice)}
                    </TableCell>

                    {/* Prix de Vente */}
                    <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
                      {formatPriceMAD(product.salePrice)}
                    </TableCell>

                    {/* Marge Calculée */}
                    <TableCell className="text-right font-mono text-xs">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatPriceMAD(margin)}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {marginPct}% de marge
                        </span>
                      </div>
                    </TableCell>

                    {/* Stock & Alerte Visuelle <= 5 */}
                    <TableCell className="text-center">
                      {isLowStock ? (
                        <div className="flex items-center justify-center gap-1">
                          <Badge variant="destructive" className="gap-1 animate-pulse font-bold">
                            <AlertTriangle className="h-3 w-3" />
                            {product.stock} restants
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="font-mono">
                          {product.stock} en stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
