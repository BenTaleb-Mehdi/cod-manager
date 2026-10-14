import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageCircle,
  Gem,
  Award,
  Clock,
  Plus,
  Compass,
  Star,
} from "lucide-react";
import { getProducts, getCategories, buildWhatsAppOrderLink } from "@/lib/storefront-data";
import { ProductCard } from "@/components/storefront/product-card";
import { ReviewsSection } from "@/components/storefront/reviews-section";
import { NewsletterForm } from "@/components/storefront/newsletter-form";

export default function StorefrontHomePage() {
  const products = getProducts();
  const categories = getCategories();
  const allReviews = products.flatMap((p) => p.reviews);
  const whatsappUrl = buildWhatsAppOrderLink({});

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#FAF7F2] text-[#18221D]">
      {/* 1. HERO SECTION (Split layout matching reference photo) */}
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-3 sm:pt-10 pb-6 sm:pb-16 border-b border-[#E8E2D8]">
        {/* Subtle decorative gold curves in background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 200 C 300 100, 600 400, 1500 150" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M100 500 C 400 350, 900 550, 1600 300" stroke="#E8E2D8" strokeWidth="1.5" />
          </svg>
        </div>

        {/* MOBILE HERO & NEW ARRIVALS (Exact Style from User Reference Mockup Screen 1) */}
        <div className="block lg:hidden px-3 sm:px-4 relative z-10 space-y-6">
          {/* Main Hero Card with Overlaid Bottom Bar (Exact Reference Screen 1) */}
          <div className="relative w-full rounded-[28px] overflow-hidden shadow-2xl border border-[#C5A880]/30 bg-[#0B2D23]">
            <div className="relative h-[430px] sm:h-[480px] w-full">
              <Image
                src="/images/meraf/hero-dark-emerald.jpg"
                alt="MÉRAF Fine Jewelry - The Eclipse Collection"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-[center_18%]"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/35 pointer-events-none" />

              {/* Minimalist Top Left Back/Collection Button (Matching Mockup Screen 1) */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <Link
                  href="/collections"
                  aria-label="Retour aux collections"
                  className="h-8 w-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all shadow-md"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              {/* Top Right Certified Luxury Badge */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="bg-black/45 backdrop-blur-md border border-[#C5A880]/40 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#DFCCA8] flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-2.5 w-2.5 text-[#C5A880]" />
                  ACIER INOXYDABLE HAUTE QUALITÉ
                </span>
              </div>

              {/* Overlaid Bottom Action Bar (Identique au mockup "THE ECLIPSE COLLECTION" + Pill "Shop Now") */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
                <div className="flex items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[9px] tracking-[0.25em] font-bold text-[#C5A880] uppercase">
                      MÉRAF ACCESSOIRES
                    </p>
                    <h2 className="font-serif text-base sm:text-lg font-light tracking-[0.16em] text-white uppercase leading-tight">
                      BIJOUX INOXYDABLES<br />POUR FEMMES & FILLES
                    </h2>
                  </div>

                  <Link
                    href="/collections"
                    className="shrink-0 rounded-full bg-[#18392B] hover:bg-[#224E3B] border border-white/20 text-[#FAF7F2] font-semibold text-xs tracking-wider px-4 py-2.5 shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* "New Arrivals" Section (Horizontal Scroll Carousel matching Mockup Screen 1) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#18221D] tracking-tight">
                  New Arrivals
                </h3>
                <p className="text-[11px] text-[#18221D]/60 font-sans">
                  Nos dernières créations raffinées
                </p>
              </div>
              <Link
                href="/collections"
                className="text-xs font-semibold tracking-wider text-[#0B2D23] hover:text-[#C5A880] transition-colors flex items-center gap-0.5"
              >
                <span>Voir tout</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Horizontal Scrollable Carousel (Mockup Screen 1) */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-none snap-x snap-mandatory">
              {products.map((product) => (
                <Link
                  key={`new-arrival-${product.id}`}
                  href={`/product/${product.slug}`}
                  className="w-[145px] shrink-0 snap-start group rounded-2xl border border-[#E8E4DC] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Square Image container with soft neutral background */}
                  <div className="relative aspect-square w-full bg-[#F6F5F2] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/95 backdrop-blur-xs border border-[#E8E2D8] flex items-center justify-center text-[#18221D]/70 shadow-2xs">
                      <Heart className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="p-2.5 space-y-0.5">
                    <p className="font-serif text-[11px] font-medium text-[#18221D] truncate group-hover:text-[#0B2D23] transition-colors">
                      {product.title}
                    </p>
                    <p className="text-xs font-bold font-serif text-[#0B2D23]">
                      {product.priceMAD} DH
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Micro Trust Strip (Paiement à la livraison, Livr 24/48h, Anti-rouille) */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-[#0B2D23] font-medium text-center">
            <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl py-2 px-1 flex flex-col items-center justify-center gap-0.5 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0B2D23]" />
              <span className="leading-tight">Ouvrez avant de payer</span>
            </div>
            <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl py-2 px-1 flex flex-col items-center justify-center gap-0.5 shadow-2xs">
              <Truck className="h-3.5 w-3.5 text-[#0B2D23]" />
              <span className="leading-tight">Livraison 24/48h</span>
            </div>
            <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl py-2 px-1 flex flex-col items-center justify-center gap-0.5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
              <span className="leading-tight">100% Anti-Rouille</span>
            </div>
          </div>

          {/* WhatsApp Direct Order Button */}
          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#0B2D23]/30 bg-white hover:bg-[#FAF7F2] py-2.5 px-4 text-xs font-semibold tracking-wider uppercase text-[#0B2D23] transition-colors shadow-2xs"
            >
              <MessageCircle className="h-4 w-4 text-[#0B2D23]" />
              <span>Commander directement par WhatsApp</span>
            </a>
          </div>
        </div>

        {/* DESKTOP HERO (Exclusively rendered on lg screens) */}
        <div className="hidden lg:block container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Desktop Left Column */}
            <div className="col-span-6 space-y-6 max-w-xl">
              <span className="text-xs font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                TIMELESS ELEGANCE, MODERN YOU.
              </span>

              <h1 className="font-serif text-6xl xl:text-7xl font-normal text-[#0B2D23] leading-[1.08] tracking-tight">
                Jewelry That <br />
                <span className="italic font-light">Tells Your Story</span>
              </h1>

              <p className="text-base text-[#18221D]/75 leading-relaxed font-sans max-w-lg">
                Des accessoires et bijoux tendance en <strong>Acier Inoxydable 316L haute qualité</strong> pour femmes et jeunes filles.
                Finition dorée inaltérable, 100% résistant à l&apos;eau et qui ne noircit jamais.
                Commandez en toute sérénité avec le <strong>Paiement à la Livraison après inspection</strong>.
              </p>

              {/* 3 Reassurance pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#0B2D23]/80 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-[#F4EFEA] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0B2D23]" /> Vérifiez avant de payer
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F4EFEA] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  <Truck className="h-3.5 w-3.5 text-[#0B2D23]" /> Livraison Gratuite 24/48h
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F4EFEA] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" /> Garanti 100% Anti-Rouille
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/collections"
                  className="rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-8 py-4 font-semibold text-sm tracking-[0.15em] uppercase shadow-lg shadow-[#0B2D23]/15 transition-all text-center flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>SHOP THE COLLECTION</span>
                  <ArrowRight className="h-4 w-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#0B2D23]/30 bg-transparent hover:bg-[#F4EFEA] px-6 py-4 text-[#0B2D23] font-semibold text-sm tracking-[0.12em] uppercase transition-colors text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-[#0B2D23]" />
                  <span>COMMANDER SUR WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Desktop Right Column: Hero Visual with Arch Frame & Circular Medallion */}
            <div className="col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute top-0 right-0 bottom-0 w-2/5 bg-[#0B2D23] rounded-3xl -z-1 overflow-hidden shadow-2xl">
                  <div className="absolute top-10 right-4 w-28 h-28 rounded-full border border-[#C5A880]/50 flex items-center justify-center text-center p-2">
                    <div className="text-[7.5px] uppercase tracking-widest text-[#C5A880] font-semibold flex flex-col items-center">
                      <Sparkles className="h-3.5 w-3.5 mb-1 text-[#C5A880]" />
                      <span>TIMELESS</span>
                      <span className="text-[6px] text-white/70">BEAUTY</span>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[4/5] w-4/5 rounded-t-[140px] rounded-b-2xl overflow-hidden border-2 border-[#E8E2D8] shadow-2xl bg-[#FAF7F2]">
                  <Image
                    src="/images/meraf/hero-dark-emerald.jpg"
                    alt="MÉRAF Fine Jewelry - Emerald & Gold Collection"
                    fill
                    sizes="(max-width: 1200px) 50vw, 480px"
                    priority
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute -bottom-4 right-10 bg-[#FAF7F2] border-2 border-[#C5A880] rounded-full p-2.5 shadow-xl flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#0B2D23] flex items-center justify-center text-[#C5A880]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-[#0B2D23]">
                      MÉRAF JEWELRY
                    </p>
                    <p className="text-[8px] text-[#A8875A] font-medium tracking-wider">
                      OR 18K & ACIER 316L
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS (4 Arch-topped Cards matching reference image) */}
      <section id="collections" className="container mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            CURATED FOR YOU
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#0B2D23] tracking-tight">
            Featured Collections
          </h2>
        </div>

        {/* 4 Arch Cards: NECKLACES, RINGS, BRACELETS, EARRINGS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className="group relative flex flex-col rounded-t-[70px] sm:rounded-t-[90px] rounded-b-xl overflow-hidden border border-[#E8E2D8] bg-[#FAF7F2] shadow-sm hover:shadow-xl hover:border-[#C5A880] transition-all duration-300"
            >
              {/* Arch Photo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFEA]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Bottom Deep Emerald Bar with Title + '+' Icon */}
              <div className="bg-[#0B2D23] group-hover:bg-[#154738] text-[#FAF7F2] py-3.5 px-4 flex items-center justify-between transition-colors">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase font-sans">
                  {cat.name}
                </span>
                <Plus className="h-3.5 w-3.5 text-[#C5A880] group-hover:rotate-90 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION (Clean luxury product grid with DH pricing) */}
      <section id="top-produits" className="container mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E2D8] pb-5">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
              MOST LOVED
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#0B2D23] tracking-tight mt-1">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/collections"
            className="text-xs font-semibold tracking-[0.15em] uppercase text-[#0B2D23] hover:text-[#C5A880] transition-colors flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid (2-column on mobile matching mockup) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} id={`category-${product.category.toLowerCase()}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. "THE ART OF FINE CRAFTSMANSHIP" (Iconic split banner from reference photo) */}
      <section id="craftsmanship" className="container mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="rounded-3xl bg-[#0B2D23] text-[#FAF7F2] overflow-hidden shadow-2xl relative">
          {/* Subtle curved hairline contours */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
              <path d="M0 300 C 300 150, 600 450, 1000 200" stroke="#C5A880" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content (Text & Features) */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-6 relative z-10">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                CRAFTED WITH PURPOSE
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight tracking-tight">
                The Art of Fine <br />
                <span className="italic font-light text-[#E2D3BE]">Craftsmanship</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-md">
                Every piece is thoughtfully designed and meticulously crafted by skilled artisans using ethically sourced materials. Our commitment to quality ensures jewelry that lasts a lifetime—and beyond.
              </p>

              {/* 3 Value Pillars (Line art & labels matching reference) */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#C5A880]/20">
                <div className="space-y-1.5">
                  <div className="h-8 w-8 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                    <Gem className="h-4 w-4" />
                  </div>
                  <h4 className="text-[10px] font-bold tracking-wider uppercase text-white">
                    ETHICALLY SOURCED
                  </h4>
                  <p className="text-[9px] text-zinc-400">Acier chirurgical 316L</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-8 w-8 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="text-[10px] font-bold tracking-wider uppercase text-white">
                    EXPERT CRAFTSMANSHIP
                  </h4>
                  <p className="text-[9px] text-zinc-400">Finition Or 18K Miroir</p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-8 w-8 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-[10px] font-bold tracking-wider uppercase text-white">
                    TIMELESS QUALITY
                  </h4>
                  <p className="text-[9px] text-zinc-400">100% Anti-Rouille</p>
                </div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <Link
                  href="#faq"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2D23] px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#FAF7F2] transition-colors"
                >
                  <span>LEARN OUR STORY</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Artisan Image with Overlapping Circular Medallion */}
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-full min-h-[380px] overflow-hidden">
              <Image
                src="/images/lumiere/artisan-craft.jpg"
                alt="Jeweler Artisan Craftsmanship at Workbench"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B2D23] via-transparent to-transparent lg:block hidden" />

              {/* Center Circular Medallion: HAND CRAFTED WITH PASSION */}
              <div className="absolute bottom-6 left-6 lg:-left-10 lg:top-1/2 lg:-translate-y-1/2 z-20">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FAF7F2] border-2 border-[#C5A880] p-1.5 shadow-2xl flex flex-col items-center justify-center text-center">
                  <Sparkles className="h-4 w-4 text-[#A8875A] mb-0.5" />
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-[#0B2D23] leading-tight">
                    HAND CRAFTED
                  </span>
                  <span className="text-[7px] text-[#A8875A] tracking-widest uppercase">
                    WITH PASSION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "WHAT OUR CUSTOMERS SAY" (Testimonials Section) */}
      <section id="avis" className="container mx-auto px-4 sm:px-6 scroll-mt-24">
        <ReviewsSection reviews={allReviews} />
      </section>

      {/* 6. "GIFT GUIDE" & "JOIN OUR COMMUNITY" DUAL BANNER (Exact layout from reference) */}
      <section id="gift-guide" className="container mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-xl">
          {/* Left Box: Gift Guide (Warm Cream `#F3EFEA`) */}
          <div className="lg:col-span-6 bg-[#F4EFEA] p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative aspect-square w-40 sm:w-48 shrink-0 rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-md">
              <Image
                src="/images/lumiere/gift-guide.jpg"
                alt="Lumière Luxury Gift Box Packaging"
                fill
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                THE PERFECT GIFT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0B2D23]">
                Gift Guide
              </h3>
              <p className="text-xs text-[#18221D]/70 leading-relaxed max-w-xs">
                From birthdays to anniversaries, find the perfect piece for every celebration. Écrin de luxe offert.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections"
                  className="text-xs font-bold tracking-[0.15em] uppercase text-[#0B2D23] hover:text-[#C5A880] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>EXPLORE GIFT GUIDE</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Box: Join Our Community (Deep Emerald Green `#0B2D23`) */}
          <div className="lg:col-span-6 bg-[#0B2D23] text-[#FAF7F2] p-8 sm:p-10 flex flex-col justify-center space-y-4">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
              STAY CONNECTED
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Join Our Community
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
              Be the first to know about new arrivals, exclusive offers, and special events.
            </p>

            {/* Email form + Gold Subscribe Button */}
            <NewsletterForm />

            {/* 3 Perks below */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium tracking-wider text-[#DFCCA8]/80 pt-1">
              <span>✦ EXCLUSIVE OFFERS</span>
              <span>✦ NEW ARRIVALS</span>
              <span>✦ STYLE INSPIRATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION (Moroccan COD Reassurance) */}
      <section id="faq" className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            QUESTIONS FRÉQUENTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#0B2D23] tracking-tight">
            Tout savoir sur le Paiement à la Livraison
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 shadow-xs space-y-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#0B2D23] flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#0B2D23] shrink-0" />
              <span>Puis-je ouvrir et inspecter le colis avant de payer ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed pl-6">
              <strong>OUI, ABSOLUMENT !</strong> C&apos;est la garantie d&apos;or Maison MÉRAF. Le livreur attend que vous ouvriez le coffret pour vérifier votre bijou. Vous ne réglez le montant que lorsque vous êtes 100% satisfaite.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 shadow-xs space-y-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#0B2D23] flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-[#0B2D23] shrink-0" />
              <span>Combien de temps prend la livraison ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed pl-6">
              Livraison sous <strong>24h</strong> pour Casablanca, Rabat, Salé, Mohammedia, Kénitra. Et sous <strong>24h à 48h</strong> pour Marrakech, Fès, Tanger, Agadir, Oujda, Meknès et toutes les villes du Maroc.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 shadow-xs space-y-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#0B2D23] flex items-center gap-2.5">
              <Truck className="h-4 w-4 text-[#0B2D23] shrink-0" />
              <span>Combien coûte la livraison ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed pl-6">
              La livraison est <strong>100% GRATUITE</strong> (0 DH) pour toute commande passée sur notre site, peu importe votre adresse ou ville au Maroc.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 shadow-xs space-y-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#0B2D23] flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-[#C5A880] shrink-0" />
              <span>Est-ce du vrai or ? Et est-ce que le bijou change de couleur ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed pl-6">
              Nos accessoires sont conçus en <strong>Acier Inoxydable 316L de haute qualité avec finition dorée inaltérable</strong> (ce n&apos;est pas de l&apos;or massif, mais un acier inoxydable premium). L&apos;avantage ? Il <strong>ne noircit jamais, ne rouille pas et résiste à 100% à l&apos;eau</strong> (douche, mer, parfums) avec l&apos;éclat du vrai or à un prix accessible pour femmes et filles !
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
