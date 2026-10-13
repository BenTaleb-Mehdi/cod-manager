"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  badge?: string;
}

export function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Image Principale avec Navigation Swipeable */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] shadow-sm">
        <Image
          src={images[selectedIndex] || images[0]}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Badges Flottants */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {badge && (
            <span className="rounded-full bg-[#0B2D23]/95 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-wider uppercase text-white shadow-md">
              {badge}
            </span>
          )}
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-[#C5A880] flex items-center gap-1 shadow-sm">
            <Sparkles className="h-3 w-3" /> Acier Inoxydable 316L
          </span>
        </div>

        {/* Badge Garantie Anti-Rouille */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="rounded-lg bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#E8E2D8] px-2.5 py-1 text-[11px] font-semibold text-[#0B2D23] flex items-center gap-1 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0B2D23]" /> Garantie Inaltérable
          </span>
        </div>

        {/* Boutons de navigation Flèches Mobile / Desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Image précédente"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white text-[#0B2D23] p-2 backdrop-blur-sm transition-colors shadow-md z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Image suivante"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white text-[#0B2D23] p-2 backdrop-blur-sm transition-colors shadow-md z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Indicateurs de pagination (Dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === idx ? "w-4 bg-[#C5A880]" : "w-1.5 bg-white/60"
                }`}
                aria-label={`Aller à la photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniatures cliquables */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                selectedIndex === idx
                  ? "border-[#0B2D23] ring-2 ring-[#0B2D23]/20 shadow-md scale-102"
                  : "border-[#E8E2D8] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} miniature ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
