"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

interface ProductGalleryProps {
  images: string[];
  title: string;
  badge?: string;
  productId?: string;
}

export function ProductGallery({ images, title, badge, productId }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openCart, totalItems } = useCart();

  const isWishlisted = productId ? isInWishlist(productId) : false;

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 max-w-[460px] mx-auto lg:max-w-none">
      {/* Zone Image Principale Balancée (Format Carré Élégant) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EBE6DF] bg-[#FAF8F5] shadow-xs">
        <Image
          src={images[selectedIndex] || images[0]}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 440px"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Barre de navigation supérieure flottante (Back arrow + Wishlist + Cart) */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none">
          <Link
            href="/collections"
            aria-label="Retour aux collections"
            className="h-9 w-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#18221D] shadow-xs flex items-center justify-center transition-all active:scale-90 pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2 pointer-events-auto">
            {productId && (
              <button
                type="button"
                onClick={() => toggleWishlist(productId)}
                aria-label="Ajouter aux favoris"
                className="h-9 w-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#18221D] shadow-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-[#18221D] text-[#18221D]" : "text-[#18221D]/75"
                  }`}
                />
              </button>
            )}

            <button
              type="button"
              onClick={openCart}
              aria-label="Ouvrir le panier"
              className="relative h-9 w-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#18221D] shadow-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-[#18221D]/85" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#18221D] text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Badge optionnel */}
        {badge && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <span className="rounded-full bg-[#18221D]/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-[#FAF7F2] uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}

        {/* Boutons flèches discrets */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Photo précédente"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white text-[#18221D] p-1.5 backdrop-blur-xs transition-all shadow-xs z-10 active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Photo suivante"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white text-[#18221D] p-1.5 backdrop-blur-xs transition-all shadow-xs z-10 active:scale-90 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Pagination Dots centrés en bas (Identique au mockup Screen 2) */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-white/70 backdrop-blur-xs px-2.5 py-1.5 rounded-full shadow-2xs">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`transition-all rounded-full ${
                  selectedIndex === idx
                    ? "w-4 h-1.5 bg-[#18221D]"
                    : "w-1.5 h-1.5 bg-[#18221D]/30 hover:bg-[#18221D]/50"
                }`}
                aria-label={`Photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniatures horizontales */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? "border-[#18221D] scale-102 shadow-xs"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} vignette ${idx + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
