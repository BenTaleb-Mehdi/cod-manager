"use client";

import React, { useState } from "react";
import { ProductDataTable } from "@/components/inventory/ProductDataTable";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { AddCategoryDialog } from "@/components/inventory/AddCategoryDialog";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/moroccan-data";
import { Product, Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceMAD } from "@/lib/utils";
import { Boxes, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const handleProductCreated = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev]);
  };

  // Statistiques d'inventaire
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalCostValue = products.reduce((acc, p) => acc + p.costPrice * p.stock, 0);
  const averageMarginPct =
    products.length > 0
      ? (
          products.reduce(
            (acc, p) => acc + ((p.salePrice - p.costPrice) / p.salePrice) * 100,
            0
          ) / products.length
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Top Header avec Boutons d'Action / Modals */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Inventaire & Rentabilité Produits
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi des niveaux de stock physiques, alertes de réapprovisionnement et marges bénéficiaires directes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Modal Ajouter Catégorie */}
          <AddCategoryDialog onCategoryCreated={handleCategoryCreated} />

          {/* Modal Ajouter Produit */}
          <AddProductDialog
            categories={categories}
            onProductCreated={handleProductCreated}
          />
        </div>
      </div>

      {/* Mini Cartes de Synthèse de Stock */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Produits
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {products.length} références
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStockUnits} unités physiques en stock
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-red-200 dark:border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Alerte Rupture (&le; 5 unités)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
              {lowStockCount} produits
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Réapprovisionnement urgent requis
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Valeur du Stock (Achat)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatPriceMAD(totalCostValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Capital immobilisé en entrepôt
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Marge Moyenne Catalogue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              {averageMarginPct}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculé sur le prix de vente conseillé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau Haute Performance de l'Inventaire avec alertes stock */}
      <ProductDataTable products={products} />
    </div>
  );
}
