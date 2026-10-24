import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/storefront-data";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductOrderSection } from "@/components/storefront/product-order-section";
import { ReviewsSection } from "@/components/storefront/reviews-section";
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

export const dynamicParams = true;

export function generateStaticParams() {
  const products = getProducts();
  const params: { slug: string }[] = [];
  products.forEach((p) => {
    if (p.slug) params.push({ slug: p.slug });
    if (p.id && p.id !== p.slug) params.push({ slug: p.id });
  });
  return params;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getProducts();
  const sameNicheProducts = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const relatedProducts = (
    sameNicheProducts.length >= 2
      ? sameNicheProducts
      : allProducts.filter((p) => p.id !== product.id)
  ).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 pb-24 sm:pb-12 space-y-10 sm:space-y-14 max-w-6xl">
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

      {/* Zone Principale : Galerie Photo + Détails Commande */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Colonne Gauche : Galerie Photo */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={product.badge}
            productId={product.id}
          />
        </div>

        {/* Colonne Droite : Titre -> Description courte -> Prix (before & after) -> Stars -> [- 1 +] & Commander -> Ajouter au Panier -> Contact WhatsApp */}
        <div className="lg:col-span-7">
          <ProductOrderSection product={product} />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
