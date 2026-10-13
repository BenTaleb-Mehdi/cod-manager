import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  MessageCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { BRAND_PHONE_WHATSAPP, BRAND_SOCIALS, BRAND_GMAIL } from "@/lib/storefront-data";
import { ContactForm } from "@/components/storefront/contact-form";

export const metadata = {
  title: "Contact & Conciergerie | Maison MÉRAF",
  description:
    "Contactez la Maison MÉRAF. Support WhatsApp réactif 7j/7, assistance téléphonique, suivi de commande et conseils joailliers personnalisés partout au Maroc.",
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(
    "Salam Maison MÉRAF! J'aimerais avoir un renseignement joaillerie svp."
  )}`;

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20 text-[#18221D]">
      {/* 1. HERO HEADER WITH PERSONALIZED MÉRAF CONCIERGERIE IMAGE */}
      <section className="border-b border-[#E8E2D8] bg-[#F7F3EC] py-8 sm:py-12 relative overflow-hidden">
        {/* Subtle decorative curves */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M-50 180 C 350 70, 750 240, 1250 110" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 4" />
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
                <span className="text-[#0B2D23] font-semibold">Conciergerie & Contact</span>
              </nav>

              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                À VOTRE ÉCOUTE • SALON PRIVÉ JOAILLIER
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B2D23] tracking-tight leading-tight">
                Conciergerie & Contact Maison MÉRAF
              </h1>

              <p className="text-xs sm:text-sm text-[#18221D]/75 leading-relaxed font-sans">
                Une question sur un modèle, un conseil personnalisé pour choisir une bague ou besoin d&apos;assistance pour suivre votre livraison ? Notre équipe conciergerie vous répond <strong>7j/7 avec bienveillance</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] text-[#0B2D23] font-medium">
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Support WhatsApp direct &lt; 10 min
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Échanges sans frais 30 jours
                </span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-full">
                  ✦ Partout au Maroc
                </span>
              </div>
            </div>

            {/* Right Column: Personalized MÉRAF Salon Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-[#E8E2D8] shadow-2xl bg-[#FAF7F2] group">
                <img
                  src="/images/meraf/contact-hero.jpg"
                  alt="MÉRAF Salon Privé et Conciergerie Joaillière"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Floating Concierge Badge */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#C5A880] rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#A8875A]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0B2D23]">
                    MÉRAF CONCIERGERIE VIP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIRECT CONTACT METHODS (4 CARDS) */}
      <section className="container mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-[#C5A880]/60 bg-[#0B2D23] text-[#FAF7F2] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF7F2] text-[#0B2D23] flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-[#0B2D23]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-white">
                  WhatsApp Concierge
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Réponse instantanée en moins de 10 min.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-[#C5A880]/30 text-xs font-bold tracking-wider uppercase text-[#C5A880] group-hover:text-white flex items-center justify-between">
              <span>Discuter en direct</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </a>

          {/* 2. Phone Call */}
          <a
            href={`tel:+${BRAND_PHONE_WHATSAPP}`}
            className="group rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 shadow-xs hover:shadow-lg hover:border-[#C5A880] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-[#0B2D23] flex items-center justify-center">
                <PhoneCall className="h-5 w-5 text-[#0B2D23]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-[#0B2D23]">
                  Assistance Téléphonique
                </h3>
                <p className="text-xs text-[#18221D]/70 mt-1">
                  Lun - Sam : 9h à 20h <br />
                  Dimanche : 10h à 18h
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E8E2D8] text-xs font-semibold text-[#0B2D23] group-hover:text-[#9F8259] flex items-center justify-between">
              <span>+212 718 904 631</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </a>

          {/* 3. Email & Gmail Support */}
          <a
            href={BRAND_SOCIALS.gmail}
            className="group rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 shadow-xs hover:shadow-lg hover:border-[#C5A880] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-[#0B2D23] flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#0B2D23]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-[#0B2D23]">
                  Service Gmail / Email
                </h3>
                <p className="text-xs text-[#18221D]/70 mt-1">
                  Pour vos questions, partenariats et commandes spéciales.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E8E2D8] text-xs font-semibold text-[#0B2D23] group-hover:text-[#9F8259] flex items-center justify-between">
              <span>{BRAND_GMAIL}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </a>

          {/* 4. Showroom & Atelier */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-[#0B2D23] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#0B2D23]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-[#0B2D23]">
                  Ateliers & Expéditions
                </h3>
                <p className="text-xs text-[#18221D]/70 mt-1">
                  Casablanca, Maroc. <br />
                  Expédition quotidienne vers tout le Royaume.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E8E2D8] text-xs font-semibold text-[#0B2D23]">
              <span>Livraison 24h/48h</span>
            </div>
          </div>
        </div>

        {/* Canaux Officiels & Réseaux Sociaux MÉRAF */}
        <div className="mt-8 rounded-2xl border border-[#E8E2D8] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase block">
                COMMUNAUTÉ & CONTACT OFFICIEL
              </span>
              <h3 className="font-serif text-base sm:text-lg text-[#0B2D23]">
                Retrouvez la Maison MÉRAF sur tous nos réseaux
              </h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={BRAND_SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-white hover:border-[#0B2D23] px-3.5 py-2 text-xs font-semibold text-[#0B2D23] transition-all shadow-2xs"
              >
                <span className="text-rose-500 font-bold">IG</span>
                <span>Instagram</span>
              </a>
              <a
                href={BRAND_SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-white hover:border-[#0B2D23] px-3.5 py-2 text-xs font-semibold text-[#0B2D23] transition-all shadow-2xs"
              >
                <span className="text-blue-600 font-bold">FB</span>
                <span>Facebook</span>
              </a>
              <a
                href={BRAND_SOCIALS.x}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-white hover:border-[#0B2D23] px-3.5 py-2 text-xs font-semibold text-[#0B2D23] transition-all shadow-2xs"
              >
                <span className="text-zinc-900 font-bold">𝕏</span>
                <span>X / Twitter</span>
              </a>
              <a
                href={BRAND_SOCIALS.gmail}
                className="flex items-center gap-2 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-white hover:border-[#0B2D23] px-3.5 py-2 text-xs font-semibold text-[#0B2D23] transition-all shadow-2xs"
              >
                <Mail className="h-3.5 w-3.5 text-red-500" />
                <span>Gmail</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FORM & MOROCCAN COD FAQ */}
      <main className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: FAQ & COD Reassurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#F4EFEA] border border-[#E8E2D8] p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
                  RÉPONSES IMMÉDIATES
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#0B2D23]">
                  Questions Fréquentes
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1 border-b border-[#E8E2D8] pb-3.5">
                  <h4 className="font-semibold text-[#0B2D23] flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#0B2D23] shrink-0" />
                    <span>Puis-je ouvrir mon colis avant de régler ?</span>
                  </h4>
                  <p className="text-xs text-[#18221D]/75 leading-relaxed pl-6">
                    Oui, sans aucune exception ! C&apos;est le principe de confiance MÉRAF. Vous ouvrez le coffret, vérifiez le bijou, et vous ne payez le livreur que si vous êtes comblée.
                  </p>
                </div>

                <div className="space-y-1 border-b border-[#E8E2D8] pb-3.5">
                  <h4 className="font-semibold text-[#0B2D23] flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#0B2D23] shrink-0" />
                    <span>Combien coûte la livraison ?</span>
                  </h4>
                  <p className="text-xs text-[#18221D]/75 leading-relaxed pl-6">
                    La livraison est <strong>100% GRATUITE</strong> (0 DH) dans toutes les villes et régions du Maroc.
                  </p>
                </div>

                <div className="space-y-1 border-b border-[#E8E2D8] pb-3.5">
                  <h4 className="font-semibold text-[#0B2D23] flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-[#0B2D23] shrink-0" />
                    <span>Comment faire si la taille ne convient pas ?</span>
                  </h4>
                  <p className="text-xs text-[#18221D]/75 leading-relaxed pl-6">
                    Contactez immédiatement notre support WhatsApp. Nous organisons un échange sous 24h avec un livreur qui vient directement chez vous.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-[#0B2D23] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C5A880] shrink-0" />
                    <span>Vos bijoux noircissent-ils avec le temps ?</span>
                  </h4>
                  <p className="text-xs text-[#18221D]/75 leading-relaxed pl-6">
                    Non ! Conçus en acier chirurgical 316L avec dorure or 18k par dépôt PVD sous vide, nos créations résistent aux parfums, à l&apos;eau et conservent leur éclat pour toujours.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="rounded-2xl bg-[#0B2D23] text-[#FAF7F2] p-6 space-y-3 shadow-md">
              <h4 className="font-serif text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A880]" />
                <span>Besoin d&apos;une réponse maintenant ?</span>
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Notre équipe est en ligne en ce moment. Envoyez-nous un message WhatsApp pour un échange chaleureux et sans attente.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] hover:bg-[#B38F4D] text-[#0B2D23] px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors shadow-xs"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
