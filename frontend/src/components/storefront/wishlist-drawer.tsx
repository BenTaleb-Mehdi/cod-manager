"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, Trash2, ShoppingBag, Zap, ArrowRight, Sparkles } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { getProducts } from "@/lib/storefront-data";
import { Product } from "@/types/storefront";
import { QuickCheckoutModal } from "./quick-checkout-modal";

export function WishlistDrawer() {
  const { wishlistIds, isWishlistOpen, closeWishlist, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();
  const { isArabic } = useLanguage();
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);

  const allProducts = getProducts();
  const favoritedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          isWishlistOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-200"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={closeWishlist}
          className={`absolute inset-0 bg-[#0B2D23]/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isWishlistOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Slide-over Panel from Right */}
        <aside
          aria-label="Panier des Favoris"
          className={`absolute top-0 right-0 h-full w-full max-w-[440px] bg-[#FAF7F2] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-10 ${
            isWishlistOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#0B2D23]/10 text-[#0B2D23] flex items-center justify-center">
                <Heart className="h-4 w-4 fill-[#0B2D23]" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#0B2D23] flex items-center gap-2">
                  <span>Mes Favoris</span>
                  <span className="text-[#9F8259] font-sans text-xs">| المفضلة</span>
                </h3>
                <p className="text-[10px] text-[#18221D]/60 uppercase tracking-widest">
                  {favoritedProducts.length} {favoritedProducts.length > 1 ? "créations sauvegardées" : "création sauvegardée"}
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              aria-label="Fermer le tiroir des favoris"
              className="p-2 rounded-full text-[#18221D]/70 hover:text-[#0B2D23] hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {favoritedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#E8E2D8]/60 flex items-center justify-center text-[#9F8259]">
                  <Heart className="h-8 w-8 text-[#9F8259]/60" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-[#0B2D23]">
                    Votre liste de favoris est vide
                  </h4>
                  <p className="font-sans text-xs text-[#0B2D23]/70">قائمة المفضلة فارغة حالياً</p>
                  <p className="text-xs text-[#18221D]/60 max-w-xs pt-1">
                    Enregistrez vos bijoux coups de cœur pour les retrouver en un clic avec livraison gratuite partout au Maroc.
                  </p>
                </div>

                <Link
                  href="/collections"
                  onClick={closeWishlist}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase px-5 py-3 shadow-md active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Découvrir les collections | تصفح</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {favoritedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#C5A880]/60 transition-all shadow-2xs flex gap-3 group"
                  >
                    {/* Fixed Size Image taking full space */}
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeWishlist}
                      className="relative aspect-square h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-[#F6F5F2]"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="100px"
                        className="object-cover group-hover:scale-108 transition-transform duration-300"
                      />
                    </Link>

                    {/* Info & Buttons */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={closeWishlist}
                            className="font-serif text-xs sm:text-sm font-medium text-[#18221D] hover:text-[#0B2D23] line-clamp-1 transition-colors"
                          >
                            {product.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product.id)}
                            aria-label="Retirer des favoris"
                            className="text-[#18221D]/40 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xs sm:text-sm font-bold font-serif text-[#0B2D23]">
                            {product.priceMAD} DH
                          </span>
                          {product.compareAtPriceMAD > product.priceMAD && (
                            <span className="text-[10px] text-[#18221D]/40 line-through">
                              {product.compareAtPriceMAD} DH
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Commander | طلبات + Ajouter au Panier */}
                      <div className="pt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedQuickProduct(product)}
                          className="flex-1 min-w-0 flex items-center justify-center gap-1 rounded-lg bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-[10px] uppercase py-1.5 px-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
                          title="Commander en 1 Clic"
                        >
                          <Zap className="h-2.5 w-2.5 text-[#C5A880] shrink-0" />
                          <span className="truncate">{isArabic ? "طلب الآن" : "Commander"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="p-1.5 rounded-lg border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-white text-[#0B2D23] active:scale-95 transition-all cursor-pointer"
                          title="Ajouter au Panier"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {favoritedProducts.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8E2D8] bg-[#FAF7F2] space-y-2.5">
              <Link
                href="/favoris"
                onClick={closeWishlist}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase py-3 shadow-md active:scale-95 transition-all"
              >
                <span>Voir toute la page favoris | عرض الكل</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <div className="flex items-center justify-between text-xs px-1 text-[#18221D]/60">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-red-700/80 hover:text-red-700 underline text-[11px] cursor-pointer"
                >
                  Vider mes favoris | مسح القائمة
                </button>
                <span className="text-[11px] text-[#0B2D23] font-medium">
                  ✦ Paiement à la livraison
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Quick Checkout Modal if triggered from Wishlist */}
      {selectedQuickProduct && (
        <QuickCheckoutModal
          product={selectedQuickProduct}
          isOpen={true}
          onClose={() => setSelectedQuickProduct(null)}
        />
      )}
    </>
  );
}
