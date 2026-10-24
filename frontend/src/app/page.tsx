import React from "react";
import Image from "next/image";
import Link from "next/link";
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
      
     
      {/* 1. HERO SECTION (Style Editorial Vogue : Minimalist High-End Jewelry) */}
     {/* 1. HERO SECTION (Clean Luxury • High Fashion Editorial) */}
      <section className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center bg-[#FAF9F6] border border-[#EBE8E1] rounded-2xl p-6 sm:p-10 lg:p-12">
          
          {/* Colonne Gauche : Editorial Minimaliste */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0A261E] font-medium block">
                MÉRAF Joaillerie • Tanger
              </span>
              
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111] font-normal leading-[1.1] tracking-tight">
                L’éclat durable de l’acier pur.
              </h1>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-md">
              Des créations dessinées pour votre quotidien. Acier inoxydable de grade supérieur (316L), résistant à l’eau et inaltérable.
            </p>

            {/* CTAs Clean (Bouton plein mat + Bouton outline sobre) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/collections"
                className="bg-[#0A261E] hover:bg-[#133D31] text-white text-xs sm:text-sm font-medium uppercase tracking-widest px-8 py-3.5 rounded-none text-center transition-colors"
              >
                Découvrir la collection
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#0A261E] text-[#0A261E] hover:bg-[#0A261E] hover:text-white text-xs sm:text-sm font-medium uppercase tracking-widest px-6 py-3.5 rounded-none text-center transition-colors"
              >
                Commander via WhatsApp
              </a>
            </div>

            {/* Reassurance Sobre & Réelle */}
            <div className="pt-6 border-t border-[#E5E2D9] grid grid-cols-2 gap-4 text-[11px] text-stone-600">
              <div>
                <p className="font-medium text-stone-900">Livraison Tanger 24h</p>
                <p className="text-[10px] text-stone-500">Paiement à la réception (COD)</p>
              </div>
              <div>
                <p className="font-medium text-stone-900">Qualité Grade 316L</p>
                <p className="text-[10px] text-stone-500">Ne ternit pas au contact de l’eau</p>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Image Pro, visible directement sur Mobile */}
          {/* Colonne Droite : Direction Artistique Joaillerie (Clean Luxury) */}
      {/* Colonne Droite : Image Edge-to-Edge (Plein Espace) */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full">
            <div className="relative aspect-[3/4] sm:aspect-[5/3] lg:aspect-[5/4] w-full overflow-hidden rounded-xl border border-[#E8E4DA] shadow-sm bg-[#F2EFE9]">
              <Image
                src="/images/meraf/hero-dark-emerald.jpg"
                alt="Bijoux MÉRAF Tanger"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {/* Tag discret incrusté directement sur la photo */}
              <div className="absolute bottom-3 left-3 bg-[#0A261E]/90 backdrop-blur-xs text-[#FAF8F5] px-3 py-1.5 rounded-sm border border-white/10 text-[10px] tracking-widest uppercase">
                Ref. Parure Royale • Tanger
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