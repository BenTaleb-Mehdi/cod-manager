"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  CheckCircle2,
  Lock,
  Truck,
  ShieldCheck,
  Sparkles,
  Phone,
  User,
  Home,
  MessageCircle,
  ShoppingBag,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Product, ProductOffer } from "@/types/storefront";
import { buildWhatsAppOrderLink, BRAND_NAME } from "@/lib/storefront-data";
import { useCart } from "@/context/cart-context";
import { CityCombobox } from "./city-combobox";

/**
 * Schéma de validation Zod optimisé pour le marché marocain COD
 */
const moroccanPhoneRegex = /^(?:(?:\+?212\s?|0)[67]\d{8})$/;

export const codDrawerOrderSchema = z.object({
  fullName: z
    .string()
    .min(3, "Veuillez entrer votre nom et prénom complet"),
  phone: z
    .string()
    .transform((val) => val.replace(/\s+/g, "").replace(/-/g, ""))
    .pipe(
      z
        .string()
        .regex(
          moroccanPhoneRegex,
          "Numéro marocain invalide (doit commencer par 06... ou 07...)"
        )
    ),
  city: z.string().min(1, "Veuillez choisir votre ville"),
  address: z
    .string()
    .min(4, "Veuillez préciser votre quartier ou adresse de livraison"),
  packId: z.string().min(1, "Veuillez sélectionner une offre"),
  notes: z.string().optional(),
});

export type CodDrawerOrderValues = z.infer<typeof codDrawerOrderSchema>;

interface CodOrderDrawerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedPackId?: string;
  onSelectPack?: (packId: string) => void;
}

export function CodOrderDrawer({
  product,
  isOpen,
  onClose,
  selectedPackId,
  onSelectPack,
}: CodOrderDrawerProps) {
  const { addToCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const [activePackId, setActivePackId] = useState<string>(
    selectedPackId ||
      product.offers.find((o) => o.isPopular)?.id ||
      product.offers[0]?.id ||
      "pack-1"
  );
  const [rawPhoneInput, setRawPhoneInput] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Synchroniser le pack sélectionné quand le tiroir s'ouvre ou que la prop change
  useEffect(() => {
    if (selectedPackId) {
      setActivePackId(selectedPackId);
      setValue("packId", selectedPackId);
    }
  }, [selectedPackId]);

  // Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Verrouillage du scroll en arrière-plan pendant l'ouverture du tiroir
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeOffer: ProductOffer = useMemo(() => {
    return (
      product.offers.find((o) => o.id === activePackId) ||
      product.offers[0] || {
        id: "pack-1",
        title: "1 Pièce",
        quantity: 1,
        priceMAD: product.priceMAD,
        compareAtPriceMAD: product.compareAtPriceMAD,
        savingsMAD: product.compareAtPriceMAD - product.priceMAD,
        badge: "Standard",
      }
    );
  }, [product.offers, activePackId, product.priceMAD, product.compareAtPriceMAD]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CodDrawerOrderValues>({
    resolver: zodResolver(codDrawerOrderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "Casablanca",
      address: "",
      packId: activePackId,
      notes: "",
    },
  });

  const currentCityValue = watch("city");

  // Formatage du numéro marocain (06 XX XX XX XX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    let formatted = raw;

    if (raw.length > 2 && raw.length <= 4) {
      formatted = `${raw.slice(0, 2)} ${raw.slice(2)}`;
    } else if (raw.length > 4 && raw.length <= 6) {
      formatted = `${raw.slice(0, 2)} ${raw.slice(2, 4)} ${raw.slice(4)}`;
    } else if (raw.length > 6 && raw.length <= 8) {
      formatted = `${raw.slice(0, 2)} ${raw.slice(2, 4)} ${raw.slice(4, 6)} ${raw.slice(6)}`;
    } else if (raw.length > 8) {
      formatted = `${raw.slice(0, 2)} ${raw.slice(2, 4)} ${raw.slice(4, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`;
    }

    setRawPhoneInput(formatted);
    setValue("phone", raw, { shouldValidate: true });
  };

  const handlePackSelect = (packId: string) => {
    setActivePackId(packId);
    setValue("packId", packId, { shouldValidate: true });
    if (onSelectPack) {
      onSelectPack(packId);
    }
  };

  // Soumission de la commande COD
  const onSubmit = async (values: CodDrawerOrderValues) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const orderPayload = {
          orderId: `MERAF-${Date.now().toString().slice(-6)}`,
          customerName: values.fullName,
          phone: values.phone,
          city: values.city,
          address: values.address,
          notes: values.notes || "",
          productTitle: product.title,
          productId: product.id,
          productSlug: product.slug,
          productImage: product.images[0],
          packTitle: activeOffer.title,
          quantity: activeOffer.quantity,
          totalMAD: activeOffer.priceMAD,
          deliveryFee: 0,
          paymentMethod: "COD (Cash on Delivery)",
          createdAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          window.localStorage.setItem("meraf_last_order", JSON.stringify(orderPayload));
          window.localStorage.setItem("morly_last_order", JSON.stringify(orderPayload));
        }

        let finalOrderId = orderPayload.orderId;
        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: values.fullName,
              phone: values.phone,
              city: values.city,
              address: `${values.address} (Offre: ${activeOffer.title})`,
              shippingNote: values.notes || "",
              items: [
                {
                  productId: product.id,
                  quantity: activeOffer.quantity,
                  price: activeOffer.priceMAD,
                },
              ],
            }),
          });
          const data = await res.json();
          if (data?.orderId) {
            finalOrderId = data.orderId;
          }
        } catch {
          // Fallback local
        }

        const directWhatsAppUrl = buildWhatsAppOrderLink({
          orderId: finalOrderId,
          productTitle: product.title,
          packName: activeOffer.title,
          priceMAD: activeOffer.priceMAD,
          productUrl: typeof window !== "undefined" ? window.location.href : "",
          customerName: values.fullName,
          phone: values.phone,
          city: values.city,
          address: values.address,
          notes: values.notes || "",
        });

        if (typeof window !== "undefined") {
          window.location.href = directWhatsAppUrl;
        }
      } catch (err: unknown) {
        console.error("Order error:", err);
        setSubmitError(
          "Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer ou nous contacter sur WhatsApp."
        );
      }
    });
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappUrl = buildWhatsAppOrderLink({
    productTitle: product.title,
    packName: activeOffer.title,
    priceMAD: activeOffer.priceMAD,
    productUrl: currentUrl,
  });

  return (
    <>
      {/* Backdrop sombre flouté avec transition fluide */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Tiroir coulissant depuis la droite (Slide-over Drawer from Right) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Formulaire de commande COD"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#FDFCF9] border-l border-[#E8E2D8] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* En-tête du tiroir : Titre & Bouton Fermer */}
        <div className="bg-[#0B2D23] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between border-b border-[#C5A880]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-normal text-white tracking-wide">
                  Commander en 1 Clic
                </h2>
                <span className="text-[10px] bg-[#C5A880] text-[#0B2D23] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  COD Maroc
                </span>
              </div>
              <p className="text-[11px] text-[#FAF7F2]/75">
                Paiement à la livraison après inspection du colis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le formulaire de commande"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Aperçu du produit sélectionné (Sticky sous le header) */}
        <div className="bg-[#FAF7F2] p-3.5 sm:p-4 border-b border-[#E8E2D8] flex items-center gap-3 shrink-0">
          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E8E2D8] shadow-xs">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-serif text-xs sm:text-sm font-medium text-[#0B2D23] truncate">
              {product.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-serif font-bold text-sm sm:text-base text-[#0B2D23]">
                {activeOffer.priceMAD} DH
              </span>
              {activeOffer.compareAtPriceMAD > activeOffer.priceMAD && (
                <span className="text-xs text-[#18221D]/40 line-through">
                  {activeOffer.compareAtPriceMAD} DH
                </span>
              )}
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                🚚 Livr. 0 DH
              </span>
            </div>
            <p className="text-[11px] text-[#A8875A] font-semibold mt-0.5 truncate">
              Pack sélectionné : {activeOffer.title}
            </p>
          </div>
        </div>

        {/* Corps du formulaire (Défilable, Clair et Aéré) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <form id="cod-drawer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1 : Sélection de l'offre / Coffret */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0B2D23]">
                <span className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-[#0B2D23] text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Choisissez votre coffret</span>
                </span>
                <span className="text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#C5A880]" /> Livraison Offerte
                </span>
              </div>

              <div className="space-y-2.5">
                {product.offers.map((offer) => {
                  const isSelected = activePackId === offer.id;
                  return (
                    <div
                      key={offer.id}
                      onClick={() => handlePackSelect(offer.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border-2 ${
                        isSelected
                          ? "border-[#0B2D23] bg-white shadow-sm ring-2 ring-[#0B2D23]/10"
                          : "border-[#E8E2D8] hover:border-[#C5A880] bg-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Radio bouton personnalisé */}
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "border-[#0B2D23] bg-[#0B2D23]"
                                : "border-[#C5A880] bg-white"
                            }`}
                          >
                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif font-semibold text-xs sm:text-sm text-[#0B2D23]">
                                {offer.title}
                              </span>
                              {offer.isPopular && (
                                <span className="bg-[#0B2D23] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  ⭐ Populaire
                                </span>
                              )}
                              {!offer.isPopular &&
                                offer.badge &&
                                offer.badge !== "Standard" &&
                                offer.badge !== "Livraison Gratuite" && (
                                  <span className="bg-[#C5A880]/20 text-[#0B2D23] border border-[#C5A880]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {offer.badge.replace(/Morly/g, "MÉRAF")}
                                  </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {offer.savingsMAD > 0 && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                                  Économisez {offer.savingsMAD} DH
                                </span>
                              )}
                              {offer.quantity > 1 && (
                                <span className="text-[10px] font-medium text-[#18221D]/60">
                                  {offer.quantity} bijoux inclus
                                </span>
                              )}
                            </div>

                            {isSelected && offer.includes && (
                              <p className="text-[10px] text-[#18221D]/70 pt-0.5 leading-snug">
                                Inclus : {offer.includes.map((i) => i.replace(/Morly/g, "MÉRAF")).join(" • ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Prix */}
                        <div className="text-right shrink-0 pl-2">
                          <div className="text-base sm:text-lg font-serif font-bold text-[#0B2D23]">
                            {offer.priceMAD} DH
                          </div>
                          {offer.compareAtPriceMAD > offer.priceMAD && (
                            <div className="text-[11px] text-[#18221D]/40 line-through">
                              {offer.compareAtPriceMAD} DH
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2 : Coordonnées de livraison */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0B2D23]">
                <span className="flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-[#0B2D23] text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Coordonnées de livraison</span>
                </span>
                <span className="text-[#18221D]/50 text-[11px] font-normal normal-case">
                  Règlement au livreur
                </span>
              </div>

              {/* Champ Nom et Prénom */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0B2D23]">
                  Nom et Prénom :
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18221D]/50" />
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Ex: Fatima Zahra El Idrissi"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-xs sm:text-sm font-medium transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 ${
                      errors.fullName ? "border-red-500" : "border-[#E8E2D8]"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Champ Téléphone Marocain avec indicatif 🇲🇦 +212 */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0B2D23]">
                  Numéro de Téléphone (WhatsApp) :
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18221D]/50" />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B2D23] border-r border-[#E8E2D8] pr-2">
                    🇲🇦 +212
                  </div>
                  <input
                    type="tel"
                    value={rawPhoneInput}
                    onChange={handlePhoneChange}
                    placeholder="06 12 34 56 78"
                    className={`w-full rounded-xl border bg-white py-3 pl-24 pr-4 text-xs sm:text-sm font-bold tracking-wider transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 ${
                      errors.phone ? "border-red-500" : "border-[#E8E2D8]"
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.phone.message}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#18221D]/60 pl-1">
                    Notre conseillère vous appellera pour confirmer l&apos;adresse avant expédition.
                  </p>
                )}
              </div>

              {/* Champ Ville de Livraison avec recherche */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0B2D23]">
                  Ville de livraison :
                </label>
                <CityCombobox
                  value={currentCityValue}
                  onChange={(val) => setValue("city", val, { shouldValidate: true })}
                  error={errors.city?.message}
                />
              </div>

              {/* Champ Adresse / Quartier */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0B2D23]">
                  Quartier ou Adresse exacte :
                </label>
                <div className="relative">
                  <Home className="absolute left-3.5 top-3 h-4 w-4 text-[#18221D]/50" />
                  <textarea
                    {...register("address")}
                    rows={2}
                    placeholder="Ex: Maarif, Résidence Al Yassmine, 3ème étage"
                    className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 resize-none ${
                      errors.address ? "border-red-500" : "border-[#E8E2D8]"
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Récapitulatif Total Clair */}
            <div className="rounded-2xl bg-[#FAF7F2] p-4 border border-[#E8E2D8] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#18221D]/75">
                <span>Prix de la création :</span>
                <span className="font-semibold text-[#0B2D23]">{activeOffer.priceMAD} DH</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#18221D]/75">
                <span>Livraison partout au Maroc :</span>
                <span className="font-bold text-emerald-800">OFFERTE (0 DH)</span>
              </div>
              <div className="border-t border-[#E8E2D8] pt-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0B2D23]">Total à payer au livreur :</p>
                  <p className="text-[10px] text-[#18221D]/60">Après ouverture et vérification</p>
                </div>
                <span className="text-2xl font-serif font-bold text-[#0B2D23]">
                  {activeOffer.priceMAD} DH
                </span>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {submitError}
              </div>
            )}
          </form>

          {/* Badges de Réassurance Spécifiques COD Maroc */}
          <div className="pt-2 border-t border-[#E8E2D8] grid grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-[#0B2D23] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#0B2D23]">Ouvrez avant de payer</p>
                <p className="text-[11px] text-[#18221D]/60">Vérifiez le bijou avec le livreur</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-[#0B2D23] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#0B2D23]">Livraison 24h - 48h</p>
                <p className="text-[11px] text-[#18221D]/60">Gratuite partout au Maroc</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#0B2D23]">Acier Inox 316L</p>
                <p className="text-[11px] text-[#18221D]/60">Garantie 100% inaltérable</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-[#0B2D23] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#0B2D23]">Confirmation d&apos;appel</p>
                <p className="text-[11px] text-[#18221D]/60">Sous 30min par notre équipe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Collant avec le Bouton d'action Principal */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D8] space-y-2.5 shrink-0 shadow-lg">
          <button
            type="submit"
            form="cod-drawer-form"
            disabled={isPending}
            className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2D23] via-[#144738] to-[#0B2D23] hover:from-[#144738] hover:to-[#1a5544] py-3.5 sm:py-4 px-4 text-[#FAF7F2] shadow-xl shadow-[#0B2D23]/25 border border-[#C5A880]/40 transition-all duration-300 hover:scale-[1.005] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center justify-center gap-2 text-center">
              <CheckCircle2 className="h-4 w-4 text-[#C5A880] shrink-0" />
              <span className="font-bold text-xs sm:text-sm tracking-wide uppercase text-white">
                {isPending
                  ? "Redirection vers WhatsApp..."
                  : `Confirmer ma Commande (${activeOffer.priceMAD} DH)`}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-[#DFCCA8]">
              <Lock className="h-3 w-3 text-[#C5A880] shrink-0" />
              <span>Paiement à la réception après ouverture du colis</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                addToCart(product, activeOffer, 1);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0B2D23] bg-white hover:bg-[#FAF7F2] py-2.5 px-3 text-xs font-bold text-[#0B2D23] transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>+ Panier</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0B2D23]/30 bg-[#FAF7F2] hover:bg-white py-2.5 px-3 text-xs font-semibold text-[#0B2D23] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#0B2D23]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
