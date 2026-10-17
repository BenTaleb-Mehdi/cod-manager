"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductReview } from "@/types/storefront";

interface ReviewsSectionProps {
  reviews?: ProductReview[];
  averageRating?: number;
  totalReviews?: number;
}

const DEFAULT_REVIEWS = [
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

export function ReviewsSection({
  reviews,
  averageRating = 4.9,
  totalReviews = 118,
}: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = (reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS).map((rev, idx) => ({
    id: rev.id || `rev-${idx}`,
    author: rev.author,
    city: rev.city || "Maroc",
    comment: rev.comment,
    rating: rev.rating || 5,
    avatar:
      (rev as { avatar?: string }).avatar ||
      rev.image ||
      DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length].avatar,
  }));

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const currentReview = items[currentIndex] || items[0];

  return (
    <section className="space-y-8 py-6">
      {/* Header with Title and Nav Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase">
            REAL STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#0B2D23] mt-1 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Navigation arrows & slide indicator */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-semibold text-[#18221D]/60 tracking-wider">
            {currentIndex + 1} / {items.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Avis précédent"
              className="h-10 w-10 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#0B2D23] hover:text-[#FAF7F2] hover:border-[#0B2D23] active:scale-95 flex items-center justify-center text-[#18221D] transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Avis suivant"
              className="h-10 w-10 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#0B2D23] hover:text-[#FAF7F2] hover:border-[#0B2D23] active:scale-95 flex items-center justify-center text-[#18221D] transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Single Testimonial Card Display */}
      <div className="max-w-3xl mx-auto">
        <div
          key={currentReview.id}
          className="rounded-3xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 sm:p-10 shadow-[0_4px_24px_rgba(11,45,35,0.04)] hover:border-[#C5A880] transition-all duration-300 flex flex-col justify-between space-y-6 min-h-[220px]"
        >
          {/* Serif quotation mark */}
          <div>
            <span className="font-serif text-4xl sm:text-5xl text-[#C5A880] leading-none block select-none">
              “
            </span>
            <p className="text-base sm:text-lg text-[#18221D]/85 leading-relaxed italic mt-3 font-serif">
              &ldquo;{currentReview.comment}&rdquo;
            </p>
          </div>

          {/* Author avatar, Name & Gold Stars */}
          <div className="pt-5 border-t border-[#E8E2D8]/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#C5A880]/50 shrink-0 shadow-xs">
                <Image
                  src={currentReview.avatar}
                  alt={currentReview.author}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#0B2D23] tracking-wide uppercase">
                  — {currentReview.author}
                </h4>
                <p className="text-xs text-[#18221D]/55 flex items-center gap-1.5 mt-0.5">
                  <span>{currentReview.city}</span>
                  <span>•</span>
                  <span className="text-[#0B2D23] font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#0B2D23]" />
                    Achat vérifié
                  </span>
                </p>
              </div>
            </div>

            {/* Gold Stars */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E8E2D8]">
              {[...Array(currentReview.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#C5A880] text-[#C5A880]"
                />
              ))}
              <span className="text-xs font-bold text-[#0B2D23] ml-1">
                {currentReview.rating}.0
              </span>
            </div>
          </div>
        </div>

        {/* Slide Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Aller à l'avis ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-[#0B2D23]"
                  : "w-2 bg-[#E8E2D8] hover:bg-[#C5A880]"
              }`}
            />
          ))}
        </div>
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
