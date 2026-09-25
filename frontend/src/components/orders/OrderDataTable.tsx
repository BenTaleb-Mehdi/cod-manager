"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table";
import { Order, OrderStatus } from "@/types";
import { getOrderColumns } from "./columns";
import { OrderBulkActionsBar } from "./OrderBulkActionsBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOROCCAN_CITIES } from "@/lib/moroccan-data";
import {
  Search,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  FilterX,
  SlidersHorizontal,
} from "lucide-react";

interface OrderDataTableProps {
  initialOrders: Order[];
}

export function OrderDataTable({ initialOrders }: OrderDataTableProps) {
  const searchParams = useSearchParams();
  const urlStatus = searchParams?.get("status");

  const [data, setData] = useState<Order[]>(initialOrders);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "customerName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Filtres spécifiques COD synchronisés avec l'URL
  const [selectedStatus, setSelectedStatus] = useState<string>(urlStatus || "ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");

  useEffect(() => {
    if (urlStatus) {
      setSelectedStatus(urlStatus);
    }
  }, [urlStatus]);

  // Mutation d'état d'une commande
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setData((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  // Incrémenter les tentatives d'appel ("Pas de réponse")
  const handleIncrementAttempts = (orderId: string) => {
    setData((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              attemptsCount: order.attemptsCount + 1,
              status: "NO_ANSWER",
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  // Actions groupées (Bulk)
  const handleBulkAssignCourier = (orderIds: string[], courierId: string) => {
    setData((prev) =>
      prev.map((order) =>
        orderIds.includes(order.id)
          ? {
              ...order,
              courierId,
              status: order.status === "NEW" ? "CONFIRMED" : order.status,
            }
          : order
      )
    );
  };

  const handleBulkAssignAgent = (orderIds: string[], agentId: string) => {
    setData((prev) =>
      prev.map((order) =>
        orderIds.includes(order.id)
          ? {
              ...order,
              assignedToId: agentId,
            }
          : order
      )
    );
  };

  const handleBulkStatusChange = (orderIds: string[], newStatus: OrderStatus) => {
    setData((prev) =>
      prev.map((order) =>
        orderIds.includes(order.id)
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  // Colonnes mémorisées
  const columns = useMemo(
    () =>
      getOrderColumns({
        onStatusChange: handleStatusChange,
        onIncrementAttempts: handleIncrementAttempts,
      }),
    []
  );

  // Filtrage combiné (Recherche globale + Status + City)
  const filteredData = useMemo(() => {
    return data.filter((order) => {
      // Filtre statut
      if (selectedStatus !== "ALL" && order.status !== selectedStatus) {
        return false;
      }
      // Filtre ville
      if (selectedCity !== "ALL" && order.city !== selectedCity) {
        return false;
      }
      // Filtre global (Nom, Téléphone, Tracking, ID, Adresse)
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase();
        const matchesName = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.phone.includes(query);
        const matchesTracking = order.trackingNumber?.toLowerCase().includes(query) ?? false;
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesAddress = order.address.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesTracking && !matchesId && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }, [data, selectedStatus, selectedCity, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => table.getRowModel().rows[parseInt(index)]?.original?.id)
      .filter(Boolean);
  }, [rowSelection, table]);

  const resetFilters = () => {
    setGlobalFilter("");
    setSelectedStatus("ALL");
    setSelectedCity("ALL");
  };

  return (
    <div className="space-y-4">
      {/* Barre de filtres COD haute performance */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Recherche Texte */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher nom, tél 06..., tracking..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Filtre par Statut */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[170px] h-9">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="NEW">🔵 Nouvelle</SelectItem>
              <SelectItem value="CONFIRMED">🟢 Confirmée</SelectItem>
              <SelectItem value="NO_ANSWER">🟠 Pas de réponse</SelectItem>
              <SelectItem value="SHIPPED">🚙 Expédiée</SelectItem>
              <SelectItem value="DELIVERED">✨ Livrée</SelectItem>
              <SelectItem value="RETURNED">🔴 Retournée</SelectItem>
              <SelectItem value="CANCELLED">❌ Annulée</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtre par Ville Marocaine */}
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les villes</SelectItem>
              {MOROCCAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(globalFilter || selectedStatus !== "ALL" || selectedCity !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
            >
              <FilterX className="mr-1 h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Compteur et rafraîchissement */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            <strong>{filteredData.length}</strong> commande(s) affichée(s)
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setData(initialOrders)}
            title="Rafraîchir"
            className="h-8 w-8"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Table TanStack */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize() ? `${header.getSize()}px` : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize() ? `${cell.column.getSize()}px` : undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Aucune commande ne correspond aux filtres actuels.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <div>
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount() || 1} ({filteredData.length} résultats)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8"
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Barre d'action flottante pour sélection multiple */}
      <OrderBulkActionsBar
        selectedOrderIds={selectedIds}
        onClearSelection={() => setRowSelection({})}
        onAssignToCourier={handleBulkAssignCourier}
        onAssignToAgent={handleBulkAssignAgent}
        onBulkStatusChange={handleBulkStatusChange}
      />
    </div>
  );
}
