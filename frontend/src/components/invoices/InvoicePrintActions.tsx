"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";

export function InvoicePrintActions() {
  const handlePrintA4 = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrintA4}
        className="gap-1.5 h-9"
      >
        <FileText className="h-4 w-4" />
        <span>Ticket Thermique (80mm)</span>
      </Button>

      <Button
        size="sm"
        onClick={handlePrintA4}
        className="gap-1.5 h-9 bg-primary"
      >
        <Printer className="h-4 w-4" />
        <span>Imprimer Facture A4</span>
      </Button>
    </div>
  );
}
