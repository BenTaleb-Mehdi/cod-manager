"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, User, Sparkles } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogListViewProps {
  posts: BlogPost[];
  categories: string[];
}

export function BlogListView({ posts, categories }: BlogListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = posts.filter(
    (p) =>
      selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. FEATURED ARTICLE HERO */}
      {featuredPost && selectedCategory === "all" && (
        <section className="rounded-3xl border border-[#E8E2D8] bg-[#FDFCF9] overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Image */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] overflow-hidden bg-[#F4EFEA]">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#C5A880]" /> À LA UNE
                </span>
              </div>
            </div>

            {/* Text details */}
            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FDFCF9] space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-[#A8875A] font-semibold tracking-wider uppercase">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featuredPost.readTime}
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2D23] font-normal leading-tight group-hover:text-[#9F8259] transition-colors">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#E8E2D8]">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0B2D23]">
                      {featuredPost.author.name}
                    </p>
                    <p className="text-[10px] text-[#18221D]/60">
                      {featuredPost.publishedAt}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-5 py-2.5 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all"
                >
                  <span>Lire</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#C5A880]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CATEGORY TABS BAR */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4 overflow-x-auto no-scrollbar gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#0B2D23] text-[#FAF7F2]"
                : "bg-[#F4EFEA] text-[#0B2D23] hover:bg-[#E8E2D8]"
            }`}
          >
            Tous les articles ({posts.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#0B2D23] text-[#FAF7F2]"
                  : "bg-[#F4EFEA] text-[#0B2D23] hover:bg-[#E8E2D8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#18221D]/60 whitespace-nowrap hidden sm:inline">
          {regularPosts.length} {regularPosts.length > 1 ? "guides disponibles" : "guide"}
        </span>
      </div>

      {/* 3. ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularPosts.map((post) => (
          <article
            key={post.id}
            className="group rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col"
          >
            {/* Image banner */}
            <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#E8E2D8] px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#0B2D23]">
                  {post.category}
                </span>
              </div>
            </Link>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] text-[#18221D]/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#0B2D23] group-hover:text-[#9F8259] transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#18221D]/70 font-sans leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden border border-[#E8E2D8]">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0B2D23]">
                    {post.author.name}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold tracking-wider uppercase text-[#0B2D23] group-hover:text-[#C5A880] flex items-center gap-1 transition-colors"
                >
                  <span>Lire</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
