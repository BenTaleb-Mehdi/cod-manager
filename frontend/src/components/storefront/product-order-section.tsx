"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Product, ProductOffer } from "@/types/storefront";
import { buildWhatsAppOrderLink } from "@/lib/storefront-data";
import { useCart } from "@/context/cart-context";
import { CodOrderDrawer } from "./cod-order-drawer";
import { StickyMobileCta } from "./sticky-mobile-cta";

interface ProductOrderSectionProps {
  product: Product;
}

export function ProductOrderSection({ product }: ProductOrderSectionProps) {
  const { addToCart } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState<string>(
    product.offers.find((o) => o.isPopular)?.id ||
      product.offers[0]?.id ||
      "pack-1"
  );
  const [quantity, setQuantity] = useState<number>(1);

  const activeOffer: ProductOffer = useMemo(() => {
    return (
      product.offers.find((o) => o.id === selectedPackId) ||
      product.offers[0] || {
        id: "pack-1",
        title: "1 Pièce",
        quantity: 1,
        priceMAD: product.priceMAD,
        compareAtPriceMAD: product.compareAtPriceMAD,
        savingsMAD: product.compareAtPriceMAD - product.priceMAD,
      }
    );
  }, [product.offers, selectedPackId, product.priceMAD, product.compareAtPriceMAD]);

  const discountPercent = Math.round(
    ((product.compareAtPriceMAD - product.priceMAD) / product.compareAtPriceMAD) * 100
  );

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappUrl = buildWhatsAppOrderLink({
    productTitle: product.title,
    packName: `${activeOffer.title} (x${quantity})`,
    priceMAD: activeOffer.priceMAD * quantity,
    productUrl: currentUrl,
  });

  const handleAddToCart = () => {
    addToCart(product, activeOffer, quantity);
  };

  return (
    <>
      {/* Barre sticky mobile synchronisée avec le tiroir */}
      <StickyMobileCta
        product={product}
        onOpenOrder={() => setIsDrawerOpen(true)}
      />

      {/* Hiérarchie exacte demandée : Titre -> Sub description short -> Prix (after & before) -> Stars -> Stepper [- 1 +] & Commander -> Ajouter au Panier -> Contact WhatsApp */}
      <div className="space-y-4">
        {/* 1. Title */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#18181B] font-normal tracking-tight leading-tight">
          {product.title}
        </h1>

        {/* 2. Sub description short */}
        <p className="text-xs sm:text-sm text-[#18181B]/75 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* 3. Price after and before */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2D23]">
            {product.priceMAD} DH
          </span>
          {product.compareAtPriceMAD > product.priceMAD && (
            <span className="text-sm sm:text-base text-[#18181B]/40 line-through">
              {product.compareAtPriceMAD} DH
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-full bg-[#0B2D23] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
              -{discountPercent}% Aujourd&apos;hui
            </span>
          )}
        </div>

        {/* 4. Stars */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[#C5A880] text-[#C5A880]"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#18181B]">{product.rating}</span>
          <span className="text-xs text-[#18181B]/50">
            ({product.reviewsCount} avis vérifiés)
          </span>
        </div>

        {/* 5. Row : Button + and - for Quantity (left) & Button Command (right) */}
        <div className="pt-2 flex items-center gap-3">
          {/* Stepper Quantity [- 1 +] */}
          <div className="flex items-center gap-3 bg-[#FAF7F2] rounded-full px-4 py-3 border border-[#E8E2D8] shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-[#18181B]/70 hover:text-[#0B2D23] active:scale-90 transition-all p-0.5 cursor-pointer"
              aria-label="Diminuer la quantité"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-[#0B2D23] min-w-[18px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-[#18181B]/70 hover:text-[#0B2D23] active:scale-90 transition-all p-0.5 cursor-pointer"
              aria-label="Augmenter la quantité"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Button Commander (in right) -> Ouvre le tiroir fluide depuis la droite */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] py-3.5 px-6 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-[#C5A880]" />
            <span>Commander</span>
          </button>
        </div>

        {/* 6. Under : Button Add to Cart (Add Panel) */}
        <div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#0B2D23] bg-white hover:bg-[#FAF7F2] py-3.5 px-6 text-xs font-bold tracking-wider uppercase text-[#0B2D23] shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-[#C5A880]" />
            <span>Ajouter au Panier</span>
          </button>
        </div>

        {/* 7. Under : Contact WhatsApp */}
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full border border-[#0B2D23]/30 bg-[#FAF7F2] hover:bg-white py-3 px-4 text-xs font-semibold tracking-wider uppercase text-[#0B2D23] transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-[#0B2D23]" />
            <span>Contact WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Le Tiroir Coulissant depuis la Droite (Slide-over Drawer) */}
      <CodOrderDrawer
        product={product}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedPackId={selectedPackId}
        onSelectPack={(packId) => setSelectedPackId(packId)}
      />
    </>
  );
}
