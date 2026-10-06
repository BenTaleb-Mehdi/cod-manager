"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, Heart, ArrowRight } from "lucide-react";
import { Product } from "@/types/storefront";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent = Math.round(
    ((product.compareAtPriceMAD - product.priceMAD) / product.compareAtPriceMAD) * 100
  );

  return (
    <div className="group relative rounded-xl border border-[#E8E2D8] bg-[#FDFCF9] hover:bg-white overflow-hidden shadow-[0_2px_12px_rgba(11,45,35,0.03)] hover:shadow-[0_12px_28px_rgba(11,45,35,0.08)] hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col">
      {/* Zone Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Heart Wishlist Icon (Top Right, as in reference) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E2D8] text-[#18221D] hover:text-[#0B2D23] hover:scale-110 transition-all shadow-sm"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-[#0B2D23] text-[#0B2D23]" : "text-[#18221D]/60"
            }`}
          />
        </button>

        {/* Badge Promotion Flash / Top Vente */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-full bg-[#A8875A] text-[#FAF7F2] px-2 py-0.5 text-[9px] font-black tracking-wider uppercase shadow-sm w-fit">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Badge Livraison Gratuite */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <span className="rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#E8E2D8] px-2.5 py-0.5 text-[10px] font-medium text-[#0B2D23] flex items-center gap-1 shadow-xs">
            <Truck className="h-3 w-3 text-[#0B2D23]" /> Livr. Gratuite
          </span>
        </div>
      </div>

      {/* Contenu Produit */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Titre */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-medium text-base sm:text-lg text-[#18221D] line-clamp-1 group-hover:text-[#0B2D23] transition-colors tracking-tight">
              {product.title}
            </h3>
          </Link>

          {/* Prix en DH */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-lg sm:text-xl font-bold font-serif text-[#0B2D23]">
              {product.priceMAD} DH
            </span>
            {product.compareAtPriceMAD > product.priceMAD && (
              <span className="text-xs text-[#18221D]/40 line-through">
                {product.compareAtPriceMAD} DH
              </span>
            )}
          </div>

          {/* 5 Étoiles & Reviews count (Matching reference photo: ★★★★★ (48)) */}
          <div className="flex items-center gap-1 text-xs text-[#9F8259] mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-[#C5A880] text-[#C5A880]"
                />
              ))}
            </div>
            <span className="text-[#18221D]/60 text-[11px] font-medium ml-1">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        <div>
          {/* Barre de rareté du stock */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-[10px] text-[#18221D]/60 font-medium">
              <span className="text-[#9F8259] font-bold">
                Plus que {product.stock} pièces
              </span>
              <span>Stock limité</span>
            </div>
            <div className="h-1 w-full rounded-full bg-[#E8E2D8] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C5A880] to-[#0B2D23] rounded-full"
                style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
              />
            </div>
          </div>

          {/* Bouton d'action Rapide COD (Deep Emerald Luxury Button) */}
          <Link
            href={`/product/${product.slug}#cod-checkout-section`}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase py-2.5 px-3 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <span>Commander (COD)</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#C5A880]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
