"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

function XLogo({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function StorefrontHeader() {
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        {/* 1. Deep Emerald Green Announcement Bar */}
        <div className="bg-[#0B2D23] text-[#FAF7F2] py-2 px-4 text-[11px] sm:text-xs tracking-wider text-center font-medium">
          <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[#C5A880]">✦</span>
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px]">
              LIVRAISON GRATUITE PARTOUT AU MAROC • PAIEMENT À LA LIVRAISON (COD)
            </span>
            <span className="text-[#C5A880]">✦</span>
            <span className="hidden md:inline text-[#DFCCA8]/70 text-[10px] font-sans">
              (الدفع بعد معاينة وفتح الطرد)
            </span>
          </div>
        </div>

        {/* 2. Main Luxury Header */}
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Desktop Navigation Links */}
          <div className="flex items-center gap-4 lg:w-1/3">
            {/* Mobile Hamburger Button with Smooth Icon Animation */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden p-2 rounded-xl text-[#0B2D23] hover:bg-[#F3EFEA] active:scale-95 transition-all"
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
                        <span>Nos Catégories Joaillières</span>
                        <span className="text-[9px] text-[#0B2D23]/50">Or 18K • 316L</span>
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
          <div className="flex justify-center items-center lg:w-1/3 text-center">
            <Link href="/" className="flex flex-col items-center group py-0.5">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] uppercase text-[#0B2D23] font-normal leading-none group-hover:opacity-90 transition-opacity">
                {BRAND_NAME}
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#9F8259] font-medium uppercase mt-1">
                {BRAND_SUBTITLE}
              </span>
            </Link>
          </div>

          {/* Right: Search, Account, Wishlist, Cart Actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 lg:w-1/3 text-[#18221D]/80">
            {/* Search Trigger */}
            <Link
              href="/collections"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
              title="Rechercher un bijou"
            >
              <Search className="h-3.5 w-3.5 text-[#18221D]" />
              <span className="hidden xl:inline">RECHERCHE</span>
            </Link>

            {/* WhatsApp Concierge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
              title="Conseillère joaillère disponible sur WhatsApp"
            >
              <User className="h-3.5 w-3.5 text-[#18221D]" />
              <span className="hidden xl:inline">CONSEILLÈRE</span>
            </a>

            {/* Quick Wishlist Link */}
            <Link
              href="/collections"
              className="hidden sm:flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
              title="Favoris"
            >
              <Heart className="h-3.5 w-3.5 text-[#18221D]" />
            </Link>

            {/* Cart / Direct Checkout Trigger */}
            <button
              onClick={openCart}
              aria-label={`Ouvrir le panier (${totalItems} articles)`}
              className="flex items-center gap-2 rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer relative"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">PANIER</span>
              <span className="text-[10px] bg-[#C5A880] text-[#0B2D23] px-1.5 py-0.2 rounded-full font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Modern Mobile Slide-in Drawer (Translating from LEFT) */}
      {/* Dark backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Container translating from LEFT */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[340px] bg-[#FAF7F2] border-r border-[#E8E2D8] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-white shrink-0">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex flex-col"
          >
            <span className="font-serif text-xl tracking-[0.25em] text-[#0B2D23] uppercase font-bold leading-tight">
              {BRAND_NAME}
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#9F8259] uppercase font-semibold">
              {BRAND_SUBTITLE}
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
            className="p-2 rounded-full text-[#18221D] hover:bg-[#FAF7F2] hover:text-[#0B2D23] active:scale-95 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Primary Action & Cart Quick Access */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0B2D23] text-[#FAF7F2] p-3 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-98 transition-all text-center"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>Boutique</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0B2D23] bg-white text-[#0B2D23] p-3 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-98 transition-all text-center cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>Panier ({totalItems})</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[#9F8259] font-bold flex items-center justify-between">
              <span>Nos Bijoux</span>
              <span className="text-[9px] text-[#0B2D23]/60 font-sans">Or 18K & Acier 316L</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/collections?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0B2D23] active:bg-[#FAF7F2] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#0B2D23]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#0B2D23]">
                        {cat.moroccanLabel}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#C5A880]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Pages */}
          <div className="space-y-1 pt-2 border-t border-[#E8E2D8]">
            <div className="text-[10px] uppercase tracking-widest text-[#9F8259] font-bold mb-2">
              Navigation
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] transition-colors"
            >
              <span>Accueil</span>
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] transition-colors"
            >
              <span>Le Journal Joaillier</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-[#18221D] hover:bg-white hover:text-[#0B2D23] transition-colors"
            >
              <span>Contact & Support</span>
            </Link>
          </div>

          {/* Direct WhatsApp Concierge Button */}
          <div className="pt-3 border-t border-[#E8E2D8] space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B2D23] py-3 px-4 text-xs font-semibold text-[#FAF7F2] shadow-sm tracking-wider uppercase active:scale-98 transition-all"
            >
              <MessageCircle className="h-4 w-4 text-[#C5A880]" />
              <span>Conseillère WhatsApp en Direct</span>
            </a>

            {/* Reassurances */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#18221D]/75 bg-white p-3 rounded-xl border border-[#E8E2D8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0B2D23] shrink-0" />
                <span>Ouvrez avant de payer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-[#0B2D23] shrink-0" />
                <span>Livraison 24h/48h</span>
              </div>
            </div>

            {/* Réseaux Sociaux MÉRAF */}
            <div className="pt-2 flex items-center justify-center gap-2.5">
              <a
                href={BRAND_SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @meraf.jewelry"
                title="Instagram"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-white flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Maison MÉRAF"
                title="Facebook"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-white flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) @meraf_jewelry"
                title="X"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-white flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] transition-colors"
              >
                <XLogo className="h-3 w-3" />
              </a>
              <a
                href={BRAND_SOCIALS.gmail}
                aria-label={`Gmail (${BRAND_GMAIL})`}
                title="Gmail"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-white flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
