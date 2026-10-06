import React, { Suspense } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Gem } from "lucide-react";
import { getProducts, getCategories } from "@/lib/storefront-data";
import { CollectionsView } from "@/components/storefront/collections-view";

export const metadata = {
  title: "Collections & Bijoux | Maison MÉRAF",
  description:
    "Explorez toutes nos collections joaillières en or 18k et acier chirurgical 316L inaltérable. Colliers, bagues, bracelets et boucles d'oreilles avec livraison gratuite et paiement à la livraison au Maroc.",
};

export default function CollectionsPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* 1. HERO HEADER */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-10 sm:py-14 relative overflow-hidden">
        {/* Subtle decorative curves */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M-100 150 C 300 50, 700 250, 1300 100" stroke="#C5A880" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-3 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-wider text-[#18221D]/60 uppercase mb-2">
            <Link href="/" className="hover:text-[#0B2D23] transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0B2D23] font-semibold">Collections</span>
          </nav>

          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            MAISON MÉRAF • SÉLECTION EXCLUSIVE
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B2D23] tracking-tight">
            Toutes Nos Collections
          </h1>

          <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans max-w-xl mx-auto">
            Chaque pièce est façonnée avec passion en acier chirurgical 316L et parée d&apos;or 18 carats inaltérable. Profitez du confort du <strong>Paiement à la Livraison</strong> partout au Maroc.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH SUSPENSE */}
      <main className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-10 w-10 border-2 border-[#C5A880] border-t-[#0B2D23] rounded-full animate-spin" />
              <p className="text-xs text-[#0B2D23] uppercase tracking-widest font-semibold">
                Chargement des créations...
              </p>
            </div>
          }
        >
          <CollectionsView initialProducts={products} categories={categories} />
        </Suspense>
      </main>
    </div>
  );
}
