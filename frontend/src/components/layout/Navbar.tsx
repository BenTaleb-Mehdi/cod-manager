"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  ShoppingCart,
  PhoneCall,
  Menu,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] gap-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            COD Mode Actif
          </Badge>
          <span className="hidden text-xs text-muted-foreground md:inline">
            Marché Marocain (Dirhams - MAD)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Call Button */}
        <Button asChild size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-semibold">
          <Link href="/orders?status=NO_ANSWER">
            <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
            <span>9 Relances Call Center</span>
          </Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative h-8 w-8 rounded-full">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 border-l pl-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <div className="hidden flex-col text-left sm:flex">
            <span className="text-xs font-semibold leading-none">Admin / Superviseur</span>
            <span className="text-[10px] text-muted-foreground">Call Center & Marges</span>
          </div>
        </div>
      </div>
    </header>
  );
}
