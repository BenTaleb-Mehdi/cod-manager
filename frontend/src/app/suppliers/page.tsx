import React from "react";
import { getSuppliersAction } from "@/actions/suppliers";
import { getInventoryAction } from "@/actions/inventory";
import { SuppliersHub } from "@/components/suppliers/SuppliersHub";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const [suppliersRes, inventoryRes] = await Promise.all([
    getSuppliersAction(),
    getInventoryAction(),
  ]);

  const suppliers = suppliersRes.success && suppliersRes.data ? suppliersRes.data : [];
  const products = inventoryRes.success && inventoryRes.data ? inventoryRes.data.products : [];

  return <SuppliersHub initialSuppliers={suppliers} products={products} />;
}
