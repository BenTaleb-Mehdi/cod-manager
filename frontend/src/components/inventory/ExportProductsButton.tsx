"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileSpreadsheet, Download, FileText, Check, Printer } from "lucide-react";
import { Product } from "@/types";
import { exportProductsToExcel, exportProductsToCSV } from "@/lib/export-products";
import { printActiveProductsCatalog } from "@/lib/pdf-catalog";

interface ExportProductsButtonProps {
  products: Product[];
  totalCount?: number;
  filteredCount?: number;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ExportProductsButton({
  products,
  totalCount,
  filteredCount,
  label = "Exporter Excel",
  variant = "outline",
  size = "sm",
  className = "",
}: ExportProductsButtonProps) {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleExport = async (format: "excel" | "csv" | "pdf") => {
    if (!products || products.length === 0) {
      alert("Aucun produit à exporter.");
      return;
    }

    if (format === "excel") {
      exportProductsToExcel(products);
      setDownloadedFormat("excel");
    } else if (format === "csv") {
      exportProductsToCSV(products);
      setDownloadedFormat("csv");
    } else if (format === "pdf") {
      await printActiveProductsCatalog(products, {
        website: "meraf.store",
      });
      setDownloadedFormat("pdf");
    }

    setTimeout(() => {
      setDownloadedFormat(null);
    }, 2500);
  };

  const countDisplay = products.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-1.5 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-950/40 shadow-sm transition-all ${className}`}
        >
          {downloadedFormat ? (
            <Check className="h-4 w-4 text-emerald-600 animate-bounce" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-semibold">{label}</span>
          {countDisplay > 0 && (
            <span className="ml-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              {countDisplay}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 text-xs">
        <DropdownMenuLabel className="text-xs flex items-center justify-between">
          <span>Exporter le catalogue</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            {countDisplay} article{countDisplay > 1 ? "s" : ""}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="cursor-pointer gap-2.5 py-2 focus:bg-emerald-50 focus:text-emerald-900 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-200"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Classeur Excel (.xls)</span>
            <span className="text-[10px] text-muted-foreground">
              Stylisé avec totaux &amp; couleurs
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          className="cursor-pointer gap-2.5 py-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Fichier CSV (.csv)</span>
            <span className="text-[10px] text-muted-foreground">
              Séparateur « ; » avec UTF-8 BOM
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="cursor-pointer gap-2.5 py-2 focus:bg-rose-50 focus:text-rose-900 dark:focus:bg-rose-950/50 dark:focus:text-rose-200"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 shrink-0">
            <Printer className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">Catalogue PDF (.pdf)</span>
              <span className="rounded bg-rose-100 dark:bg-rose-900/60 px-1 py-0.2 text-[9px] font-bold text-rose-700 dark:text-rose-300">
                Actifs
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              Format A4 illustré avec photos &amp; tarifs
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
