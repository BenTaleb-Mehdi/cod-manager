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
  Navigation,
  FileText,
  Clock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/moroccan-data";
import { formatMoroccanPhone } from "@/lib/utils";
import { OrderTrackingModal } from "./OrderTrackingModal";

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
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const productSummary =
    order.items.length > 0
      ? `${order.items[0].productName}${order.items.length > 1 ? ` (+${order.items.length - 1} autre)` : ""}`
      : "Articles commandés";

  const waLink = generateWhatsAppLink(
    order.phone,
    order.customerName,
    order.city,
    order.totalAmount,
    productSummary,
    order.address,
    order.id,
    order.shippingNote || undefined
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

        <DropdownMenuContent
          align="end"
          className="w-72 p-2 shadow-xl border bg-popover rounded-xl"
        >
          {/* Section 1 : Contact Client */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <UserCheck className="h-3 w-3 text-primary" />
            <span>Contact Client</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-1">
            {/* WhatsApp Direct */}
            <DropdownMenuItem
              asChild
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40 bg-muted/30 hover:bg-emerald-50/70"
            >
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            </DropdownMenuItem>

            {/* Appel Téléphonique */}
            <DropdownMenuItem
              asChild
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-950/40 bg-muted/30 hover:bg-blue-50/70"
            >
              <a
                href={`tel:${order.phone.replace(/\s+/g, "")}`}
                className="flex items-center"
                title={`Appeler ${formatMoroccanPhone(order.phone)}`}
              >
                <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Appeler</span>
              </a>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="my-1" />

          {/* Section 2 : Suivi & Expédition */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Truck className="h-3 w-3 text-primary" />
            <span>Suivi & Expédition</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-1">
            {/* Voir Suivi & Carte GPS */}
            <DropdownMenuItem
              onClick={() => setTrackingModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40 bg-muted/30 hover:bg-emerald-50/70"
            >
              <Navigation className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Carte GPS</span>
            </DropdownMenuItem>

            {/* Facture A4 & Ticket */}
            <DropdownMenuItem
              asChild
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-muted bg-muted/30 hover:bg-muted/70"
            >
              <Link href={`/orders/${order.id}/invoice`} className="flex items-center">
                <FileText className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <span className="truncate">Facture A4</span>
              </Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="my-1" />

          {/* Section 3 : Changer le Statut */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3 w-3 text-primary" />
            <span>Changer le Statut</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Pas de réponse */}
            <DropdownMenuItem
              onClick={handleNoAnswer}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-amber-600 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/40 bg-muted/30 hover:bg-amber-50/70"
            >
              <PhoneMissed className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Non Répondu</span>
            </DropdownMenuItem>

            {/* Confirmer */}
            {order.status !== "CONFIRMED" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(order.id, "CONFIRMED")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40 bg-muted/30 hover:bg-emerald-50/70"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Confirmer</span>
              </DropdownMenuItem>
            )}

            {/* Expédier */}
            {order.status !== "SHIPPED" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(order.id, "SHIPPED")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-sky-600 focus:text-sky-700 focus:bg-sky-50 dark:focus:bg-sky-950/40 bg-muted/30 hover:bg-sky-50/70"
              >
                <Truck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Expédier</span>
              </DropdownMenuItem>
            )}

            {/* Livrer */}
            {order.status !== "DELIVERED" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(order.id, "DELIVERED")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-teal-600 focus:text-teal-700 focus:bg-teal-50 dark:focus:bg-teal-950/40 bg-muted/30 hover:bg-teal-50/70"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span className="truncate">Livrée</span>
              </DropdownMenuItem>
            )}

            {/* Retour */}
            {order.status !== "RETURNED" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(order.id, "RETURNED")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/40 bg-muted/30 hover:bg-red-50/70"
              >
                <RotateCcw className="h-3.5 w-3.5 text-red-600 shrink-0" />
                <span className="truncate">Retournée</span>
              </DropdownMenuItem>
            )}

            {/* Annuler */}
            {order.status !== "CANCELLED" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(order.id, "CANCELLED")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40 bg-muted/30 hover:bg-rose-50/70"
              >
                <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span className="truncate">Annuler</span>
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Suivi & Carte GPS */}
      <OrderTrackingModal
        order={order}
        open={trackingModalOpen}
        onOpenChange={setTrackingModalOpen}
      />
    </div>
  );
}
