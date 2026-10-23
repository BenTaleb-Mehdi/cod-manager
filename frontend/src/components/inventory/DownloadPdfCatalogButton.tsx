"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Printer } from "lucide-react";
import { Product } from "@/types";
import { printActiveProductsCatalog } from "@/lib/pdf-catalog";

interface DownloadPdfCatalogButtonProps {
  products: Product[];
  storeName?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DownloadPdfCatalogButton({
  products,
  storeName,
  variant = "outline",
  size = "sm",
  className = "",
}: DownloadPdfCatalogButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Uniquement les produits actifs
  const activeProducts = products.filter((p) => p.isActive !== false);
  const activeCount = activeProducts.length;

  const handleDownloadPdf = async () => {
    if (activeCount === 0) {
      alert("Aucun produit actif n'est disponible pour générer le catalogue.");
      return;
    }

    setIsGenerating(true);
    try {
      await printActiveProductsCatalog(products, {
        storeName: storeName || "Maison MÉRAF",
        website: "meraf.store",
      });
    } catch (err) {
      console.error("Erreur lors de la génération du catalogue PDF :", err);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={isGenerating || activeCount === 0}
      onClick={handleDownloadPdf}
      title="Télécharger le catalogue PDF des produits actifs avec photos (Format A4 imprimable)"
      className={`gap-1.5 border-rose-500/30 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:text-rose-400 dark:border-rose-500/30 dark:hover:bg-rose-950/40 shadow-sm transition-all ${className}`}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
      ) : (
        <FileText className="h-4 w-4 text-rose-600 shrink-0" />
      )}
      <span className="font-semibold">Catalogue PDF</span>
      {activeCount > 0 && (
        <span className="ml-1 rounded-full bg-rose-100 dark:bg-rose-950/70 px-1.5 py-0.2 text-[10px] font-bold text-rose-800 dark:text-rose-300">
          {activeCount} actifs
        </span>
      )}
    </Button>
  );
}
