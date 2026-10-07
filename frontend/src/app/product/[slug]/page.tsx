import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/storefront-data";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { CodOrderForm } from "@/components/cod-order-form";
import { UrgencyTimer } from "@/components/storefront/urgency-timer";
import { ReviewsSection } from "@/components/storefront/reviews-section";
import { StickyMobileCta } from "@/components/storefront/sticky-mobile-cta";
import { ProductCard } from "@/components/storefront/product-card";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Produit Introuvable | Maison MÉRAF",
    };
  }

  return {
    title: `${product.title} - ${product.priceMAD} DH | Maison MÉRAF (Paiement à la Livraison)`,
    description: `${product.shortDescription} Livraison gratuite partout au Maroc sous 24/48h. Paiement à la réception après ouverture du colis.`,
    openGraph: {
      title: `${product.title} - ${product.priceMAD} DH`,
      description: product.shortDescription,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  const products = getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const discountPercent = Math.round(
    ((product.compareAtPriceMAD - product.priceMAD) / product.compareAtPriceMAD) * 100
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 pb-24 sm:pb-12 space-y-10 sm:space-y-14">
      {/* Barre d'action sticky mobile sur smartphone */}
      <StickyMobileCta product={product} />

      {/* Fil d'Ariane (Breadcrumbs) */}
      <nav className="flex items-center gap-1.5 text-xs text-[#18221D]/60 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#0B2D23] transition-colors">
          Accueil
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-[#C5A880]" />
        <Link
          href={`/collections?category=${product.category.toLowerCase()}`}
          className="hover:text-[#0B2D23] transition-colors uppercase font-medium text-[#0B2D23]"
        >
          {product.categoryLabel || product.category}
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-[#C5A880]" />
        <span className="text-[#18221D] font-medium truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* Zone Principale : Galerie Photo + Détails & Formulaire COD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Colonne Gauche : Galerie Photo Mobile Swipeable & Points Forts */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={product.badge}
          />

          {/* Points Forts Inaltérables (Acier 316L, 100% Waterproof) */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 space-y-3 shadow-xs">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[#0B2D23] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C5A880]" />
              <span>Pourquoi cette création est unique ?</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {product.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#18221D]/75">
                  <CheckCircle2 className="h-4 w-4 text-[#0B2D23] shrink-0 mt-0.5" />
                  <span className="leading-tight">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Titre, Prix, Compte à Rebours & Formulaire Direct COD */}
        <div className="lg:col-span-6 space-y-5">
          {/* En-tête Titre & Étoiles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="rounded-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0B2D23]">
                {product.categoryLabel || product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#9F8259] font-medium bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8E2D8]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C5A880] text-[#C5A880]" />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="text-[#18221D]/50">({product.reviewsCount} avis vérifiés)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#0B2D23] tracking-tight leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Prix en DH & Économie */}
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#18221D]/60 font-medium">Prix Joaillerie :</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2D23]">
                  {product.priceMAD} DH
                </span>
                <span className="text-base text-[#18221D]/40 line-through">
                  {product.compareAtPriceMAD} DH
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="rounded-full bg-[#0B2D23] px-3 py-1 text-xs font-bold text-[#FAF7F2] shadow-xs">
                -{discountPercent}% Aujourd&apos;hui
              </span>
              <p className="text-[11px] font-semibold text-[#0B2D23] mt-1">
                🚚 Livraison GRATUITE
              </p>
            </div>
          </div>

          {/* Compte à rebours d'urgence et stock restant */}
          <UrgencyTimer
            initialMinutes={38}
            stockLeft={product.stock}
            city="votre ville"
          />

          {/* Formulaire de Commande COD Express (1-Click Checkout) */}
          <CodOrderForm product={product} />
        </div>
      </div>

      {/* Section Avis Clientes Réelles du Produit */}
      <section className="pt-8 border-t border-[#E8E2D8]">
        <ReviewsSection
          reviews={product.reviews}
          averageRating={product.rating}
          totalReviews={product.reviewsCount}
        />
      </section>

      {/* Produits Similaires Recommandés */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-[#E8E2D8] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#0B2D23]">
              Vous aimerez aussi
            </h3>
            <Link
              href="/#top-produits"
              className="text-xs font-semibold tracking-wider uppercase text-[#0B2D23] hover:text-[#C5A880] flex items-center gap-1"
            >
              <span>Voir toute la collection</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
