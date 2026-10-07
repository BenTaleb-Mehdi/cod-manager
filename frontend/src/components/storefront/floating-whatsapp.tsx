"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buildWhatsAppOrderLink } from "@/lib/storefront-data";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = buildWhatsAppOrderLink({});

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end gap-2">
      {/* Bulle d'incitation flottante - visible sur desktop ou quand activée, ne bloque pas le formulaire mobile */}
      {showTooltip && (
        <div className="hidden sm:block relative rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] p-3 shadow-xl max-w-[220px] text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fermer"
            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#E8E2D8] flex items-center justify-center text-[#18221D] hover:bg-[#C5A880] transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[#0B2D23] font-bold mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B2D23]"></span>
            </span>
            <span>Conseillère Joaillère MÉRAF</span>
          </div>
          <p className="text-[#18221D]/75 text-[11px] leading-tight">
            Besoin d&apos;un conseil sur une création ou pour passer commande ? Écrivez-nous sur WhatsApp !
          </p>
        </div>
      )}

      {/* Bouton d'action WhatsApp vibrant */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter la Maison MÉRAF sur WhatsApp"
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] border border-[#C5A880]/50 shadow-xl shadow-[#0B2D23]/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A880] text-[10px] font-black text-[#0B2D23] ring-2 ring-[#FAF7F2]">
          1
        </span>
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#FAF7F2] group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
