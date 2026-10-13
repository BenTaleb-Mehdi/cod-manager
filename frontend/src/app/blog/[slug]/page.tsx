import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Calendar,
  Share2,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  getBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blog-data";
import { getProducts } from "@/lib/storefront-data";
import { BRAND_PHONE_WHATSAPP } from "@/lib/storefront-data";
import { ArticleContent } from "@/components/storefront/article-content";
import { ProductCard } from "@/components/storefront/product-card";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article introuvable | Maison MÉRAF",
    };
  }

  return {
    title: `${post.title} | Maison MÉRAF`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, 2);
  const allProducts = getProducts();
  const relatedProducts = allProducts.filter((p) =>
    post.relatedProductSlugs?.includes(p.slug)
  );

  // WhatsApp concierge share message
  const whatsappInquiryUrl = `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(
    `Salam Maison MÉRAF! J'ai lu votre article "${post.title}" et j'aimerais avoir un conseil joaillier personnalisé svp.`
  )}`;

  return (
    <article className="bg-[#FAF7F2] min-h-screen pb-24 text-[#18221D]">
      {/* 1. TOP NAVIGATION & BREADCRUMBS */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <nav className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#18221D]/60 uppercase flex-wrap">
            <Link href="/" className="hover:text-[#0B2D23] transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-[#0B2D23] transition-colors">
              Le Journal
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0B2D23] font-semibold line-clamp-1">
              {post.title}
            </span>
          </nav>
        </div>
      </section>

      {/* 2. ARTICLE HERO HEADER */}
      <header className="container mx-auto px-4 sm:px-6 max-w-4xl pt-8 sm:pt-12 space-y-6">
        <div className="space-y-4 text-center sm:text-left">
          {/* Category & meta */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#0B2D23]">
            <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase shadow-xs">
              {post.category}
            </span>
            <span className="text-[#A8875A]">•</span>
            <span className="flex items-center gap-1.5 text-[#18221D]/70 font-medium">
              <Clock className="h-3.5 w-3.5 text-[#C5A880]" /> {post.readTime}
            </span>
            <span className="text-[#A8875A]">•</span>
            <span className="flex items-center gap-1.5 text-[#18221D]/70 font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#C5A880]" /> {post.publishedAt}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0B2D23] leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-[#18221D]/75 font-sans leading-relaxed pt-1">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#C5A880] shadow-sm">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#0B2D23]">
                {post.author.name}
              </p>
              <p className="text-[10px] text-[#A8875A] font-medium tracking-wide">
                {post.author.role}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-lg bg-[#F4EFEA]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      </header>

      {/* 3. ARTICLE CONTENT */}
      <main className="container mx-auto px-4 sm:px-6 max-w-3xl pt-10 sm:pt-12">
        <div className="bg-[#FDFCF9] border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs space-y-8">
          <ArticleContent content={post.content} />

          {/* Tags */}
          <div className="pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#18221D]/60 uppercase tracking-wider mr-1">
              Thématiques :
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F4EFEA] border border-[#E8E2D8] px-3 py-1 text-[11px] font-medium text-[#0B2D23]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Direct Concierge WhatsApp Action */}
          <div className="rounded-2xl bg-[#0B2D23] text-[#FAF7F2] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-normal text-white flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A880]" />
                <span>Une question sur cet article ?</span>
              </h4>
              <p className="text-xs text-zinc-300">
                Nos conseillères joaillières vous répondent directement sur WhatsApp sous 10 minutes.
              </p>
            </div>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#C5A880] hover:bg-[#B38F4D] text-[#0B2D23] px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Poser une question</span>
            </a>
          </div>
        </div>

        {/* 4. SHOP THE LOOK / PIÈCES ASSOCIÉES */}
        {relatedProducts.length > 0 && (
          <section className="pt-14 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                SÉLECTION JOAILLIÈRE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#0B2D23]">
                Les pièces mentionnées dans l&apos;article
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* 5. RELATED ARTICLES */}
        {relatedPosts.length > 0 && (
          <section className="pt-14 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif text-2xl text-[#0B2D23]">
                À lire également
              </h3>
              <Link
                href="/blog"
                className="text-xs font-bold tracking-wider uppercase text-[#0B2D23] hover:text-[#C5A880] flex items-center gap-1 transition-colors"
              >
                <span>Tous les articles</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] overflow-hidden hover:shadow-md hover:border-[#C5A880] transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4EFEA]">
                    <Image
                      src={rPost.coverImage}
                      alt={rPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#A8875A] tracking-wider uppercase">
                        {rPost.category}
                      </span>
                      <h4 className="font-serif text-base text-[#0B2D23] group-hover:text-[#9F8259] transition-colors font-medium mt-1">
                        {rPost.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-[#0B2D23] flex items-center gap-1 pt-2">
                      Lire le guide <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back button */}
        <div className="pt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#0B2D23]/30 px-6 py-3 text-xs font-bold tracking-wider uppercase text-[#0B2D23] hover:bg-[#F4EFEA] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour au Journal</span>
          </Link>
        </div>
      </main>
    </article>
  );
}
