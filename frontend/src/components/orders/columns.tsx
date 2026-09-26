"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderStatusBadge } from "@/components/ui/badge";
import { OrderQuickActions } from "./OrderQuickActions";
import { formatPriceMAD, formatMoroccanPhone } from "@/lib/utils";
import { ArrowUpDown, AlertCircle, PhoneCall, MapPin, Truck, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderTrackingModal } from "./OrderTrackingModal";


interface ColumnOptions {
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onIncrementAttempts?: (orderId: string) => void;
}

export const getOrderColumns = ({
  onStatusChange,
  onIncrementAttempts,
}: ColumnOptions): ColumnDef<Order>[] => [
  {
    id: "select",
    size: 36,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tout sélectionner"
          className="translate-y-[1px]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Sélectionner la commande"
          className="translate-y-[1px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    size: 95,
    header: "ID & Date",
    cell: ({ row }) => {
      const order = row.original;
      const dateFormatted = new Date(order.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span className="font-mono text-xs font-bold text-foreground tracking-tight whitespace-nowrap">
            #{order.id}
          </span>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {dateFormatted}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    size: 190,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold whitespace-nowrap"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client & Tél
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-semibold text-foreground text-xs truncate" title={order.customerName}>
            {order.customerName}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
            {formatMoroccanPhone(order.phone)}
          </span>
          <span
            className="text-[10px] text-muted-foreground truncate"
            title={order.address}
          >
            {order.address}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    size: 95,
    header: "Ville",
    cell: ({ row }) => {
      const city = row.getValue("city") as string;
      return (
        <div className="flex items-center gap-1 text-xs font-medium whitespace-nowrap">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>{city}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "items",
    size: 160,
    header: "Articles",
    cell: ({ row }) => {
      const items = row.original.items;
      if (!items || items.length === 0) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col text-xs min-w-0 pr-2">
          <span className="truncate font-medium" title={items[0].productName}>
            {items[0].quantity}x {items[0].productName}
          </span>
          {items.length > 1 && (
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              +{items.length - 1} autre(s)
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    size: 90,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold whitespace-nowrap"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = row.getValue("totalAmount") as number;
      return (
        <div className="font-bold font-mono text-xs text-foreground whitespace-nowrap">
          {formatPriceMAD(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    size: 120,
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <div className="whitespace-nowrap">
          <OrderStatusBadge status={status} />
        </div>
      );
    },
  },
  {
    accessorKey: "attemptsCount",
    size: 65,
    header: "Appels",
    cell: ({ row }) => {
      const attempts = row.getValue("attemptsCount") as number;
      const isHigh = attempts >= 3;

      return (
        <div className="flex items-center gap-1 text-xs whitespace-nowrap">
          <PhoneCall
            className={`h-3 w-3 shrink-0 ${
              isHigh ? "text-red-500 animate-pulse" : "text-muted-foreground"
            }`}
          />
          <span
            className={`font-semibold ${
              isHigh ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
            }`}
          >
            {attempts}
          </span>
          {isHigh && (
            <span title="Relances multiples !">
              <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "assignments",
    size: 130,
    header: "Livreur & Suivi",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center justify-between gap-1 text-[11px] whitespace-nowrap">
          <div className="flex flex-col gap-0.5 min-w-0">
            {order.courier ? (
              <div className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-medium">
                <Truck className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[90px]">{order.courier.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground italic text-[10px]">Non assigné</span>
            )}
            {order.trackingNumber ? (
              <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[90px]">
                {order.trackingNumber}
              </span>
            ) : order.assignedTo ? (
              <span className="text-muted-foreground truncate max-w-[90px] text-[10px]">
                {order.assignedTo.name.split(" ")[0]}
              </span>
            ) : null}
          </div>

          <OrderTrackingModal
            order={order}
            trigger={
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shrink-0"
                title="Voir Carte GPS & Suivi en Direct"
              >
                <Navigation className="h-3.5 w-3.5" />
              </Button>
            }
          />
        </div>
      );
    },

  },
  {
    id: "actions",
    size: 48,
    header: "",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <OrderQuickActions
          order={order}
          onStatusChange={onStatusChange}
          onIncrementAttempts={onIncrementAttempts}
        />
      );
    },
  },
];
