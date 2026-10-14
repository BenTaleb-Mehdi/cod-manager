"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Sparkles, ArrowRight, Zap, ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/storefront-data";
import { Product } from "@/types/storefront";
import { useLanguage } from "@/context/language-context";

interface TopSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopSearchBar({ isOpen, onClose }: TopSearchBarProps) {
  const router = useRouter();
  const { t, isArabic } = useLanguage();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const products = getProducts();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter matching products
  const filteredProducts = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase().trim();
          return (
            p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.highlights.some((h) => h.toLowerCase().includes(q))
          );
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/collections?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingTags = [
    { label: "Colliers Émeraude", ar: "قلائد زمرد" },
    { label: "Bagues Ajustables", ar: "خواتم قابلة للتعديل" },
    { label: "Bracelets Jonc", ar: "أساور صلبة" },
    { label: "Boucles d'oreilles", ar: "أقراط" },
    { label: "Acier 316L", ar: "ستانلس ستيل 316L" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-200"
      }`}
    >
      {/* 1. Backdrop Blur Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0B2D23]/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 2. Top Bar Dropdown Container (Smooth Slide-Down Animation) */}
      <div
        className={`relative z-10 w-full bg-[#FAF7F2] border-b border-[#E8E2D8] shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          {/* Header of Search with Close */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0B2D23]">
              <Sparkles className="h-4 w-4 text-[#C5A880]" />
              <span>{isArabic ? "البحث في مجوهرات مِيراف" : "Rechercher une création joaillière"}</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Fermer la recherche"
              className="p-1.5 rounded-full text-[#18221D]/70 hover:text-[#0B2D23] hover:bg-black/5 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            >
              <span className="hidden sm:inline text-[11px] text-[#18221D]/50 uppercase tracking-wider">
                Fermer [ESC]
              </span>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Large Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-4 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#0B2D23]/60 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white border border-[#E8E2D8] text-sm sm:text-base text-[#0B2D23] placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/30 shadow-xs transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 p-1 text-[#18221D]/40 hover:text-[#0B2D23] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Trending Searches */}
          <div className="mt-3.5 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-[#18221D]/60 tracking-wider">
              {isArabic ? "عمليات شائعة :" : "Populaires :"}
            </span>
            {trendingTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(tag.label)}
                className="text-[11px] py-1 px-3 rounded-full bg-white hover:bg-[#0B2D23] hover:text-white border border-[#E8E2D8] text-[#18221D]/80 transition-all cursor-pointer shadow-2xs"
              >
                {tag.label} {isArabic && `(${tag.ar})`}
              </button>
            ))}
          </div>

          {/* Live Search Results Container */}
          {query.trim() && (
            <div className="mt-5 pt-4 border-t border-[#E8E2D8] max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#0B2D23]/70">
                <span>
                  {filteredProducts.length} {filteredProducts.length > 1 ? "résultats trouvés" : "résultat trouvé"}
                </span>
                {filteredProducts.length > 0 && (
                  <Link
                    href={`/collections?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-[#C5A880] hover:text-[#0B2D23] font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Voir tous les résultats</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-[#18221D]/60 space-y-2">
                  <p className="text-sm font-medium">
                    {isArabic
                      ? "لم يتم العثور على أي مجوهرات تطابق هذا البحث."
                      : "Aucun bijou ne correspond à votre recherche."}
                  </p>
                  <p className="text-xs text-[#18221D]/45">
                    Essayez des mots-clés plus généraux comme &ldquo;or&rdquo;, &ldquo;collier&rdquo; ou &ldquo;émeraude&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="group p-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] hover:border-[#C5A880] transition-all flex items-center gap-3 shadow-2xs"
                    >
                      <div className="relative aspect-square h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-[#F6F5F2]">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-xs font-medium text-[#18221D] group-hover:text-[#0B2D23] truncate transition-colors">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold font-serif text-[#0B2D23]">
                            {product.priceMAD} DH
                          </span>
                          {product.compareAtPriceMAD > product.priceMAD && (
                            <span className="text-[10px] text-[#18221D]/40 line-through">
                              {product.compareAtPriceMAD} DH
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-[#9F8259] font-medium block truncate mt-0.5">
                          {product.category}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#18221D]/40 group-hover:text-[#0B2D23] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
