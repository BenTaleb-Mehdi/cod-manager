"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  RotateCcw as ResetIcon,
  Filter,
  Eye,
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

const PRICE_RANGES = [
  { id: "all", label: "Tous les prix", badge: "Tout budget", desc: "Toutes nos gammes" },
  { id: "under-200", label: "Moins de 200 DH", badge: "< 200 DH", desc: "Prix accessibles" },
  { id: "200-250", label: "200 DH à 250 DH", badge: "200 - 250 DH", desc: "Cœur de collection" },
  { id: "above-250", label: "Plus de 250 DH", badge: "> 250 DH", desc: "Parures & coffrets" },
] as const;

export function CollectionsView({ initialProducts, categories }: CollectionsViewProps) {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");
  const initialSearchParam = searchParams.get("search");

  const [searchQuery, setSearchQuery] = useState(initialSearchParam || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategoryParam || "all"
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  // Sync with URL search params when changed
  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
    if (initialSearchParam !== null && initialSearchParam !== undefined) {
      setSearchQuery(initialSearchParam);
    }
  }, [initialCategoryParam, initialSearchParam]);

  // Lock body scroll on mobile filter drawer
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all") {
          const sel = selectedCategory.toLowerCase();
          const pCat = product.category.toLowerCase();
          const pCatLabel = (product.categoryLabel || "").toLowerCase();

          const matchesDirect = pCat === sel || pCatLabel === sel;
          const matchesMeta = categories.some((c) => {
            const cSlug = c.slug.toLowerCase();
            const cId = c.id.toLowerCase();
            const cName = c.name.toLowerCase();
            const isTargetCat = sel === cSlug || sel === cId || sel === cName;
            return isTargetCat && (pCat === cId || pCat === cSlug || pCat === cName || pCatLabel.includes(cName));
          });

          if (!matchesDirect && !matchesMeta) return false;
        }

        // Search filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchDesc = product.shortDescription?.toLowerCase().includes(q);
          const matchCat = (product.categoryLabel || product.category).toLowerCase().includes(q);
          const matchHighlights = product.highlights?.some((h) => h.toLowerCase().includes(q));
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
        // Default "featured": reviews count * rating
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

  const getCategoryCount = (slug: string, id: string) => {
    return initialProducts.filter((p) => {
      const pCat = p.category.toLowerCase();
      return pCat === slug.toLowerCase() || pCat === id.toLowerCase();
    }).length;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP MINIMALIST FILTER & NAVIGATION BAR */}
      <section className="space-y-4">
        {/* Horizontal Category Pill Tabs (Sleek Apple/Mejuri style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#0A261E] text-[#FAF8F5] shadow-xs scale-102 font-semibold"
                : "bg-white text-stone-700 hover:text-[#0A261E] border border-stone-200/80 hover:border-stone-300 shadow-2xs"
            }`}
          >
            <span>Toutes les créations</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === "all"
                  ? "bg-white/20 text-[#FAF8F5]"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {initialProducts.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.slug.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const count = getCategoryCount(cat.slug, cat.id) || cat.count;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#0A261E] text-[#FAF8F5] shadow-xs scale-102 font-semibold"
                    : "bg-white text-stone-700 hover:text-[#0A261E] border border-stone-200/80 hover:border-stone-300 shadow-2xs"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-[#FAF8F5]"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Utility Toolbar: Search, Filters Toggle, In-Stock Quick Switch, Sort */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left: Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par mot-clé (or, émeraude, jonc, bague)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-[#111] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#0A261E] focus:ring-2 focus:ring-[#0A261E]/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right: Controls & Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end overflow-x-auto pb-0.5 scrollbar-none">
              
              {/* Desktop Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                className={`hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                  showDesktopFilters
                    ? "bg-[#0A261E] text-white border-[#0A261E] shadow-xs"
                    : "bg-white text-stone-700 hover:text-[#0A261E] border-stone-200/80 hover:bg-stone-50 shadow-2xs"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="h-5 min-w-5 px-1 rounded-full bg-[#C5A880] text-[#0A261E] text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Mobile Filter Sheet Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white text-stone-700 hover:text-[#0A261E] border border-stone-200/80 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A880]" />
                <span>Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#0A261E] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Quick "En Stock" Toggle Chip */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  inStockOnly
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                    : "bg-white text-stone-600 hover:text-stone-900 border-stone-200/80 hover:bg-stone-50"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    inStockOnly ? "bg-emerald-600 animate-pulse" : "bg-stone-300"
                  }`}
                />
                <span>En Stock</span>
              </button>

              {/* Minimal Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-white border border-stone-200/80 text-xs font-semibold text-stone-800 hover:border-stone-300 focus:outline-none focus:border-[#0A261E] focus:ring-2 focus:ring-[#0A261E]/10 cursor-pointer shadow-2xs transition-all"
                >
                  <option value="featured">✨ Nouveautés & Populaire</option>
                  <option value="price-asc">Prix : Moins cher</option>
                  <option value="price-desc">Prix : Plus cher</option>
                  <option value="rating">★ Meilleures notes</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* 2. ACTIVE FILTERS TAGS BAR */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 px-1">
            <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1.5">
              <Filter className="h-3 w-3 text-[#C5A880]" />
              Filtres actifs :
            </span>

            {/* Category tag */}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200/90 pl-3 pr-2 py-1 text-xs text-stone-800 shadow-2xs">
                <span>Catégorie :</span>
                <strong className="font-semibold text-[#0A261E] capitalize">
                  {categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  aria-label="Retirer le filtre catégorie"
                  className="p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Price tag */}
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200/90 pl-3 pr-2 py-1 text-xs text-stone-800 shadow-2xs">
                <span>Budget :</span>
                <strong className="font-semibold text-[#0A261E]">
                  {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.badge}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange("all")}
                  aria-label="Retirer le filtre prix"
                  className="p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* In stock tag */}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200/90 pl-3 pr-2 py-1 text-xs text-stone-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>En stock uniquement</span>
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  aria-label="Retirer le filtre stock"
                  className="p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Search query tag */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200/90 pl-3 pr-2 py-1 text-xs text-stone-800 shadow-2xs">
                <span>Recherche :</span>
                <strong className="font-semibold text-[#0A261E]">« {searchQuery} »</strong>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Retirer la recherche"
                  className="p-0.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Reset All Action */}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-[#C5A880] hover:text-[#0A261E] font-semibold underline underline-offset-4 ml-2 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ResetIcon className="h-3 w-3" />
              <span>Tout effacer</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. MAIN CONTENT: RESPONSIVE SIDEBAR + PRODUCTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR (Collapsible, Clean Minimal Luxury) */}
        {showDesktopFilters && (
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white rounded-2xl border border-stone-200/80 p-5 space-y-6 shadow-xs">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C5A880]" />
                <h3 className="font-serif text-lg font-medium text-[#0A261E] tracking-tight">
                  Affiner la sélection
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-semibold text-[#C5A880] hover:text-[#0A261E] transition-colors cursor-pointer"
                >
                  Effacer tout
                </button>
              )}
            </div>

            {/* Category Section */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Catégories
              </h4>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-[#0A261E] text-white font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>Toutes les créations</span>
                  <span className={`text-[10px] ${selectedCategory === "all" ? "text-white/80" : "text-stone-400"}`}>
                    {initialProducts.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase() ||
                    selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                    selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  const count = getCategoryCount(cat.slug, cat.id) || cat.count;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0A261E] text-white font-semibold"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-stone-400"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget / Price Section */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Gamme de Prix (MAD)
              </h4>
              <div className="space-y-1.5">
                {PRICE_RANGES.map((range) => {
                  const isSelected = selectedPriceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setSelectedPriceRange(range.id as PriceFilterOption)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-stone-50 border-[#0A261E] text-[#0A261E] font-semibold shadow-2xs"
                          : "border-transparent text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <div>
                        <span className="block">{range.label}</span>
                        <span className="block text-[10px] text-stone-400">{range.desc}</span>
                      </div>
                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-[#0A261E] text-white flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Stock iOS-style Switch Toggle */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">
                    Disponibilité immédiate
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    Expédition 24h garantie
                  </span>
                </div>
                
                {/* Modern Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={inStockOnly}
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    inStockOnly ? "bg-[#0A261E]" : "bg-stone-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      inStockOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

          </aside>
        )}

        {/* PRODUCTS GRID AREA */}
        <div className={`space-y-6 ${showDesktopFilters ? "lg:col-span-9" : "lg:col-span-12"}`}>
          
          {/* Header Summary */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-sans tracking-wider uppercase px-1 font-medium">
            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length > 1 ? "créations joaillières" : "création disponible"}
            </span>

            {!showDesktopFilters && (
              <button
                type="button"
                onClick={() => setShowDesktopFilters(true)}
                className="hidden lg:flex items-center gap-1.5 text-[#0A261E] font-sans font-semibold hover:underline cursor-pointer"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Afficher la barre de filtres</span>
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={`grid grid-cols-2 gap-3 sm:gap-6 ${
                showDesktopFilters
                  ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
                  : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-6 rounded-3xl border border-stone-200/80 bg-white space-y-4 max-w-md mx-auto my-6 shadow-xs">
              <div className="h-14 w-14 rounded-full bg-stone-100 text-[#C5A880] flex items-center justify-center mx-auto shadow-2xs">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#0A261E] font-normal">
                Aucune création trouvée
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Aucun bijou ne correspond exactement à vos critères actuels. Essayez de réinitialiser la recherche ou de changer de catégorie.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="rounded-full bg-[#0A261E] hover:bg-[#154738] text-[#FAF8F5] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Voir toute la collection
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. MOBILE SLIDE-OVER DRAWER (Responsive & Smooth) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-250">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C5A880]" />
                <h3 className="font-serif text-lg font-medium text-[#0A261E] tracking-tight">
                  Filtrer la collection
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#0A261E] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Fermer les filtres"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1 divide-y divide-stone-100">
              
              {/* Category */}
              <div className="space-y-3 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Catégories
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#0A261E] text-white border-[#0A261E] shadow-2xs"
                        : "bg-stone-50/70 text-stone-700 border-stone-200/70"
                    }`}
                  >
                    <span>Toutes les créations</span>
                    <span className="text-[10px] opacity-80">({initialProducts.length})</span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected =
                      selectedCategory.toLowerCase() === cat.slug.toLowerCase() ||
                      selectedCategory.toLowerCase() === cat.id.toLowerCase();
                    const count = getCategoryCount(cat.slug, cat.id) || cat.count;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0A261E] text-white border-[#0A261E] shadow-2xs"
                            : "bg-stone-50/70 text-stone-700 border-stone-200/70"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Gamme de Prix (MAD)
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {PRICE_RANGES.map((item) => {
                    const isSelected = selectedPriceRange === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPriceRange(item.id as PriceFilterOption)}
                        className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-stone-50 text-[#0A261E] border-[#0A261E] font-semibold"
                            : "bg-stone-50/60 text-stone-700 border-stone-200/70"
                        }`}
                      >
                        <div>
                          <span>{item.label}</span>
                          <span className="block text-[10px] text-stone-400 font-normal">{item.desc}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#0A261E]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock status */}
              <div className="pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      En stock uniquement
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      Prêt pour expédition 24h
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={inStockOnly}
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      inStockOnly ? "bg-[#0A261E]" : "bg-stone-200"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        inStockOnly ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-200/80 flex gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 rounded-xl border border-stone-300 py-3 text-xs font-semibold text-stone-700 hover:bg-white active:scale-98 transition-all cursor-pointer"
              >
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-2 rounded-xl bg-[#0A261E] hover:bg-[#154738] py-3 text-xs font-semibold text-white shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                Afficher ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. REASSURANCE LUXURY BANNER */}
      <section className="mt-16 rounded-3xl bg-[#0A261E] text-[#FAF8F5] p-6 sm:p-10 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-white/10 text-[#C5A880] flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                LIVRAISON GRATUITE MAROC
              </h4>
              <p className="text-[11px] text-stone-300 mt-1">
                Expédition sous 24h à Tanger & Casablanca, 24/48h dans tout le Royaume.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-white/10 text-[#C5A880] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                OUVREZ ET VÉRIFIEZ AVANT DE PAYER
              </h4>
              <p className="text-[11px] text-stone-300 mt-1">
                Le livreur vous laisse admirer le bijou dans son coffret avant de régler.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-white/10 text-[#C5A880] flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-white">
                ÉCHANGE SANS FRAIS
              </h4>
              <p className="text-[11px] text-stone-300 mt-1">
                Assistance WhatsApp directe pour échanger la taille rapidement et sans tracas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}