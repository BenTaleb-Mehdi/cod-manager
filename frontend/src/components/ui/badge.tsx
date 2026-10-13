import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        // COD Moroccan order status variants
        NEW: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 font-medium",
        CONFIRMED:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium",
        NO_ANSWER:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300 font-medium",
        SHIPPED:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/60 dark:text-sky-300 font-medium",
        DELIVERED:
          "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/60 dark:text-teal-300 font-medium",
        RETURNED:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-300 font-medium",
        CANCELLED:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300 font-medium",
        lowStock:
          "border-red-300 bg-red-100 text-red-800 font-bold animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusLabels: Record<OrderStatus, string> = {
    NEW: "Nouvelle",
    CONFIRMED: "Confirmée",
    NO_ANSWER: "Pas de réponse",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    RETURNED: "Retournée",
    CANCELLED: "Annulée",
  };

  return (
    <Badge variant={status} className="gap-1.5 whitespace-nowrap shadow-none">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "NEW" && "bg-blue-600",
          status === "CONFIRMED" && "bg-emerald-600",
          status === "NO_ANSWER" && "bg-amber-600",
          status === "SHIPPED" && "bg-sky-600",
          status === "DELIVERED" && "bg-teal-600",
          status === "RETURNED" && "bg-red-600",
          status === "CANCELLED" && "bg-rose-600"
        )}
      />
      {statusLabels[status] || status}
    </Badge>
  );
}

export { Badge, badgeVariants };
