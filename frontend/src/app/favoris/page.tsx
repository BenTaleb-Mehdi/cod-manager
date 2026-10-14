"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Sparkles, ChevronRight, ArrowRight, Trash2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { getProducts, getCategories } from "@/lib/storefront-data";
import { ProductCard } from "@/components/storefront/product-card";
import { Product } from "@/types/storefront";

export default function FavoritesPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const allProducts = getProducts();
  const categories = getCategories();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoritedProducts: Product[] = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-7xl">
      {/* 1. Breadcrumbs */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-2 text-xs text-[#18221D]/60 mb-6 flex-wrap"
      >
        <Link href="/" className="hover:text-[#0B2D23] transition-colors">
          Accueil
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-[#C5A880]" />
        <Link href="/collections" className="hover:text-[#0B2D23] transition-colors">
          Collections
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-[#C5A880]" />
        <span className="text-[#0B2D23] font-semibold">
          Mes Favoris <span className="text-[#9F8259] font-sans">| المفضلة</span>
        </span>
      </nav>

      {/* 2. Hero Header */}
      <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0B2D23]/10 text-[#0B2D23] px-3 py-1 text-xs font-semibold tracking-wider uppercase">
            <Heart className="h-3.5 w-3.5 fill-[#0B2D23]" />
            <span>MÉRAF Fine Jewelry • Wishlist</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl text-[#0B2D23] font-normal leading-tight">
            Mes Créations Favorites
            <span className="block text-lg sm:text-2xl text-[#9F8259] font-sans font-medium mt-1">
              قائمتي المفضلة من المجوهرات
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed">
            Retrouvez ici tous les bijoux que vous avez aimés. Commandez directement en 1-clic avec paiement à la livraison (COD) après inspection du colis avec le livreur.
          </p>
        </div>

        {/* Action Right: Clear button or count */}
        {mounted && favoritedProducts.length > 0 && (
          <div className="mt-6 sm:mt-0 sm:absolute sm:top-10 sm:right-10 flex flex-col sm:items-end gap-2 z-10">
            <span className="inline-block bg-[#0B2D23] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs">
              {favoritedProducts.length} {favoritedProducts.length > 1 ? "Bijoux sauvegardés" : "Bijou sauvegardé"}
            </span>

            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir vider tous vos favoris ?")) {
                  clearWishlist();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-700/80 hover:text-red-700 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Vider la liste | مسح المفضلة</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Product Grid or Empty State */}
      {!mounted ? (
        <div className="py-20 text-center text-sm text-[#18221D]/50">
          Chargement de vos favoris...
        </div>
      ) : favoritedProducts.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {favoritedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Reassurance Banner */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B2D23]/10 text-[#0B2D23] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#0B2D23]">
                  Paiement sécurisé à la livraison partout au Maroc
                </p>
                <p className="text-[#18221D]/65">
                  الدفع بعد معاينة وفتح الطرد أمام الموزع • توصيل سريع 24/48h
                </p>
              </div>
            </div>

            <Link
              href="/collections"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B2D23] hover:text-[#9F8259] transition-colors"
            >
              <span>Continuer mes achats | المزيد</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 sm:py-20 text-center max-w-lg mx-auto space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-[#E8E2D8]/50 flex items-center justify-center text-[#9F8259]">
            <Heart className="h-10 w-10 text-[#9F8259]/60" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-xl sm:text-2xl text-[#0B2D23]">
              Votre liste de favoris est actuellement vide
            </h2>
            <p className="font-sans text-sm text-[#0B2D23]/70 font-medium">
              قائمة المفضلة فارغة حالياً
            </p>
            <p className="text-xs sm:text-sm text-[#18221D]/60 leading-relaxed max-w-md mx-auto">
              Cliquez sur le petit cœur présent sur les bijoux qui vous plaisent pour les enregistrer et les commander à tout moment.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase px-6 py-3.5 shadow-md active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-[#C5A880]" />
              <span>Découvrir nos créations joaillières | تصفح</span>
            </Link>
          </div>

          {/* Quick Categories Navigation */}
          <div className="pt-8 border-t border-[#E8E2D8]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9F8259] mb-4">
              Explorer par catégorie :
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections?category=${c.slug}`}
                  className="text-xs py-1.5 px-3.5 rounded-full bg-white hover:bg-[#0B2D23] hover:text-white border border-[#E8E2D8] text-[#18221D]/80 transition-all shadow-2xs"
                >
                  {c.moroccanLabel}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
