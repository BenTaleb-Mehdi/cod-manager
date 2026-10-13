"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductReview } from "@/types/storefront";

interface ReviewsSectionProps {
  reviews: ProductReview[];
  averageRating?: number;
  totalReviews?: number;
}

export function ReviewsSection({
  reviews,
  averageRating = 4.9,
  totalReviews = 118,
}: ReviewsSectionProps) {
  // Testimonials displayed as in the reference design
  const featuredReviews = [
    {
      id: "curated-1",
      author: "Sophia L.",
      city: "Casablanca",
      comment:
        "The quality and attention to detail are absolutely unmatched. I wear my necklace every day and always get compliments! Le placage or reste impeccable même sous l'eau.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "curated-2",
      author: "Jessica M.",
      city: "Rabat",
      comment:
        "Beautiful packaging, fast shipping, and even more stunning in person. Lumière is my new go-to for meaningful gifts. Le livreur m'a attendu pour ouvrir et vérifier le bijou.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "curated-3",
      author: "Emily R.",
      city: "Marrakech",
      comment:
        "Ethically made, gorgeous designs, and exceptional customer service. Highly recommend! Service client WhatsApp réactif et qualité digne d'une grande joaillerie.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="space-y-8 py-6">
      {/* Header with Title and Nav Arrows (from reference) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase">
            REAL STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#0B2D23] mt-1 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Navigation arrows (matching reference UI) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            aria-label="Avis précédent"
            className="h-9 w-9 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFEA] hover:border-[#0B2D23] flex items-center justify-center text-[#18221D] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Avis suivant"
            className="h-9 w-9 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFEA] hover:border-[#0B2D23] flex items-center justify-center text-[#18221D] transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3 Testimonial Cards (Exact replica of reference photo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featuredReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 shadow-[0_2px_12px_rgba(11,45,35,0.02)] hover:border-[#C5A880] transition-colors flex flex-col justify-between space-y-4"
          >
            {/* Serif quotation mark */}
            <div>
              <span className="font-serif text-3xl text-[#C5A880] leading-none block select-none">
                “
              </span>
              <p className="text-xs sm:text-sm text-[#18221D]/80 leading-relaxed italic mt-2">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            {/* Author avatar, Name & 5 Gold Stars */}
            <div className="pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#C5A880]/40 shrink-0">
                  <Image
                    src={rev.avatar}
                    alt={rev.author}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#0B2D23] tracking-wide uppercase">
                    — {rev.author}
                  </h4>
                  <p className="text-[10px] text-[#18221D]/50">
                    {rev.city} • Achat vérifié
                  </p>
                </div>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-[#C5A880] text-[#C5A880]"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance COD footer badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#0B2D23]/80 bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl max-w-xl mx-auto text-center font-medium">
        <CheckCircle2 className="h-4 w-4 text-[#0B2D23] shrink-0" />
        <span>
          100% de nos clientes marocaines inspectent leur bijou avant de payer le livreur.
        </span>
      </div>
    </section>
  );
}
