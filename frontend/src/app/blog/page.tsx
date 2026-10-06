import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, BookOpen } from "lucide-react";
import { getBlogPosts, getBlogCategories } from "@/lib/blog-data";
import { BlogListView } from "@/components/storefront/blog-list-view";
import { NewsletterForm } from "@/components/storefront/newsletter-form";

export const metadata = {
  title: "Le Journal & Conseils Joaillerie | Maison MÉRAF",
  description:
    "Guides d'entretien pour l'acier inoxydable 316L, conseils de style pour le layering de colliers, guide des tailles de bagues et tendances bijoux au Maroc.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const categories = getBlogCategories();

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* 1. HERO HEADER */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-12 sm:py-16 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M-50 200 C 350 80, 750 220, 1250 120" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-3.5 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-wider text-[#18221D]/60 uppercase mb-2">
            <Link href="/" className="hover:text-[#0B2D23] transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0B2D23] font-semibold">Le Journal</span>
          </nav>

          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            CONSEILS D&apos;EXPERTS • SAVOIR-FAIRE JOAILLIER
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B2D23] tracking-tight">
            Le Journal de la Maison
          </h1>

          <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans max-w-xl mx-auto">
            Plongez dans l&apos;univers de la joaillerie moderne. Découvrez nos guides d&apos;entretien, secrets de fabrication et inspirations de style pour sublimer vos parures au quotidien.
          </p>
        </div>
      </section>

      {/* 2. BLOG LISTING VIEW */}
      <main className="container mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        <BlogListView posts={posts} categories={categories} />
      </main>

      {/* 3. NEWSLETTER COMMUNITY BANNER */}
      <section className="container mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-[#0B2D23] text-[#FAF7F2] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            ÉDITION PRIVÉE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Recevez nos prochains guides & offres exclusives
          </h2>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Inscrivez-vous pour recevoir directement dans votre boîte mail nos conseils d&apos;entretien et être informée des lancements de nouvelles collections.
          </p>
          <div className="max-w-md mx-auto pt-2">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
