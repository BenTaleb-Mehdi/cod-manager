"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { NavigationProgressBar } from "@/components/layout/NavigationProgressBar";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { FloatingWhatsApp } from "@/components/storefront/floating-whatsapp";

interface StorefrontOrAdminShellProps {
  children: React.ReactNode;
}

export function StorefrontOrAdminShell({ children }: StorefrontOrAdminShellProps) {
  const pathname = usePathname();

  // Détecter si l'URL courante appartient au tableau de bord d'administration COD
  const isAdminRoute =
    pathname.startsWith("/orders") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/suppliers") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="flex min-h-screen print:block print:min-h-0 bg-muted/20 text-foreground">
        <NavigationProgressBar />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden print:block print:overflow-visible">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Vitrine E-commerce Storefront "LUMIÈRE Fine Jewelry" (Luxury Theme, COD Maroc)
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-foreground selection:bg-[#0B2D23]/15 selection:text-[#0B2D23]">
      <NavigationProgressBar />
      {/* En-tête avec annonce sticky, logo Morly & catégories */}
      <StorefrontHeader />

      {/* Contenu principal de la page storefront */}
      <main className="flex-1">{children}</main>

      {/* Pied de page Morly avec réassurance COD Maroc */}
      <StorefrontFooter />

      {/* Bouton d'action flottant WhatsApp avec badge conseiller en direct */}
      <FloatingWhatsApp />
    </div>
  );
}
