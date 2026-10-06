"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/storefront";

interface StickyMobileCtaProps {
  product: Product;
}

export function StickyMobileCta({ product }: StickyMobileCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher la barre sticky dès qu'on a scrollé plus de 350px
      const scrolled = window.scrollY > 350;
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCheckout = () => {
    const el = document.getElementById("cod-checkout-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block sm:hidden border-t border-[#E8E2D8] bg-[#FAF7F2]/95 backdrop-blur-md p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-serif font-medium text-[#18221D]">
            {product.title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-serif text-[#0B2D23]">
              {product.priceMAD} DH
            </span>
            <span className="text-[11px] text-[#18221D]/50 line-through">
              {product.compareAtPriceMAD} DH
            </span>
            <span className="text-[10px] font-semibold text-[#0B2D23]">
              • Livr. 0 DH
            </span>
          </div>
        </div>

        <button
          onClick={scrollToCheckout}
          className="shrink-0 rounded-full bg-[#0B2D23] hover:bg-[#154738] px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] shadow-md shadow-[#0B2D23]/20 active:scale-95 flex items-center gap-1.5"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
          <span>Acheter (COD)</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#C5A880]" />
        </button>
      </div>
    </div>
  );
}
