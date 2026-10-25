"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Truck,
  ShieldCheck,
  Search,
  MessageCircle,
  Heart,
  User,
  ChevronDown,
  ArrowRight,
  Gem,
  CircleDot,
  Clock,
  Package,
  Instagram,
  Facebook,
  Mail,
} from "lucide-react";
import { BRAND_NAME, BRAND_SUBTITLE, buildWhatsAppOrderLink, BRAND_PHONE_WHATSAPP, BRAND_SOCIALS, BRAND_GMAIL } from "@/lib/storefront-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useLanguage } from "@/context/language-context";
import { TopSearchBar } from "./top-search-bar";

function XLogo({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.95-4.57V8.78a8.28 8.28 0 0 0 4.82 1.52v-3.61z" />
    </svg>
  );
}

function WhatsAppLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function StorefrontHeader() {
  const { openCart, totalItems } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { language, toggleLanguage, isArabic } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const categories = [
    {
      name: "Necklaces",
      moroccanLabel: "Slasel (Colliers)",
      subtitle: "Pendentifs & Ras-de-cou",
      slug: "slasel",
      icon: Gem,
    },
    {
      name: "Rings",
      moroccanLabel: "Khowatem (Bagues)",
      subtitle: "Bagues Ajustables & Solitaires",
      slug: "khowatem",
      icon: Sparkles,
    },
    {
      name: "Bracelets",
      moroccanLabel: "Dmalj (Bracelets)",
      subtitle: "Joncs Fermoir Secret & Tennis",
      slug: "dmalj",
      icon: CircleDot,
    },
    {
      name: "Earrings",
      moroccanLabel: "Khwarsi (Boucles)",
      subtitle: "Créoles & Boucles Torsadées",
      slug: "khwarsi",
      icon: Heart,
    },
  ];

  const whatsappUrl = buildWhatsAppOrderLink({});

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
        {/* 1. Deep Emerald Green Announcement Bar with Smooth Marquee Swipe to Right */}
        <div className="bg-[#0B2D23] text-[#FAF7F2] py-2 overflow-hidden border-b border-[#C5A880]/20 select-none">
          <div className="animate-marquee-right flex items-center gap-6 sm:gap-8 text-[10.5px] sm:text-[11px] tracking-widest uppercase font-medium">
            {/* Set 1 */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>LIVRAISON GRATUITE PARTOUT AU MAROC</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>PAIEMENT À LA LIVRAISON</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span className="font-sans text-[11px] text-[#DFCCA8]">(الدفع بعد معاينة وفتح الطرد)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>ACIER INOXYDABLE HAUTE QUALITÉ</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>EXPÉDITION EXPRESS 24/48H</span>
              </span>
            </div>

            {/* Set 2 (Identical duplicate for seamless 60fps infinite loop) */}
            <div className="flex items-center gap-6 sm:gap-8 shrink-0" aria-hidden="true">
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>LIVRAISON GRATUITE PARTOUT AU MAROC</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>PAIEMENT À LA LIVRAISON</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span className="font-sans text-[11px] text-[#DFCCA8]">(الدفع بعد معاينة وفتح الطرد)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>ACIER INOXYDABLE HAUTE QUALITÉ</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#C5A880]">✦</span>
                <span>EXPÉDITION EXPRESS 24/48H</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Luxury Header */}
        <div className="container mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Left: Mobile hamburger & Desktop Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 lg:w-1/3 shrink-0">
            {/* Mobile Hamburger Button with Smooth Icon Animation */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#0B2D23] hover:bg-[#F3EFEA] active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Left Nav with Hover & Translate Animation */}
            <nav className="hidden lg:flex items-center gap-7 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#18221D]/80">
              {/* Mega Menu Dropdown: BIJOUX & COLLECTIONS */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setHoveredMenu("collections")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  href="/collections"
                  className="flex items-center gap-1.5 hover:text-[#0B2D23] transition-colors py-1 group-hover:text-[#0B2D23]"
                >
                  <span>COLLECTIONS</span>
                  <ChevronDown
                    className={`h-3 w-3 text-[#C5A880] transition-transform duration-300 ${
                      hoveredMenu === "collections" ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {/* Modern Hover Mega Menu (Translates smoothly from top) */}
                <div
                  className={`absolute top-full left-0 w-[560px] bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl shadow-2xl p-5 transform transition-all duration-300 ease-out z-50 origin-top ${
                    hoveredMenu === "collections"
                      ? "opacity-100 translate-y-1 pointer-events-auto visible"
                      : "opacity-0 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  <div className="grid grid-cols-12 gap-5">
                    {/* Left: 4 Categories */}
                    <div className="col-span-7 space-y-2 border-r border-[#E8E2D8] pr-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#9F8259] mb-1 flex items-center justify-between">
                        <span>Nos Catégories</span>
                        <span className="text-[9px] text-[#0B2D23]/50">Inox 316L Haute Qualité</span>
                      </div>

                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.slug}
                            href={`/collections?category=${cat.slug}`}
                            className="group/item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E8E2D8] transition-all"
                          >
                            <div className="h-8 w-8 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0B2D23] group-hover/item:border-[#C5A880] group-hover/item:text-[#C5A880] transition-colors shrink-0">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-[#0B2D23] group-hover/item:text-[#9F8259] transition-colors">
                                {cat.moroccanLabel}
                              </p>
                              <p className="text-[10px] text-[#18221D]/55 truncate">
                                {cat.subtitle}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Right: Featured Banner */}
                    <div className="col-span-5 flex flex-col justify-between p-3.5 rounded-xl bg-[#0B2D23] text-[#FAF7F2] relative overflow-hidden">
                      <div className="space-y-1.5 relative z-10">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A880] block">
                          ✦ Maison MÉRAF
                        </span>
                        <h4 className="font-serif text-sm font-normal text-white">
                          Paiement à la Livraison Partout au Maroc
                        </h4>
                        <p className="text-[10px] text-zinc-300 leading-relaxed">
                          Ouvrez et inspectez le colis avec le livreur avant de régler en espèces.
                        </p>
                      </div>

                      <div className="pt-3 relative z-10">
                        <Link
                          href="/collections"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
                        >
                          <span>Voir tout le catalogue</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Le Journal Link */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setHoveredMenu("journal")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  href="/blog"
                  className="hover:text-[#0B2D23] hover:underline underline-offset-4 decoration-[#C5A880] transition-colors py-1 group-hover:text-[#0B2D23]"
                >
                  LE JOURNAL
                </Link>

                {/* Submenu for Journal (Translate from top) */}
                <div
                  className={`absolute top-full left-0 w-64 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl shadow-xl p-3 space-y-1 transform transition-all duration-300 ease-out z-50 origin-top ${
                    hoveredMenu === "journal"
                      ? "opacity-100 translate-y-1 pointer-events-auto visible"
                      : "opacity-0 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  <Link
                    href="/blog/guide-entretien-acier-inoxydable-316l"
                    className="block p-2 text-[11px] font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] rounded-lg transition-colors"
                  >
                    ✦ Entretenir l&apos;acier 316L & l&apos;or 18k
                  </Link>
                  <Link
                    href="/blog/comment-choisir-taille-bague-parfaite"
                    className="block p-2 text-[11px] font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] rounded-lg transition-colors"
                  >
                    ✦ Choisir sa taille de bague
                  </Link>
                  <Link
                    href="/blog/tendances-bijoux-maroc-2026"
                    className="block p-2 text-[11px] font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] rounded-lg transition-colors"
                  >
                    ✦ Tendances Bijoux Maroc 2026
                  </Link>
                </div>
              </div>

              <Link
                href="/contact"
                className="hover:text-[#0B2D23] hover:underline underline-offset-4 decoration-[#C5A880] transition-colors py-1"
              >
                CONTACT
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo "MÉRAF JEWELRY" */}
          <div className="flex justify-center items-center lg:w-1/3 text-center shrink-0">
            <Link href="/" className="flex flex-col items-center group py-0.5">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.24em] sm:tracking-[0.28em] uppercase text-[#0B2D23] font-normal leading-none group-hover:opacity-90 transition-opacity">
                {BRAND_NAME}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] text-[#9F8259] font-medium uppercase mt-0.5 sm:mt-1">
                {BRAND_SUBTITLE}
              </span>
            </Link>
          </div>

          {/* Right: Search, Account, Wishlist, Cart Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-3 lg:w-1/3 text-[#18221D]/80 shrink-0">
            {/* Search Trigger (Smooth Top Search Bar) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] p-1.5 sm:px-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
              title="Rechercher un bijou / بحث"
              aria-label="Rechercher un bijou"
            >
              <Search className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-[#18221D]" />
              <span className="hidden xl:inline">RECHERCHE</span>
            </button>

         

            {/* WhatsApp Concierge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
              title="Conseillère joaillère disponible sur WhatsApp"
            >
              <User className="h-3.5 w-3.5 text-[#18221D]" />
              <span className="hidden xl:inline">CONSEILLÈRE</span>
            </a>

            {/* Quick Wishlist Drawer / Link Trigger (Desktop & Tablet only - Mobile already has it in the bottom dock) */}
            <button
              type="button"
              onClick={openWishlist}
              className="hidden sm:flex relative items-center gap-1 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] p-1.5 sm:px-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
              title="Mes Favoris | المفضلة"
              aria-label="Mes Favoris"
            >
              <Heart className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-[#18221D]" />
              <span className="hidden xl:inline">FAVORIS</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#C5A880] text-[#0B2D23] text-[8.5px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart / Direct Checkout Trigger (Hidden on mobile, visible on desktop/tablet) */}
            <button
              onClick={openCart}
              aria-label={`Ouvrir le panier (${totalItems} articles)`}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer relative shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">PANIER | طلبات</span>
              <span className="text-[10px] bg-[#C5A880] text-[#0B2D23] px-1.5 py-0.2 rounded-full font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Smooth Top Search Bar Dropdown */}
      <TopSearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 3. Luxury Full-Height Mobile Navigation (Exact Screenshot Design) */}
      {/* Dark backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Container translating from LEFT */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[380px] sm:max-w-[420px] bg-[#071F18] text-[#FAF7F2] border-r border-[#C5A880]/20 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-out lg:hidden overflow-hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background Portrait Image with Deep Emerald Noir Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
            alt="Maison MÉRAF Luxury Diamond Jewelry"
            fill
            sizes="420px"
            className="object-cover object-center grayscale contrast-125 brightness-50"
            priority
          />
          {/* Deep emerald green gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071F18]/95 via-[#0B2D23]/88 to-[#04140F]/96" />
        </div>

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fermer le menu"
          className="absolute top-5 right-5 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#0B2D23] backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FAF7F2] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header: Brand Tagline */}
        <div className="relative z-10 pt-12 sm:pt-14 px-6 text-center space-y-1 select-none">
          <p className="text-[10px] tracking-[0.35em] text-[#C5A880] uppercase font-semibold">
            JEWELRY ONLY
          </p>
          <h3 className="font-serif text-xs tracking-[0.3em] text-[#FAF7F2]/90 uppercase font-light">
            UNIVERSE DIAMOND
          </h3>
        </div>

        {/* Center: Simple Navigation Links */}
        <nav className="relative z-10 flex flex-col items-center justify-center space-y-7 sm:space-y-8 my-auto py-6 select-none">
          <Link
            href="/collections?category=khowatem"
            onClick={() => setMobileMenuOpen(false)}
            className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#FAF7F2] hover:text-[#C5A880] transition-all hover:scale-105 active:scale-95"
          >
            RINGS
          </Link>

          <Link
            href="/collections?category=slasel"
            onClick={() => setMobileMenuOpen(false)}
            className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#FAF7F2] hover:text-[#C5A880] transition-all hover:scale-105 active:scale-95"
          >
            NECKLACES
          </Link>

          <Link
            href="/collections?category=khwarsi"
            onClick={() => setMobileMenuOpen(false)}
            className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#FAF7F2] hover:text-[#C5A880] transition-all hover:scale-105 active:scale-95"
          >
            EARRINGS
          </Link>

          <Link
            href="/collections?category=dmalj"
            onClick={() => setMobileMenuOpen(false)}
            className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#FAF7F2] hover:text-[#C5A880] transition-all hover:scale-105 active:scale-95"
          >
            BRACELETS
          </Link>

          <Link
            href="/collections"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#C5A880]/70 hover:text-[#C5A880] transition-colors pt-2"
          >
            ✦ TOUTES LES CRÉATIONS ✦
          </Link>
        </nav>

        {/* Bottom Section: All Social Links + Get Started Button */}
        <div className="relative z-10 p-6 space-y-4">
          {/* All Social Links in Emerald & Gold */}
          <div className="space-y-2 text-center">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#DFCCA8]/70 font-medium">
              Suivez-nous • Social
            </span>
            <div className="flex items-center justify-center gap-2.5">
              <a
                href={BRAND_SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                href={BRAND_SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a
                href={BRAND_GMAIL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <TikTokLogo className="h-4 w-4" />
              </a>

              <a
                href={BRAND_SOCIALS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <WhatsAppLogo className="h-4 w-4" />
              </a>

              <a
                href={BRAND_SOCIALS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>

              <a
                href={BRAND_SOCIALS.gmail}
                aria-label="Email"
                title="Email"
                className="h-9 w-9 rounded-full bg-[#0B2D23]/80 hover:bg-[#C5A880] hover:text-[#0B2D23] border border-[#C5A880]/30 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] transition-all active:scale-90"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Bottom Pill "Get Started" Button in Emerald & Gold */}
          <Link
            href="/collections"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full relative flex items-center justify-center rounded-full bg-[#0B2D23] hover:bg-[#14493a] border border-[#C5A880] text-[#FAF7F2] py-3.5 px-5 font-semibold text-sm tracking-wide shadow-lg active:scale-98 transition-all group overflow-hidden"
          >
            {/* Gold circle with » double arrow icon on the left */}
            <span className="absolute left-2.5 h-8 w-8 rounded-full bg-[#C5A880] group-hover:bg-[#dfcca8] text-[#0B2D23] flex items-center justify-center text-xs font-bold shadow-xs transition-colors">
              »
            </span>
            <span>Get Started</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
