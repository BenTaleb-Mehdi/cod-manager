"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, Heart, ShoppingBag, Zap } from "lucide-react";
import { Product } from "@/types/storefront";
import { QuickCheckoutModal } from "./quick-checkout-modal";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState(false);

  // Sync wishlist state with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meraf_wishlist");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(product.id)) {
          setIsWishlisted(true);
        }
      }
    } catch {
      // ignore
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("meraf_wishlist");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      if (list.includes(product.id)) {
        list = list.filter((id) => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem("meraf_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist_updated"));
    } catch {
      // ignore
    }
  };

  const discountPercent = Math.round(
    ((product.compareAtPriceMAD - product.priceMAD) / product.compareAtPriceMAD) * 100
  );

  return (
    <>
      <div className="group relative rounded-[20px] sm:rounded-2xl border border-[#E8E4DC] bg-white hover:bg-[#FAF7F2]/40 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col">
        {/* Zone Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#F6F5F2]">
          <Link href={`/product/${product.slug}`} className="relative block w-full h-full p-2.5 sm:p-3">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 sm:p-3 group-hover:scale-108 transition-transform duration-500"
            />
          </Link>

          {/* Heart Wishlist Icon (Top Right - Matching Reference Mockup) */}
          <button
            onClick={toggleWishlist}
            aria-label="Ajouter aux favoris"
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/95 backdrop-blur-xs border border-[#E8E2D8] text-[#18221D] hover:text-[#0B2D23] active:scale-90 transition-all shadow-2xs flex items-center justify-center cursor-pointer"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                isWishlisted ? "fill-[#0B2D23] text-[#0B2D23]" : "text-[#18221D]/60"
              }`}
            />
          </button>

          {/* Badge Top Left (Promotion Flash / Badge) */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {discountPercent > 0 ? (
              <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase shadow-xs">
                -{discountPercent}%
              </span>
            ) : product.badge ? (
              <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase shadow-xs">
                {product.badge}
              </span>
            ) : null}
          </div>

          {/* Free Shipping Micro Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none hidden xs:block">
            <span className="rounded-full bg-white/90 backdrop-blur-xs border border-[#E8E2D8] px-2 py-0.5 text-[9px] font-medium text-[#0B2D23] flex items-center gap-1 shadow-2xs">
              <Truck className="h-2.5 w-2.5 text-[#0B2D23]" /> 0 DH Livr.
            </span>
          </div>
        </div>

        {/* Contenu Produit */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Titre */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif font-medium text-xs sm:text-base text-[#18221D] line-clamp-1 group-hover:text-[#0B2D23] transition-colors tracking-tight">
                {product.title}
              </h3>
            </Link>

            {/* Prix en DH */}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-lg font-bold font-serif text-[#0B2D23]">
                {product.priceMAD} DH
              </span>
              {product.compareAtPriceMAD > product.priceMAD && (
                <span className="text-[10px] sm:text-xs text-[#18221D]/40 line-through">
                  {product.compareAtPriceMAD} DH
                </span>
              )}
            </div>

            {/* Étoiles & Reviews count */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#9F8259] mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#C5A880] text-[#C5A880]"
                  />
                ))}
              </div>
              <span className="text-[#18221D]/55 text-[9px] sm:text-[10px] font-medium ml-0.5">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Dual Action Buttons: Commander (1-Clic COD) + Ajouter au Panier */}
          <div className="pt-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQuickCheckoutOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-[10px] sm:text-xs tracking-wider uppercase py-2 px-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Commander directement en 1-clic avec paiement à la livraison"
            >
              <Zap className="h-3 w-3 text-[#C5A880]" />
              <span>Commander</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="flex items-center justify-center rounded-xl border border-[#0B2D23]/30 bg-white hover:bg-[#FAF7F2] text-[#0B2D23] p-2 text-xs shadow-2xs active:scale-90 transition-all cursor-pointer shrink-0"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#0B2D23]" />
            </button>
          </div>
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
