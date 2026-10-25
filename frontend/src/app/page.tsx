import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INSTAGRAM, BRAND_GMAIL, BRAND_PHONE_WHATSAPP } from "@/lib/storefront-data";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  PackageCheck,
  PhoneCall,
  Clock,
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#11241E] selection:bg-[#C5A880]/30 selection:text-[#0B2D23] pb-20 relative">
      
     
 
     {/* 1. HERO SECTION (Clean Luxury • High Fashion Editorial) */}
<section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
  <div className="max-w-4xl mx-auto text-center space-y-4 mb-8 sm:mb-12">
    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#0A261E] font-semibold bg-[#0A261E]/5 px-4 py-1.5 rounded-full border border-[#0A261E]/10 inline-block">
      MÉRAF Joaillerie • Maison Tanger
    </span>
    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111] font-normal leading-[1.12] tracking-tight">
      L’éclat durable de l’acier pur.
    </h1>
    <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto">
      Des bijoux d’une élégance intemporelle conçus en acier inoxydable 316L. Résistants à l’eau, aux parfums et inaltérables.
    </p>
  </div>

  {/* Main Feature Showcase */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
    <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#E5E2D9] shadow-sm">
      <Image
        src="/images/meraf/collections-hero.jpg"
        alt="Collection MÉRAF Joaillerie"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="object-cover object-center"
      />
    </div>

    {/* Side Call-to-Action & Social Connect Panel */}
    <div className="lg:col-span-4 bg-[#FAF9F6] border border-[#EBE8E1] p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 h-full shadow-xs">
      
      {/* Header & Tagline */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0A261E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A261E] animate-pulse"></span>
          MÉRAF • Communauté & Shop
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111] leading-snug">
          Rejoignez l’univers MÉRAF
        </h2>
        <p className="text-stone-500 text-xs leading-relaxed">
          Suivez nos dernières créations, coulisses et nouveautés en direct sur nos réseaux sociaux.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/collections"
          className="w-full bg-[#0A261E] hover:bg-[#133D31] text-white text-xs font-medium uppercase tracking-[0.2em] py-3.5 rounded-xs text-center block transition-all shadow-xs active:scale-[0.98]"
        >
          Découvrir la collection
        </Link>
        
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-[#0A261E] text-[#0A261E] hover:bg-[#0A261E] hover:text-white text-xs font-medium uppercase tracking-[0.2em] py-3.5 rounded-xs text-center flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          Commander via WhatsApp
        </a>
      </div>

      {/* Social Media Links & Quick Info */}
      <div className="pt-5 border-t border-[#E5E2D9] space-y-4">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500 text-center">
          Suivez-nous & Échangez avec nous
        </p>

        <div className="grid grid-cols-3 gap-2">
          {/* Instagram */}
          <a
            href={BRAND_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-white border border-[#E8E4DA] hover:border-[#0A261E] hover:bg-[#0A261E]/5 transition-all group"
          >
            <svg className="w-5 h-5 text-stone-700 group-hover:text-[#0A261E] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span className="text-[10px] text-stone-600 font-medium mt-1">Instagram</span>
          </a>

          {/* TikTok */}
          <a
            href={BRAND_GMAIL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-white border border-[#E8E4DA] hover:border-[#0A261E] hover:bg-[#0A261E]/5 transition-all group"
          >
            <svg className="w-5 h-5 text-stone-700 group-hover:text-[#0A261E] fill-current transition-colors" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-3.04 1.5-6.04 4.29-7.14 1.11-.45 2.32-.63 3.51-.57v4.11c-.72-.07-1.46.07-2.12.38-.96.44-1.63 1.34-1.75 2.38-.17 1.4.67 2.78 2.01 3.2 1.34.42 2.82-.09 3.57-1.22.46-.68.66-1.52.64-2.33V.02z"/>
            </svg>
            <span className="text-[10px] text-stone-600 font-medium mt-1">TikTok</span>
          </a>

          {/* Direct Contact / Support */}
          <a
            href={`tel:+${BRAND_PHONE_WHATSAPP}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-white border border-[#E8E4DA] hover:border-[#0A261E] hover:bg-[#0A261E]/5 transition-all group"
          >
            <svg className="w-5 h-5 text-stone-700 group-hover:text-[#0A261E] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.112-3.756-6.582-6.582l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="text-[10px] text-stone-600 font-medium mt-1">Contact</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* 2. CATEGORIES SECTION (Smooth Mobile UX) */}
      <section className="container mx-auto px-4 sm:px-6 pt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#0B2A21] tracking-tight">
              Nos Créations
            </h2>
            <p className="text-xs text-stone-500">Sélectionnez la pièce qui sublime votre tenue</p>
          </div>
          <Link
            href="/collections"
            className="text-xs font-semibold text-[#0B2A21] hover:text-[#C5A880] transition-colors uppercase tracking-wider"
          >
            Voir tout →
          </Link>
        </div>

        {/* Scrollable Circles with snap and smooth border */}
        <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 shrink-0 snap-start cursor-pointer text-center"
            >
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-[#EAE5DC] border-2 border-[#D9D1C5] group-hover:border-[#C5A880] group-hover:scale-105 transition-all shadow-2xs">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="80px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#0B2A21] group-hover:text-[#C5A880] transition-colors max-w-[85px] truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section id="top-produits" className="container mx-auto px-4 sm:px-6 pt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#0B2A21] tracking-tight">
              Coups de Cœur & Meilleures Ventes
            </h2>
            <p className="text-xs text-stone-500">Les parures les plus commandées ce mois-ci à Tanger</p>
          </div>
          <Link
            href="/collections"
            className="text-xs font-semibold text-[#0B2A21] hover:text-[#C5A880] transition-colors uppercase tracking-wider"
          >
            Explorer tout →
          </Link>
        </div>

        {/* Grid Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 pt-1">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY & PACKAGING LUXE (L-Farq dyal MÉRAF) */}
      {/* 4. BRAND STORY & L'EXPÉRIENCE MÉRAF (Clean Editorial Luxury) */}
      <section className="container mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-2xl p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Colonne Gauche : L'histoire & Le Packaging */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0A261E] font-medium block">
                L’Expérience MÉRAF
              </span>

              <h3 className="font-serif text-2xl sm:text-4xl text-[#111] font-normal leading-tight tracking-tight">
                Une boîte à bijoux pensée pour émerveiller.
              </h3>

              <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                Chaque création quitte notre atelier tangérois soigneusement disposée dans un écrin en velours vert émeraude, scellé de notre carte de remerciement parfumée. Une expérience prête à offrir — sans aucun emballage supplémentaire.
              </p>

              {/* Piliers discrets sous forme de liste sobre */}
              <div className="pt-2 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0A261E]" />
                  <span>Écrin signature en velours émeraude inclus</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0A261E]" />
                  <span>Carte d’authenticité & mot d’attention personnalisé</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0A261E]" />
                  <span>Paiement à la livraison après ouverture du colis</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Encart Service Express Minimaliste */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#E8E4DA] p-6 sm:p-8 space-y-4">
                <div className="flex items-baseline justify-between border-b border-[#EBE8E1] pb-3">
                  <span className="text-[11px] uppercase tracking-widest text-[#0A261E] font-mono">Service Tanger</span>
                  <span className="text-[10px] text-stone-400 font-mono">Express 24H</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-[#111] font-normal">Livraison en main propre</h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Remise sécurisée à domicile ou sur votre lieu de travail partout à Tanger sous 24h.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-800 border-t border-[#EBE8E1]">
                  <span className="font-medium">Règlement en espèces</span>
                  <span className="text-[11px] text-stone-500">Cash on Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. AVIS CLIENTES RÉELLES */}
      <section className="container mx-auto px-4 sm:px-6 pt-12">
        <ReviewsSection
          reviews={allReviews}
          averageRating={4.9}
          totalReviews={allReviews.length}
        />
      </section>

      {/* 6. NEWSLETTER PRIVILÈGE (-10% Voucher) */}
 

      {/* 7. FLOATING WHATSAPP BUTTON (Crucial E-commerce Maroc COD) */}
     

    </div>
  );
}