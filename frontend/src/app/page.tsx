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
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-6 sm:pt-10 pb-8 sm:pb-16 border-b border-[#E8E2D8]">
        {/* Subtle decorative gold curves in background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 200 C 300 100, 600 400, 1500 150" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M100 500 C 400 350, 900 550, 1600 300" stroke="#E8E2D8" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 max-w-xl">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                TIMELESS ELEGANCE, MODERN YOU.
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#0B2D23] leading-[1.08] tracking-tight">
                Jewelry That <br />
                <span className="italic font-light">Tells Your Story</span>
              </h1>

              <p className="text-sm sm:text-base text-[#18221D]/75 leading-relaxed font-sans max-w-lg">
                Exquisite designs, ethically crafted to celebrate every moment that matters.
                Créations en <strong>Acier Inoxydable 316L certifié</strong> et or 18k inaltérable.
                Commandez en toute confiance avec le <strong>Paiement à la Livraison</strong>.
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/collections"
                  className="rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-8 py-4 font-semibold text-xs sm:text-sm tracking-[0.15em] uppercase shadow-lg shadow-[#0B2D23]/15 transition-all text-center flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>SHOP THE COLLECTION</span>
                  <ArrowRight className="h-4 w-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#0B2D23]/30 bg-transparent hover:bg-[#F4EFEA] px-6 py-4 text-[#0B2D23] font-semibold text-xs sm:text-sm tracking-[0.12em] uppercase transition-colors text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-[#0B2D23]" />
                  <span>COMMANDER SUR WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual with Arch Frame & Circular Medallion */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              {/* Emerald Green background panel card */}
              <div className="relative w-full max-w-[480px]">
                {/* Emerald accent panel on right (matching reference) */}
                <div className="absolute top-0 right-0 bottom-0 w-2/5 bg-[#0B2D23] rounded-3xl -z-1 hidden sm:block overflow-hidden shadow-2xl">
                  {/* Circular Gold Seal Stamp */}
                  <div className="absolute top-10 right-4 w-28 h-28 rounded-full border border-[#C5A880]/50 flex items-center justify-center text-center p-2">
                    <div className="text-[7.5px] uppercase tracking-widest text-[#C5A880] font-semibold flex flex-col items-center">
                      <Sparkles className="h-3.5 w-3.5 mb-1 text-[#C5A880]" />
                      <span>TIMELESS</span>
                      <span className="text-[6px] text-white/70">BEAUTY</span>
                    </div>
                  </div>
                </div>

                {/* Main Arched Photo Container (matching reference image) */}
                <div className="relative aspect-[4/5] sm:w-4/5 rounded-t-[140px] rounded-b-2xl overflow-hidden border-2 border-[#E8E2D8] shadow-2xl bg-[#FAF7F2]">
                  <Image
                    src="/images/lumiere/hero-jewelry.jpg"
                    alt="Lumière Fine Jewelry - Emerald & Gold Collection"
                    fill
                    priority
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlapping Floating Seal Badge (Bottom Right) */}
                <div className="absolute -bottom-4 right-4 sm:right-10 bg-[#FAF7F2] border-2 border-[#C5A880] rounded-full p-2.5 shadow-xl flex items-center gap-2">
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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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
              <span>Est-ce que l&apos;acier inoxydable 316L change de couleur ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed pl-6">
              Non ! Notre acier chirurgical 316L avec placage or 18k sous vide est inaltérable. Il ne noircit jamais, ne rouille pas et résiste parfaitement aux parfums, crèmes et bains.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
