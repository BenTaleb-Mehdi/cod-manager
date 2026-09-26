import React, { Suspense } from "react";
import { OrderDataTable } from "@/components/orders/OrderDataTable";
import { getOrdersAction } from "@/actions/orders";
import { CreateOrderDialog } from "@/components/orders/CreateOrderDialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export default async function OrdersPage() {
  const result = await getOrdersAction();
  const orders = result.success && result.data ? result.data.orders : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestion des Commandes COD
          </h1>
          <p className="text-sm text-muted-foreground">
            Vue optimisée Call Center : confirmation rapide, boutons d'appel direct et synchronisation livreur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreateOrderDialog />
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Download className="h-4 w-4" />
            <span>Exporter CSV</span>
          </Button>
        </div>
      </div>

      {/* TanStack Data Table des Commandes avec Suspense */}
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <OrderDataTable initialOrders={orders} />
      </Suspense>
    </div>
  );
}

