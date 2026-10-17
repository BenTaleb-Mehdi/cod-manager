"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useLanguage } from "@/context/language-context";
import { buildWhatsAppOrderLink } from "@/lib/storefront-data";

export function MobileBottomDock() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isArabic } = useLanguage();

  const whatsappUrl = buildWhatsAppOrderLink({});

  // Do not show dock on admin routes
  if (
    pathname.startsWith("/orders") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/suppliers") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Navigation Mobile"
      className="block md:hidden fixed bottom-4 inset-x-0 mx-auto w-[90%] max-w-[360px] z-50 pointer-events-auto"
    >
      {/* 
        White Frosted Glass (Effet Verre Dépoli Blanc):
        1. bg-white/70 (Transparence blanche équilibrée)
        2. backdrop-blur-2xl + backdrop-saturate-150 (Flou doux et lumineux)
        3. border border-white/60 (Bordure éclatante effet verre taillé)
        4. shadow-[0_8px_30px_rgba(0,0,0,0.08)] (Ombre douce naturelle)
      */}
      <div className="relative rounded-full bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2.5 px-5 flex items-center justify-between text-[#18221D]/70">
        
        {/* 1. Home */}
        <Link
          href="/"
          aria-label="Accueil"
          className={`p-1.5 rounded-full transition-all duration-300 ${
            pathname === "/"
              ? "text-[#0A261E] scale-110"
              : "text-[#18221D]/60 hover:text-[#0A261E]"
          }`}
        >
          <Home className="h-5 w-5" />
        </Link>

        {/* 2. Collections / Categories */}
        <Link
          href="/collections"
          aria-label="Catégories"
          className={`p-1.5 rounded-full transition-all duration-300 ${
            pathname.startsWith("/collections")
              ? "text-[#0A261E] scale-110"
              : "text-[#18221D]/60 hover:text-[#0A261E]"
          }`}
        >
          <Grid className="h-5 w-5" />
        </Link>

        {/* 3. Wishlist / Favoris */}
        <Link
          href="/favoris"
          aria-label="Favoris"
          className={`relative p-1.5 rounded-full transition-all duration-300 ${
            pathname.startsWith("/favoris") || pathname.startsWith("/favorites")
              ? "text-[#0A261E] scale-110"
              : "text-[#18221D]/60 hover:text-[#0A261E]"
          }`}
        >
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#0A261E] text-white font-bold text-[8.5px] flex items-center justify-center shadow-xs">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* 4. Cart / Panier */}
        <button
          type="button"
          onClick={openCart}
          aria-label="Panier"
          className="relative p-1.5 rounded-full text-[#18221D]/60 hover:text-[#0A261E] transition-all duration-300 cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#C5A880] text-[#0A261E] font-bold text-[9px] flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          )}
        </button>

        {/* 5. WhatsApp Concierge */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="relative p-1.5 rounded-full text-[#0A261E] hover:text-[#25D366] transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#25D366] ring-2 ring-white" />
        </a>
      </div>
    </nav>
  );
}