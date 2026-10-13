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
      {/* 1. HERO HEADER WITH PERSONALIZED MÉRAF IMAGE */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-8 sm:py-12 relative overflow-hidden">
        {/* Subtle decorative curves */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M-100 150 C 300 50, 700 250, 1300 100" stroke="#C5A880" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Editorial Presentation */}
            <div className="lg:col-span-6 space-y-4 max-w-xl text-center lg:text-left">
              {/* Breadcrumbs */}
              <nav className="flex items-center justify-center lg:justify-start gap-2 text-[11px] font-medium tracking-wider text-[#18221D]/60 uppercase">
                <Link href="/" className="hover:text-[#0B2D23] transition-colors">
                  Accueil
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#0B2D23] font-semibold">Collections</span>
              </nav>

              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                MAISON MÉRAF • HAUTE JOAILLERIE
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B2D23] tracking-tight leading-tight">
                Toutes Nos Collections
              </h1>

              <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans">
                Découvrez nos créations iconiques façonnées en <strong>acier chirurgical 316L certifié</strong> et parées d&apos;<strong>or 18 carats inaltérable</strong>. Commandez en toute sérénité avec le <strong>Paiement à la Livraison</strong> après inspection du colis.
              </p>

              {/* 3 Value badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] text-[#0B2D23] font-medium">
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Or 18K Inaltérable
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Livraison Gratuite 24/48h
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Inspection avant paiement
                </span>
              </div>
            </div>

            {/* Right Column: Personalized MÉRAF Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-[#E8E2D8] shadow-2xl bg-[#FAF7F2] group">
                <img
                  src="/images/meraf/collections-hero.jpg"
                  alt="MÉRAF Fine Jewelry - Collections Émeraude et Or 18K"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Overlapping Gold Medallion */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#C5A880] rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#A8875A]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0B2D23]">
                    MÉRAF ÉDITION LIMITÉE
                  </span>
                </div>
              </div>
            </div>
          </div>
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
