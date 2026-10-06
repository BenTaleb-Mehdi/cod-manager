"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { BRAND_NAME, BRAND_SUBTITLE, buildWhatsAppOrderLink, BRAND_PHONE_WHATSAPP } from "@/lib/storefront-data";

export function StorefrontHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const categories = [
    { name: "Necklaces (Slasel)", slug: "slasel", id: "Slasel" },
    { name: "Rings (Khowatem)", slug: "khowatem", id: "Khowatem" },
    { name: "Bracelets (Dmalj)", slug: "dmalj", id: "Dmalj" },
    { name: "Earrings (Khwarsi)", slug: "khwarsi", id: "Khwarsi" },
  ];

  const whatsappUrl = buildWhatsAppOrderLink({});

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
      {/* 1. Deep Emerald Green Announcement Bar (from reference design) */}
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="lg:hidden p-1.5 rounded-lg text-[#0B2D23] hover:bg-[#F3EFEA]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop Left Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#18221D]/80">
            <Link
              href="/collections"
              className="hover:text-[#0B2D23] hover:underline underline-offset-4 decoration-[#C5A880] transition-colors"
            >
              COLLECTIONS
            </Link>

            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown("jewelry")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 hover:text-[#0B2D23] transition-colors uppercase tracking-[0.12em]">
                <span>BIJOUX</span>
                <ChevronDown className="h-3 w-3 opacity-60 group-hover:rotate-180 transition-transform" />
              </button>

              {activeDropdown === "jewelry" && (
                <div className="absolute top-full left-0 w-56 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl shadow-xl p-2.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  <Link
                    href="/collections"
                    className="block px-3 py-2 text-[11px] font-bold tracking-wider text-[#0B2D23] hover:bg-[#F4EFEA] rounded-lg transition-colors border-b border-[#E8E2D8] mb-1"
                  >
                    ✨ Toutes les créations
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collections?category=${cat.slug}`}
                      className="block px-3 py-2 text-[11px] font-medium tracking-wider text-[#18221D] hover:bg-[#F4EFEA] hover:text-[#0B2D23] rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="hover:text-[#0B2D23] hover:underline underline-offset-4 decoration-[#C5A880] transition-colors"
            >
              LE JOURNAL
            </Link>

            <Link
              href="/contact"
              className="hover:text-[#0B2D23] hover:underline underline-offset-4 decoration-[#C5A880] transition-colors"
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Center: Brand Logo "MÉRAF JEWELRY" */}
        <div className="flex justify-center items-center lg:w-1/3 text-center">
          <Link href="/" className="flex flex-col items-center group py-0.5">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] uppercase text-[#0B2D23] font-normal leading-none group-hover:opacity-90 transition-opacity">
              MÉRAF
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#9F8259] font-medium uppercase mt-1">
              JEWELRY
            </span>
          </Link>
        </div>

        {/* Right: Search, Account, Wishlist, Cart Actions */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 lg:w-1/3 text-[#18221D]/80">
          {/* Search Trigger */}
          <Link
            href="/collections"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#18221D]" />
            <span className="hidden xl:inline">SEARCH</span>
          </Link>

          {/* Account / WhatsApp Advisor */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
            title="Conseillère joaillère en ligne"
          >
            <User className="h-3.5 w-3.5 text-[#18221D]" />
            <span className="hidden xl:inline">CONSEILLÈRE</span>
          </a>

          {/* Contact Quick Link */}
          <Link
            href="/contact"
            className="hidden sm:flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase hover:text-[#0B2D23] transition-colors"
            title="Service client"
          >
            <Heart className="h-3.5 w-3.5 text-[#18221D]" />
          </Link>

          {/* Cart / Direct Checkout Trigger */}
          <Link
            href="/collections"
            className="flex items-center gap-2 rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
            <span className="hidden sm:inline">SHOP</span>
            <span className="text-[10px] bg-[#C5A880] text-[#0B2D23] px-1.5 py-0.2 rounded-full font-bold">
              COD
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D8] bg-[#FAF7F2] px-5 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl bg-[#0B2D23] text-[#FAF7F2] p-3 text-xs font-bold uppercase tracking-widest text-center shadow-xs"
            >
              ✨ Toutes les Collections
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-[#E8E2D8] bg-[#F4EFEA] p-2.5 text-xs font-semibold text-[#0B2D23] hover:border-[#0B2D23] transition-colors text-center uppercase tracking-wider"
              >
                Le Journal
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-[#E8E2D8] bg-[#F4EFEA] p-2.5 text-xs font-semibold text-[#0B2D23] hover:border-[#0B2D23] transition-colors text-center uppercase tracking-wider"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-widest text-[#9F8259] font-bold mb-2">
              Par Catégorie
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-[#E8E2D8] bg-[#FDFCF9] p-2.5 text-xs font-medium text-[#0B2D23] hover:border-[#C5A880] transition-colors text-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E2D8] flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0B2D23] py-3 px-4 text-xs font-semibold text-[#FAF7F2] shadow-sm tracking-wider uppercase"
            >
              <MessageCircle className="h-4 w-4 text-[#C5A880]" />
              <span>Assistance Joaillerie WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#18221D]/70 pt-1">
              <span>✦ Paiement à la livraison</span>
              <span>✦ Vérification avant paiement</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
