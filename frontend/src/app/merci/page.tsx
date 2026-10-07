"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  PhoneCall,
  Truck,
  ShieldCheck,
  MessageCircle,
  Instagram,
  ShoppingBag,
  Sparkles,
  Clock,
} from "lucide-react";
import { BRAND_PHONE_WHATSAPP, BRAND_SOCIALS } from "@/lib/storefront-data";

interface SavedOrder {
  orderId?: string;
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
  productTitle?: string;
  productImage?: string;
  packTitle?: string;
  totalMAD?: number;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    // 1. Lire d'abord les query params
    const queryOrderId = searchParams.get("orderId");
    const queryName = searchParams.get("name");
    const queryCity = searchParams.get("city");
    const queryProduct = searchParams.get("product");
    const queryPack = searchParams.get("pack");
    const queryTotal = searchParams.get("total");

    if (queryOrderId) {
      setOrder({
        orderId: queryOrderId,
        customerName: queryName || "Chère Cliente",
        city: queryCity || "Maroc",
        productTitle: queryProduct || "Bijou Morly",
        packTitle: queryPack || "Offre Standard",
        totalMAD: queryTotal ? parseFloat(queryTotal) : 199,
      });
      return;
    }

    // 2. Sinon lire localStorage de secours
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("morly_last_order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, [searchParams]);

  const orderId = order?.orderId || "MERAF-892145";
  const customerName = order?.customerName || "Chère Cliente";
  const city = order?.city || "Casablanca";
  const productTitle = order?.productTitle || "Bijou MÉRAF Acier Inoxydable";
  const packTitle = order?.packTitle || "Offre Standard (1 Pièce)";
  const totalMAD = order?.totalMAD || 199;

  const whatsappMessage = `Salam Maison MÉRAF ! 👋\nBghit nsuivre ma commande N° *${orderId}* (${productTitle}) pour ${customerName} à ${city}.`;
  const whatsappUrl = `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="rounded-3xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
      {/* Éclat décoratif */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#0B2D23]/5 blur-3xl pointer-events-none rounded-full" />

      {/* Icône de Succès avec Animation */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF7F2] border-2 border-[#C5A880] text-[#0B2D23] shadow-md">
        <CheckCircle2 className="h-10 w-10 text-[#0B2D23] animate-bounce" style={{ animationIterationCount: "2" }} />
      </div>

      <div className="space-y-2">
        <span className="rounded-full bg-[#0B2D23] text-[#FAF7F2] px-3.5 py-1 text-xs font-semibold tracking-wider uppercase">
          Commande Enregistrée avec Succès ✨
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#0B2D23] tracking-tight">
          Choukrane {customerName} !
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#18221D]/60">
          Référence de votre commande : <strong className="text-[#0B2D23] font-bold">{orderId}</strong>
        </p>
      </div>

      {/* Message Call Center Lumière */}
      <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] p-4 sm:p-5 text-left space-y-2">
        <div className="flex items-center gap-2 font-semibold text-[#0B2D23] text-sm sm:text-base">
          <PhoneCall className="h-4.5 w-4.5 text-[#0B2D23] animate-pulse" />
          <span>Confirmation téléphonique sous 30 minutes</span>
        </div>

        <p className="text-xs sm:text-sm text-[#18221D]/80 leading-relaxed">
          Notre conseillère de la <strong>Maison Lumière</strong> va vous contacter (05... ou 06...) pour valider avec vous l&apos;adresse de livraison exacte avant la remise au transporteur.
        </p>

        <p className="text-xs text-[#9F8259] font-medium italic pt-1 border-t border-[#E8E2D8]">
          🇲🇦 &ldquo;3afak khlli telephone dialek 9rib lik bach nwa9fou l&apos;adresse w nsayfto lik l&apos;colis f a9rab wa9t.&rdquo;
        </p>
      </div>

      {/* Récapitulatif de la Commande */}
      <div className="rounded-2xl bg-white border border-[#E8E2D8] p-5 text-left space-y-3 shadow-xs">
        <h3 className="font-semibold text-xs tracking-wider uppercase text-[#0B2D23]">
          Récapitulatif de votre commande :
        </h3>

        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#E8E2D8]/60">
          <span className="text-[#18221D]/60">Création choisie :</span>
          <span className="font-serif font-medium text-[#18221D] text-right">{productTitle}</span>
        </div>

        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#E8E2D8]/60">
          <span className="text-[#18221D]/60">Coffret sélectionné :</span>
          <span className="font-medium text-[#0B2D23]">{packTitle}</span>
        </div>

        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#E8E2D8]/60">
          <span className="text-[#18221D]/60">Destination :</span>
          <span className="font-medium text-[#18221D]">📍 {city}, Maroc</span>
        </div>

        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#E8E2D8]/60">
          <span className="text-[#18221D]/60">Délai estimé :</span>
          <span className="font-medium text-[#0B2D23] flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#C5A880]" /> 24h à 48h (Offerte)
          </span>
        </div>

        <div className="flex items-center justify-between text-base pt-2">
          <span className="font-semibold text-[#18221D]">Montant à régler au livreur :</span>
          <span className="text-2xl font-serif font-bold text-[#0B2D23]">
            {totalMAD} DH
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-[#18221D]/60">
          <ShieldCheck className="h-4 w-4 text-[#0B2D23] shrink-0" />
          <span>Rappel : Vous inspectez votre bijou avant de remettre les {totalMAD} DH au livreur.</span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0B2D23] hover:bg-[#154738] py-3.5 px-4 text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#0B2D23]/20 transition-colors"
        >
          <MessageCircle className="h-4.5 w-4.5 text-[#C5A880]" />
          <span>Suivre ma commande sur WhatsApp</span>
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={BRAND_SOCIALS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] py-3 px-3 text-xs font-medium text-[#0B2D23] hover:bg-white transition-colors"
          >
            <Instagram className="h-4 w-4 text-[#C5A880]" />
            <span>Instagram @meraf.jewelry</span>
          </a>

          <Link
            href="/collections"
            className="flex items-center justify-center gap-2 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] py-3 px-3 text-xs font-medium text-[#0B2D23] hover:bg-white transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-[#0B2D23]" />
            <span>Continuer vos achats</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-14 max-w-2xl space-y-8">
      <Suspense
        fallback={
          <div className="rounded-3xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Chargement de la confirmation de votre commande...
          </div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
