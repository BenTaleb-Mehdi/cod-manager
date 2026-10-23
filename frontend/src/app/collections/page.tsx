import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/storefront-data";
import { CollectionsView } from "@/components/storefront/collections-view";

export const metadata = {
  title: "Collections & Parures | Maison MÉRAF",
  description:
    "Découvrez l'ensemble de nos bijoux et accessoires façonnés en acier inoxydable 316L. Finition dorée inaltérable, résistante à l'eau. Livraison express 24h à Tanger et partout au Maroc.",
};

export default function CollectionsPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111] pb-24">
      {/* 1. HEADER EDITORIAL (Clean Luxury • High Fashion) */}
      <header className="border-b border-[#EBE8E1] bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14">
          
          {/* Fil d'Ariane Minimaliste */}
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-6">
            <Link href="/" className="hover:text-[#0A261E] transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3 stroke-[1.5]" />
            <span className="text-[#0A261E] font-medium">Collections</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Colonne Gauche : Titre & Descriptif Atelier */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0A261E] font-medium block">
                Catalogue Général • Tanger
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111] font-normal tracking-tight leading-[1.08]">
                Toutes nos Créations.
              </h1>

              <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                Parures, colliers, boucles et bracelets façonnés en acier inoxydable de grade 316L. Conçus pour conserver leur éclat doré d’origine au contact répété de l’eau et des parfums.
              </p>

              {/* Spécifications Minimalistes sous forme de ligne d'atelier */}
              <div className="pt-4 border-t border-[#EBE8E1] flex flex-wrap items-center gap-6 sm:gap-8 text-[11px] text-stone-700 font-sans font-medium tracking-wider uppercase">
                <div>
                  <span className="text-stone-400 block text-[9px]">Matière</span>
                  <span>Acier Inox 316L</span>
                </div>
                <div className="h-7 w-[1px] bg-[#EBE8E1]" />
                <div>
                  <span className="text-stone-400 block text-[9px]">Garantie</span>
                  <span>Anti-Ternissement</span>
                </div>
                <div className="h-7 w-[1px] bg-[#EBE8E1]" />
                <div>
                  <span className="text-stone-400 block text-[9px]">Service</span>
                  <span>Paiement à la Livraison</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Image Visuelle Edge-to-Edge */}
            <div className="lg:col-span-5 w-full">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E8E4DA] bg-stone-100 shadow-sm">
                <Image
                  src="/images/meraf/collections-hero.jpg"
                  alt="MÉRAF Fine Jewelry - Collections"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />

                {/* Étiquette d'archive discrète */}
                <div className="absolute bottom-3 left-3 bg-[#0A261E]/90 backdrop-blur-xs text-[#FAF8F5] px-3 py-1.5 rounded-sm border border-white/10 text-[10px] tracking-widest uppercase">
                  MÉRAF • Pièces Numérotées
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. CATALOGUE & FILTRES */}
      <main className="container mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="h-8 w-8 border-2 border-[#0A261E] border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] text-stone-500 uppercase tracking-widest font-sans font-medium">
                Ouverture du catalogue...
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