"use client";

import React, { useState, useEffect } from "react";
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
      className="block md:hidden fixed bottom-4 inset-x-0 mx-auto w-[92%] max-w-[370px] z-40 pointer-events-auto"
    >
      <div className="relative rounded-full bg-[#111A16]/90 backdrop-blur-xl border border-white/20 shadow-2xl py-2 px-3 flex items-center justify-around text-white/70">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-full transition-all ${
            pathname === "/"
              ? "text-[#C5A880] font-semibold scale-105"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="text-[8.5px] tracking-tight">{isArabic ? "الرئيسية" : "Accueil"}</span>
        </Link>

        {/* 2. Collections / Categories */}
        <Link
          href="/collections"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-full transition-all ${
            pathname.startsWith("/collections")
              ? "text-[#C5A880] font-semibold scale-105"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Grid className="h-4 w-4" />
          <span className="text-[8.5px] tracking-tight">{isArabic ? "الأصناف" : "Catégories"}</span>
        </Link>

        {/* 3. Wishlist / Favoris */}
        <Link
          href="/favoris"
          className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-full transition-all ${
            pathname.startsWith("/favoris") || pathname.startsWith("/favorites")
              ? "text-[#C5A880] font-semibold scale-105"
              : "text-white/70 hover:text-white"
          }`}
        >
          <div className="relative">
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 h-3.5 w-3.5 rounded-full bg-[#C5A880] text-[#0B2D23] font-bold text-[8px] flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[8.5px] tracking-tight">{isArabic ? "المفضلة" : "Favoris"}</span>
        </Link>

        {/* 4. Cart / Commandes (opens cart drawer) */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 h-3.5 w-3.5 rounded-full bg-emerald-400 text-[#0B2D23] font-bold text-[8px] flex items-center justify-center shadow-xs animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[8.5px] tracking-tight font-medium text-[#C5A880]">
            {isArabic ? "طلبات" : "Commandes | طلبات"}
          </span>
        </button>

        {/* 5. WhatsApp Advisor */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-full text-white/70 hover:text-[#C5A880] transition-all"
        >
          <div className="relative">
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#111A16]" />
          </div>
          <span className="text-[8.5px] tracking-tight">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
