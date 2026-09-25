"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_COURIERS, MOCK_AGENTS } from "@/lib/moroccan-data";
import { UserCheck, Truck, X, CheckCheck, Loader2 } from "lucide-react";
import { OrderStatus } from "@/types";

interface OrderBulkActionsBarProps {
  selectedOrderIds: string[];
  onClearSelection: () => void;
  onAssignToCourier: (orderIds: string[], courierId: string) => Promise<void> | void;
  onAssignToAgent: (orderIds: string[], agentId: string) => Promise<void> | void;
  onBulkStatusChange?: (orderIds: string[], status: OrderStatus) => Promise<void> | void;
}

export function OrderBulkActionsBar({
  selectedOrderIds,
  onClearSelection,
  onAssignToCourier,
  onAssignToAgent,
  onBulkStatusChange,
}: OrderBulkActionsBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const count = selectedOrderIds.length;

  if (count === 0) return null;

  const handleCourierSelect = async (courierId: string) => {
    setIsProcessing(true);
    try {
      await onAssignToCourier(selectedOrderIds, courierId);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAgentSelect = async (agentId: string) => {
    setIsProcessing(true);
    try {
      await onAssignToAgent(selectedOrderIds, agentId);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusSelect = async (status: OrderStatus) => {
    if (!onBulkStatusChange) return;
    setIsProcessing(true);
    try {
      await onBulkStatusChange(selectedOrderIds, status);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <aside
      aria-label="Actions groupées sur les commandes sélectionnées"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl border border-border/80 bg-background/95 px-5 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up"
    >
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {count}
        </span>
        <span className="text-sm font-medium">
          {count > 1 ? "commandes sélectionnées" : "commande sélectionnée"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Assignation Transporteur */}
        <Select onValueChange={handleCourierSelect} disabled={isProcessing}>
          <SelectTrigger className="h-9 w-44 bg-background">
            <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Assigner Livreur" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_COURIERS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignation Agent Call Center */}
        <Select onValueChange={handleAgentSelect} disabled={isProcessing}>
          <SelectTrigger className="h-9 w-44 bg-background">
            <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Assigner Agent" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_AGENTS.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name} ({a.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Changement de statut groupé */}
        <Select onValueChange={(val) => handleStatusSelect(val as OrderStatus)} disabled={isProcessing}>
          <SelectTrigger className="h-9 w-44 bg-background">
            <CheckCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Changer Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONFIRMED">Marquer Confirmées</SelectItem>
            <SelectItem value="SHIPPED">Marquer Expédiées</SelectItem>
            <SelectItem value="NO_ANSWER">Marquer Pas de Réponse</SelectItem>
            <SelectItem value="CANCELLED">Marquer Annulées</SelectItem>
          </SelectContent>
        </Select>

        {isProcessing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClearSelection}
        disabled={isProcessing}
        className="ml-2 h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Annuler la sélection</span>
      </Button>
    </aside>
  );
}
