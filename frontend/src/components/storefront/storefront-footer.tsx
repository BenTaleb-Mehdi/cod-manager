import React from "react";
import Link from "next/link";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Instagram,
  Facebook,
  Mail,
  MessageCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { BRAND_PHONE_WHATSAPP, BRAND_SOCIALS, BRAND_GMAIL } from "@/lib/storefront-data";

function XLogo({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[#E8E2D8] bg-[#F7F3EC] text-[#18221D] pt-14 pb-20 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 1. Top 3 Reassurance Badges (Exact layout from reference) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full border border-[#C5A880]/40 bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] shrink-0">
              <Truck className="h-4 w-4 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0B2D23]">
                FREE SHIPPING
              </h4>
              <p className="text-[11px] text-[#18221D]/60 mt-0.5">
                Livraison gratuite 24/48h partout au Maroc
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full border border-[#C5A880]/40 bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] shrink-0">
              <RotateCcw className="h-4 w-4 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0B2D23]">
                30-DAY RETURNS
              </h4>
              <p className="text-[11px] text-[#18221D]/60 mt-0.5">
                Échange simple et garanti sans tracas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full border border-[#C5A880]/40 bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] shrink-0">
              <ShieldCheck className="h-4 w-4 text-[#0B2D23]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#0B2D23]">
                SECURE PAYMENTS
              </h4>
              <p className="text-[11px] text-[#18221D]/60 mt-0.5">
                Paiement à la livraison après vérification du colis
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main 4-Column Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.25em] text-[#0B2D23] uppercase block">
                MÉRAF
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#9F8259] uppercase block font-medium">
                JEWELRY
              </span>
            </Link>

            <p className="text-xs text-[#18221D]/70 max-w-sm leading-relaxed">
              Timeless beauty. Thoughtful design. Made to be cherished. Créations d&apos;exception en acier inoxydable 316L certifié et finitions or 18k inaltérables pour la femme moderne.
            </p>

            {/* Réseaux Sociaux & Contact Direct */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={BRAND_SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @meraf.jewelry"
                title="Instagram"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] hover:border-[#0B2D23] hover:scale-110 active:scale-95 transition-all shadow-2xs"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Maison MÉRAF"
                title="Facebook"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] hover:border-[#0B2D23] hover:scale-110 active:scale-95 transition-all shadow-2xs"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) @meraf_jewelry"
                title="X (Twitter)"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] hover:border-[#0B2D23] hover:scale-110 active:scale-95 transition-all shadow-2xs"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.gmail}
                aria-label={`Gmail (${BRAND_GMAIL})`}
                title={`Gmail : ${BRAND_GMAIL}`}
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] hover:text-[#C5A880] hover:border-[#0B2D23] hover:scale-110 active:scale-95 transition-all shadow-2xs"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
              <a
                href={BRAND_SOCIALS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Concierge"
                title="WhatsApp Concierge"
                className="h-8 w-8 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-center text-[#0B2D23] hover:text-emerald-700 hover:border-emerald-700 hover:scale-110 active:scale-95 transition-all shadow-2xs"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-[0.15em] uppercase text-[#0B2D23]">
              BOUTIQUE
            </h5>
            <ul className="space-y-2 text-xs text-[#18221D]/70">
              <li>
                <Link href="/collections" className="hover:text-[#0B2D23] transition-colors font-medium">
                  Toutes les Collections
                </Link>
              </li>
              <li>
                <Link href="/collections?category=slasel" className="hover:text-[#0B2D23] transition-colors">
                  Colliers & Pendentifs
                </Link>
              </li>
              <li>
                <Link href="/collections?category=khowatem" className="hover:text-[#0B2D23] transition-colors">
                  Bagues Solitaires & Ajustables
                </Link>
              </li>
              <li>
                <Link href="/collections?category=dmalj" className="hover:text-[#0B2D23] transition-colors">
                  Bracelets Joncs & Chaînes
                </Link>
              </li>
              <li>
                <Link href="/collections?category=khwarsi" className="hover:text-[#0B2D23] transition-colors">
                  Boucles d&apos;oreilles & Créoles
                </Link>
              </li>
            </ul>
          </div>

          {/* COLLECTIONS & JOURNAL Column */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-[0.15em] uppercase text-[#0B2D23]">
              LE JOURNAL & CONSEILS
            </h5>
            <ul className="space-y-2 text-xs text-[#18221D]/70">
              <li>
                <Link href="/blog" className="hover:text-[#0B2D23] transition-colors font-medium">
                  Tous les Guides & Articles
                </Link>
              </li>
              <li>
                <Link href="/blog/guide-entretien-acier-inoxydable-316l" className="hover:text-[#0B2D23] transition-colors">
                  Entretien de l&apos;Acier 316L
                </Link>
              </li>
              <li>
                <Link href="/blog/comment-choisir-taille-bague-parfaite" className="hover:text-[#0B2D23] transition-colors">
                  Guide des Tailles de Bagues
                </Link>
              </li>
              <li>
                <Link href="/blog/tendances-bijoux-maroc-2026" className="hover:text-[#0B2D23] transition-colors">
                  Tendances Bijoux 2026
                </Link>
              </li>
              <li>
                <Link href="/blog/pourquoi-choisir-or-18k-et-acier-316l" className="hover:text-[#0B2D23] transition-colors">
                  Pourquoi l&apos;Or 18K & Acier 316L
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER CARE Column */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-[0.15em] uppercase text-[#0B2D23]">
              CONCIERGERIE
            </h5>
            <ul className="space-y-2 text-xs text-[#18221D]/70">
              <li>
                <Link href="/contact" className="hover:text-[#0B2D23] transition-colors font-medium">
                  Nous Contacter
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#0B2D23] transition-colors">
                  Paiement à la Livraison
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#0B2D23] transition-colors">
                  Livraison Gratuite 24/48h
                </Link>
              </li>
              <li>
                <Link href="/#craftsmanship" className="hover:text-[#0B2D23] transition-colors">
                  Savoir-Faire & Garantie
                </Link>
              </li>
              <li>
                <a
                  href={BRAND_SOCIALS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0B2D23] transition-colors flex items-center gap-1.5 text-[#0B2D23] font-semibold"
                >
                  <MessageCircle className="h-3 w-3 text-[#C5A880]" /> Support WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={BRAND_SOCIALS.gmail}
                  className="hover:text-[#0B2D23] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3 w-3 text-[#C5A880]" /> {BRAND_GMAIL}
                </a>
              </li>
              <li>
                <a
                  href={BRAND_SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0B2D23] transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="h-3 w-3 text-[#C5A880]" /> Instagram @meraf.jewelry
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Copyright & Legal Links */}
        <div className="pt-8 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#18221D]/60">
          <p>© {new Date().getFullYear()} MÉRAF Jewelry. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link href="/#faq" className="hover:text-[#0B2D23] transition-colors">
              Paiement & Livraison
            </Link>
            <Link href="/contact" className="hover:text-[#0B2D23] transition-colors">
              Contact Conciergerie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
