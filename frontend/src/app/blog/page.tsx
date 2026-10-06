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
      {/* 1. HERO HEADER WITH PERSONALIZED MÉRAF ATELIER IMAGE */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-8 sm:py-12 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M-50 200 C 350 80, 750 220, 1250 120" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Typography */}
            <div className="lg:col-span-6 space-y-4 max-w-xl text-center lg:text-left">
              {/* Breadcrumbs */}
              <nav className="flex items-center justify-center lg:justify-start gap-2 text-[11px] font-medium tracking-wider text-[#18221D]/60 uppercase">
                <Link href="/" className="hover:text-[#0B2D23] transition-colors">
                  Accueil
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#0B2D23] font-semibold">Le Journal</span>
              </nav>

              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                CONSEILS D&apos;EXPERTS • SAVOIR-FAIRE JOAILLIER
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B2D23] tracking-tight leading-tight">
                Le Journal de la Maison MÉRAF
              </h1>

              <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans">
                Plongez dans les coulisses de la création joaillière. Découvrez nos <strong>guides d&apos;entretien pour l&apos;acier 316L</strong>, nos conseils de <strong>layering de colliers</strong> et le guide infaillible pour mesurer votre tour de doigt à la maison.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] text-[#0B2D23] font-medium">
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Guides d&apos;entretien
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Guide des tailles
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Tendances 2026 au Maroc
                </span>
              </div>
            </div>

            {/* Right Column: Personalized MÉRAF Atelier Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-[#E8E2D8] shadow-2xl bg-[#FAF7F2] group">
                <img
                  src="/images/meraf/blog-hero.jpg"
                  alt="MÉRAF Journal d'Atelier - Carnet de Créations et Gemmes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Overlapping Atelier Tag */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#C5A880] rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#A8875A]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0B2D23]">
                    CARNET D&apos;ATELIER MÉRAF
                  </span>
                </div>
              </div>
            </div>
          </div>
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
