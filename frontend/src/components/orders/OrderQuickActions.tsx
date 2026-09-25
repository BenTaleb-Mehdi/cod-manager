"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  PhoneMissed,
  MessageSquare,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { generateWhatsAppLink } from "@/lib/moroccan-data";
import { formatMoroccanPhone } from "@/lib/utils";

interface OrderQuickActionsProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onIncrementAttempts?: (orderId: string) => void;
}

export function OrderQuickActions({
  order,
  onStatusChange,
  onIncrementAttempts,
}: OrderQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const productSummary =
    order.items.length > 0
      ? `${order.items[0].productName}${order.items.length > 1 ? ` (+${order.items.length - 1} autre)` : ""}`
      : "Articles commandés";

  const waLink = generateWhatsAppLink(
    order.phone,
    order.customerName,
    order.city,
    order.totalAmount,
    productSummary
  );

  const handleNoAnswer = () => {
    if (onIncrementAttempts) {
      onIncrementAttempts(order.id);
    }
    if (onStatusChange && order.status !== "NO_ANSWER") {
      onStatusChange(order.id, "NO_ANSWER");
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Actions sur la commande"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
            Contact Client
          </DropdownMenuLabel>

          {/* 1. WhatsApp direct avec modèle 212 */}
          <DropdownMenuItem asChild className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" />
              <div className="flex flex-col">
                <span className="font-medium text-xs">WhatsApp Rapide</span>
                <span className="text-[10px] text-muted-foreground">Modèle de confirmation</span>
              </div>
            </a>
          </DropdownMenuItem>

          {/* 2. Appel Téléphonique */}
          <DropdownMenuItem asChild className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-950/40">
            <a
              href={`tel:${order.phone.replace(/\s+/g, "")}`}
              className="flex items-center w-full"
            >
              <Phone className="mr-2 h-4 w-4 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-medium text-xs">Appeler {formatMoroccanPhone(order.phone)}</span>
                <span className="text-[10px] text-muted-foreground">Softphone / Ligne directe</span>
              </div>
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
            Changer le Statut
          </DropdownMenuLabel>

          {/* Pas de réponse */}
          <DropdownMenuItem
            onClick={handleNoAnswer}
            className="cursor-pointer text-amber-600 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/40"
          >
            <PhoneMissed className="mr-2 h-4 w-4 text-amber-600" />
            <span>Pas de réponse (+1 relance)</span>
          </DropdownMenuItem>

          {/* Confirmer */}
          {order.status !== "CONFIRMED" && (
            <DropdownMenuItem
              onClick={() => onStatusChange?.(order.id, "CONFIRMED")}
              className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
              <span>Confirmer la commande</span>
            </DropdownMenuItem>
          )}

          {/* Expédier */}
          {order.status !== "SHIPPED" && (
            <DropdownMenuItem
              onClick={() => onStatusChange?.(order.id, "SHIPPED")}
              className="cursor-pointer text-sky-600 focus:text-sky-700 focus:bg-sky-50 dark:focus:bg-sky-950/40"
            >
              <Truck className="mr-2 h-4 w-4 text-sky-600" />
              <span>Marquer Expédiée</span>
            </DropdownMenuItem>
          )}

          {/* Livrer */}
          {order.status !== "DELIVERED" && (
            <DropdownMenuItem
              onClick={() => onStatusChange?.(order.id, "DELIVERED")}
              className="cursor-pointer text-teal-600 focus:text-teal-700 focus:bg-teal-50 dark:focus:bg-teal-950/40"
            >
              <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
              <span>Marquer Livrée & Encaissée</span>
            </DropdownMenuItem>
          )}

          {/* Retour */}
          {order.status !== "RETURNED" && (
            <DropdownMenuItem
              onClick={() => onStatusChange?.(order.id, "RETURNED")}
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/40"
            >
              <RotateCcw className="mr-2 h-4 w-4 text-red-600" />
              <span>Marquer Retournée</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Annuler */}
          {order.status !== "CANCELLED" && (
            <DropdownMenuItem
              onClick={() => onStatusChange?.(order.id, "CANCELLED")}
              className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40"
            >
              <XCircle className="mr-2 h-4 w-4 text-rose-600" />
              <span>Annuler la commande</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
