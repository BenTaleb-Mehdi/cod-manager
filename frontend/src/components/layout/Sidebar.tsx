"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  PhoneCall,
  BadgePercent,
  Building2,
  Settings,
  BarChart3,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  statusFilter?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Commandes (COD)",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Analyses (Meta & COD)",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Inventaire & Marges",
    href: "/inventory",
    icon: Boxes,
  },
  {
    name: "Fournisseurs & Achats",
    href: "/suppliers",
    icon: Building2,
  },
  {
    name: "Transporteurs",
    href: "/orders?status=SHIPPED",
    icon: Truck,
    statusFilter: "SHIPPED",
  },
  {
    name: "Call Center",
    href: "/orders?status=NO_ANSWER",
    icon: PhoneCall,
    statusFilter: "NO_ANSWER",
  },
  {
    name: "Paramètres Système",
    href: "/settings",
    icon: Settings,
  },
];


function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get("status") || null;

  return (
    <div className="space-y-1">
      <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Menu Principal
      </span>
      {navigationItems.map((item) => {
        let isActive = false;

        if (item.href === "/") {
          isActive = pathname === "/";
        } else if (item.href === "/analytics") {
          isActive = pathname.startsWith("/analytics");
        } else if (item.href === "/inventory") {
          isActive = pathname.startsWith("/inventory");
        } else if (item.href === "/suppliers") {
          isActive = pathname.startsWith("/suppliers");
        } else if (item.href === "/settings") {
          isActive = pathname.startsWith("/settings");
        } else if (item.statusFilter) {
          // Actif uniquement si on est sur /orders ET que le statut correspond exactement
          isActive = pathname === "/orders" && currentStatus === item.statusFilter;
        } else if (item.href === "/orders") {
          // "Commandes (COD)" est actif seulement si on est sur /orders SANS filtre de sous-menu spécial
          isActive =
            pathname === "/orders" &&
            currentStatus !== "SHIPPED" &&
            currentStatus !== "NO_ANSWER";
        }


        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function SidebarNavFallback() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Menu Principal
      </span>
      {navigationItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/orders"
            ? pathname === "/orders"
            : item.href === "/inventory"
            ? pathname.startsWith("/inventory")
            : false;

        const Icon = item.icon;

        return (
          <div
            key={item.name}
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground">
                {item.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card/60 backdrop-blur-sm lg:flex sticky top-0 print:hidden">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
          <BadgePercent className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-foreground">
            COD Manager Maroc
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            E-commerce Local
          </span>
        </div>
      </div>

      {/* Navigation Links avec Suspense */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <Suspense fallback={<SidebarNavFallback />}>
          <SidebarNav />
        </Suspense>
      </div>

      {/* Bottom Profile / Quick Status */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 font-bold text-xs">
            YM
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-semibold text-foreground">
              Yassine (Call Center)
            </span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              En ligne (Prêt pour appels)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
