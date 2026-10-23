"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { Product } from "@/types/storefront";
import { QuickCheckoutModal } from "./quick-checkout-modal";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discountPercent = product.compareAtPriceMAD > product.priceMAD
    ? Math.round(((product.compareAtPriceMAD - product.priceMAD) / product.compareAtPriceMAD) * 100)
    : 0;

  return (
    <>
      <div className="group relative rounded-[22px] sm:rounded-3xl bg-white hover:bg-gray-50 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
        {/* Zone Image avec Ratio Portrait 4/5 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE8E1]">
          <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Wishlist Heart Icon Minimaliste (Top Right) */}
          <button
            onClick={handleToggleWishlist}
            aria-label="Ajouter aux favoris"
            className="absolute top-2.5 right-2.5 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-xs text-[#18221D] active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                isWishlisted ? "fill-[#18221D] text-[#18221D]" : "text-[#18221D]/70"
              }`}
            />
          </button>

          {/* Badge discret (Top Left) */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="rounded-full bg-[#0A261E]/80 backdrop-blur-md text-[#FAF7F2] px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-semibold tracking-wider uppercase">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Info Zone */}
        <div className="p-3 sm:p-4 flex items-end justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="min-w-0 flex-1 block">
            <h3 className="font-serif font-normal text-xs sm:text-sm text-[#18221D] line-clamp-1 group-hover:text-black transition-colors leading-tight">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xs sm:text-sm font-semibold text-[#18221D]">
                {product.priceMAD} DH
              </span>
              {product.compareAtPriceMAD > product.priceMAD && (
                <span className="text-[10px] sm:text-[11px] text-[#18221D]/40 line-through">
                  {product.compareAtPriceMAD} DH
                </span>
              )}
            </div>
          </Link>

          {/* Bouton '+' Green Blur & Glassmorphism */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Ajouter au panier"
            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 cursor-pointer shrink-0 backdrop-blur-md border ${
              justAdded
                ? "bg-[#0A261E] text-white border-[#0A261E] ring-2 ring-[#0A261E]/30"
                : "bg-[#0A261E]/85 hover:bg-[#0A261E] text-white border-[#C5A880]/30 hover:scale-105"
            }`}
          >
            {justAdded ? (
              <Check className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>

      {/* Quick COD Checkout Modal */}
      <QuickCheckoutModal
        product={product}
        isOpen={quickCheckoutOpen}
        onClose={() => setQuickCheckoutOpen(false)}
      />
    </>
  );
}