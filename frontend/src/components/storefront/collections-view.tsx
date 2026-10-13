"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { Product } from "@/types/storefront";
import { ProductCard } from "@/components/storefront/product-card";

interface CollectionsViewProps {
  initialProducts: Product[];
  categories: {
    id: string;
    name: string;
    moroccanLabel: string;
    subtitle: string;
    slug: string;
    count: number;
  }[];
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";
type PriceFilterOption = "all" | "under-200" | "200-250" | "above-250";

export function CollectionsView({ initialProducts, categories }: CollectionsViewProps) {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategoryParam || "all"
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync with searchParams if url changes (e.g. from header dropdown links)
  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all") {
          const matchCat =
            product.category.toLowerCase() === selectedCategory.toLowerCase() ||
            categories.find(
              (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase() && c.id === product.category
            );
          if (!matchCat) return false;
        }

        // Search filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchDesc = product.shortDescription.toLowerCase().includes(q);
          const matchCat = (product.categoryLabel || product.category).toLowerCase().includes(q);
          const matchHighlights = product.highlights.some((h) => h.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchHighlights) return false;
        }

        // Price range filter
        if (selectedPriceRange === "under-200" && product.priceMAD >= 200) return false;
        if (
          selectedPriceRange === "200-250" &&
          (product.priceMAD < 200 || product.priceMAD > 250)
        )
          return false;
        if (selectedPriceRange === "above-250" && product.priceMAD < 250) return false;

        // In-stock only
        if (inStockOnly && product.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceMAD - b.priceMAD;
        if (sortBy === "price-desc") return b.priceMAD - a.priceMAD;
        if (sortBy === "rating") return b.rating - a.rating;
        // Default "featured": reviews count + rating
        return b.reviewsCount * b.rating - a.reviewsCount * a.rating;
      });
  }, [
    initialProducts,
    categories,
    selectedCategory,
    searchQuery,
    selectedPriceRange,
    inStockOnly,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPriceRange !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP CONTROLS BAR: Search & Summary */}
      <div className="bg-[#F4EFEA] border border-[#E8E2D8] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B2D23]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un bijou (ex: émeraude, bague solitaire, jonc, or 18k)..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs sm:text-sm text-[#0B2D23] placeholder:text-[#18221D]/45 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#18221D]/40 hover:text-[#0B2D23] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Right Action: Mobile Filter Toggle + Desktop Sort Selector */}
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-2 rounded-full border border-[#0B2D23]/20 bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-[#0B2D23] active:scale-95 transition-all"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-[#0B2D23] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#18221D]/60 hidden sm:inline">
                Trier par :
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#0B2D23] text-xs font-semibold py-2.5 pl-4 pr-9 focus:outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="featured">✨ Les plus populaires</option>
                  <option value="price-asc">Prix : Croissant</option>
                  <option value="price-desc">Prix : Décroissant</option>
                  <option value="rating">★ Meilleures notes</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0B2D23]/50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills (Horizontal scrollable) */}
        <div className="mt-4 pt-4 border-t border-[#E8E2D8]/70 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#0B2D23] text-[#FAF7F2] shadow-sm"
                : "bg-[#FAF7F2] text-[#0B2D23] border border-[#E8E2D8] hover:border-[#C5A880]"
            }`}
          >
            Tous les bijoux ({initialProducts.length})
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.slug.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#0B2D23] text-[#FAF7F2] shadow-sm"
                    : "bg-[#FAF7F2] text-[#0B2D23] border border-[#E8E2D8] hover:border-[#C5A880]"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECONDARY FILTER ROW & ACTIVE BADGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        {/* Results Count & Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#0B2D23]">
            {filteredProducts.length}{" "}
            {filteredProducts.length > 1 ? "créations joaillières" : "création trouvée"}
          </span>

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D8] px-3 py-1 text-[11px] font-medium text-[#0B2D23]">
              Catégorie: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedPriceRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D8] px-3 py-1 text-[11px] font-medium text-[#0B2D23]">
              Prix:{" "}
              {selectedPriceRange === "under-200"
                ? "< 200 DH"
                : selectedPriceRange === "200-250"
                ? "200 - 250 DH"
                : "> 250 DH"}
              <button
                onClick={() => setSelectedPriceRange("all")}
                className="hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D8] px-3 py-1 text-[11px] font-medium text-[#0B2D23]">
              En stock
              <button onClick={() => setInStockOnly(false)} className="hover:text-red-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D8] px-3 py-1 text-[11px] font-medium text-[#0B2D23]">
              « {searchQuery} »
              <button onClick={() => setSearchQuery("")} className="hover:text-red-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-[11px] text-[#A8875A] hover:text-[#0B2D23] font-semibold underline underline-offset-2 ml-1"
            >
              Effacer tout
            </button>
          )}
        </div>

        {/* Quick Price Filters (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#0B2D23]">
          <span className="text-[11px] text-[#18221D]/60 mr-1">Budget :</span>
          {(
            [
              { id: "all", label: "Tous" },
              { id: "under-200", label: "< 200 DH" },
              { id: "200-250", label: "200-250 DH" },
              { id: "above-250", label: "250+ DH" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPriceRange(item.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                selectedPriceRange === item.id
                  ? "bg-[#C5A880] text-[#0B2D23] font-bold"
                  : "bg-[#F4EFEA] text-[#18221D]/75 hover:bg-[#E8E2D8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Modal for Filters */}
      {mobileFiltersOpen && (
        <div className="lg:hidden rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] p-5 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <h4 className="font-serif text-base font-semibold text-[#0B2D23]">
              Filtrer les Bijoux
            </h4>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 text-[#18221D]/60 hover:text-[#0B2D23]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Budget filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0B2D23] uppercase tracking-wider block">
              Budget (MAD)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "Tous les prix" },
                { id: "under-200", label: "Moins de 200 DH" },
                { id: "200-250", label: "200 DH à 250 DH" },
                { id: "above-250", label: "250 DH et plus" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPriceRange(item.id as PriceFilterOption)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    selectedPriceRange === item.id
                      ? "bg-[#0B2D23] text-[#FAF7F2] border-[#0B2D23]"
                      : "bg-[#F4EFEA] text-[#18221D] border-[#E8E2D8]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* In stock toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-[#0B2D23]"
              />
              <span className="text-xs font-medium text-[#0B2D23]">
                Uniquement les articles en stock (Expédition 24h)
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-[#E8E2D8] flex gap-2">
            <button
              onClick={resetAllFilters}
              className="flex-1 rounded-xl border border-[#0B2D23]/30 py-2.5 text-xs font-semibold text-[#0B2D23]"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 rounded-xl bg-[#0B2D23] py-2.5 text-xs font-semibold text-[#FAF7F2]"
            >
              Voir les résultats ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* 3. PRODUCT GRID OR EMPTY STATE */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-[#E8E2D8] bg-[#FDFCF9] space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#C5A880]">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D23]">
            Aucun bijou ne correspond à votre recherche
          </h3>
          <p className="text-xs text-[#18221D]/70 leading-relaxed">
            Essayez de modifier vos filtres ou de taper un autre mot-clé pour explorer nos colliers, bagues, bracelets et boucles d&apos;oreilles.
          </p>
          <div className="pt-2">
            <button
              onClick={resetAllFilters}
              className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-[#154738] transition-colors"
            >
              Afficher toute la collection
            </button>
          </div>
        </div>
      )}

      {/* 4. REASSURANCE BANNER AT BOTTOM */}
      <div className="mt-16 rounded-2xl bg-[#0B2D23] text-[#FAF7F2] p-8 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#FAF7F2] text-[#0B2D23] flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                LIVRAISON GRATUITE PARTOUT AU MAROC
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1">
                Expédition sous 24h à Casablanca et 24/48h dans toutes les villes du Royaume.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#FAF7F2] text-[#0B2D23] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                VÉRIFIEZ AVANT DE PAYER
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1">
                Le livreur attend que vous ouvriez le coffret pour admirer votre bijou avant de régler.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#FAF7F2] text-[#0B2D23] flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                ÉCHANGE GARANTI 30 JOURS
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1">
                Un souci de taille ? Notre conciergerie WhatsApp organise l&apos;échange sans frais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
