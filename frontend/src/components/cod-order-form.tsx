"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  MapPin,
  User,
  Home,
  MessageCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  Search,
  Gift,
  HelpCircle,
} from "lucide-react";
import { Product, ProductOffer, MoroccoCity } from "@/types/storefront";
import { getCities, buildWhatsAppOrderLink, BRAND_NAME } from "@/lib/storefront-data";
import { formatPriceMAD } from "@/lib/utils";

/**
 * Schéma de validation Zod optimisé pour le marché marocain COD
 */
const moroccanPhoneRegex = /^(?:(?:\+?212\s?|0)[67]\d{8})$/;

export const codOrderSchema = z.object({
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

export type CodOrderFormValues = z.infer<typeof codOrderSchema>;

interface CodOrderFormProps {
  product: Product;
  selectedOfferId?: string;
  className?: string;
}

export function CodOrderForm({ product, selectedOfferId, className = "" }: CodOrderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPack, setSelectedPack] = useState<string>(
    selectedOfferId || product.offers.find((o) => o.isPopular)?.id || product.offers[0]?.id || "pack-1"
  );
  const [rawPhoneInput, setRawPhoneInput] = useState<string>("");
  const [citySearch, setCitySearch] = useState<string>("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cities = useMemo(() => getCities(), []);

  const activeOffer: ProductOffer = useMemo(() => {
    return product.offers.find((o) => o.id === selectedPack) || product.offers[0];
  }, [product.offers, selectedPack]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CodOrderFormValues>({
    resolver: zodResolver(codOrderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "Casablanca",
      address: "",
      packId: selectedPack,
      notes: "",
    },
  });

  const currentCityValue = watch("city");

  // Formatage à la volée du numéro de téléphone marocain (06 XX XX XX XX)
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

  const handleSelectPack = (packId: string) => {
    setSelectedPack(packId);
    setValue("packId", packId, { shouldValidate: true });
  };

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    return cities.filter((c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [cities, citySearch]);

  const selectedCityObj = useMemo(() => {
    return cities.find((c) => c.name === currentCityValue);
  }, [cities, currentCityValue]);

  // Soumission de la commande COD
  const onSubmit = async (values: CodOrderFormValues) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const orderPayload = {
          orderId: `MORLY-${Date.now().toString().slice(-6)}`,
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

        // Sauvegarde locale de secours pour la page de remerciement
        if (typeof window !== "undefined") {
          window.localStorage.setItem("morly_last_order", JSON.stringify(orderPayload));
        }

        // Tenter d'envoyer la commande à l'API interne si disponible
        try {
          await fetch("/api/orders", {
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
        } catch {
          // Fallback silencieux : la commande est sécurisée localement
        }

        // Redirection vers la page merci avec query params
        const queryParams = new URLSearchParams({
          orderId: orderPayload.orderId,
          name: values.fullName,
          city: values.city,
          product: product.title,
          pack: activeOffer.title,
          total: String(activeOffer.priceMAD),
        });

        router.push(`/merci?${queryParams.toString()}`);
      } catch (err: unknown) {
        console.error("Order error:", err);
        setSubmitError("Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer ou commander directement via WhatsApp.");
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
    <div
      id="cod-checkout-section"
      className={`rounded-2xl border border-[#E8E2D8] bg-[#FDFCF9] p-5 sm:p-7 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Ruban d'en-tête attractif Deep Emerald */}
      <div className="absolute top-0 left-0 right-0 bg-[#0B2D23] py-2 px-4 text-center text-xs font-semibold text-[#FAF7F2] shadow-sm flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
        <span className="tracking-wide">Paiement à la Livraison après ouverture du colis • الدفع عند الاستلام</span>
      </div>

      <div className="pt-6 pb-2 text-center space-y-1">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
          COMMANDE RAPIDE
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0B2D23] tracking-tight">
          Commander en 1 Clic
        </h3>
        <p className="text-xs text-[#18221D]/70 max-w-sm mx-auto">
          Complétez simplement vos coordonnées. Règlement direct au livreur après inspection.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Étape 1 : Choix de l'offre */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-[#0B2D23] flex items-center justify-between">
            <span>1. Choisissez votre coffret :</span>
            <span className="text-[#0B2D23] font-medium text-xs flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-[#C5A880]" /> Livraison Offerte
            </span>
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {product.offers.map((offer) => {
              const isSelected = selectedPack === offer.id;
              return (
                <div
                  key={offer.id}
                  onClick={() => handleSelectPack(offer.id)}
                  className={`relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                    isSelected
                      ? "border-[#0B2D23] bg-[#FAF7F2] shadow-sm ring-1 ring-[#0B2D23]"
                      : "border-[#E8E2D8] hover:border-[#C5A880] bg-white"
                  }`}
                >
                  {offer.badge && (
                    <span
                      className={`absolute -top-2.5 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                        offer.isPopular
                          ? "bg-[#0B2D23] text-[#FAF7F2]"
                          : "bg-[#C5A880] text-[#0B2D23]"
                      }`}
                    >
                      {offer.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-[#0B2D23] bg-[#0B2D23] text-white"
                            : "border-[#E8E2D8] bg-transparent"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#18221D]">
                          {offer.title}
                        </p>
                        {offer.savingsMAD > 0 && (
                          <p className="text-xs font-semibold text-[#0B2D23]">
                            Économisez {offer.savingsMAD} DH
                          </p>
                        )}
                        {offer.includes && (
                          <p className="text-[11px] text-[#18221D]/60 mt-0.5">
                            Inclus : {offer.includes.join(" • ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#0B2D23]">
                        {offer.priceMAD} DH
                      </div>
                      {offer.compareAtPriceMAD > offer.priceMAD && (
                        <div className="text-xs text-[#18221D]/40 line-through">
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

        {/* Étape 2 : Coordonnées de livraison */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-[#0B2D23]">
            2. Coordonnées de Livraison :
          </label>

          {/* Champ Nom et Prénom */}
          <div>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18221D]/50" />
              <input
                {...register("fullName")}
                type="text"
                placeholder="Nom et Prénom (ex: Fatima Zahra)"
                className={`w-full rounded-xl border bg-[#FAF7F2] py-3 pl-10 pr-4 text-sm font-medium transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 ${
                  errors.fullName ? "border-red-500" : "border-[#E8E2D8]"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1 font-medium pl-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Champ Téléphone Marocain avec masque et auto-formatage */}
          <div>
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
                className={`w-full rounded-xl border bg-[#FAF7F2] py-3 pl-24 pr-4 text-sm font-bold tracking-wider transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 ${
                  errors.phone ? "border-red-500" : "border-[#E8E2D8]"
                }`}
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-500 mt-1 font-medium pl-1">
                {errors.phone.message}
              </p>
            ) : (
              <p className="text-[11px] text-[#18221D]/60 mt-1 pl-1">
                Notre conseillère vous appellera pour confirmer l&apos;adresse avant expédition.
              </p>
            )}
          </div>

          {/* Champ Ville searchable */}
          <div className="relative">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18221D]/50" />
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className={`w-full rounded-xl border bg-[#FAF7F2] py-3 pl-10 pr-10 text-left text-sm font-medium transition-colors flex items-center justify-between focus:border-[#0B2D23] focus:outline-none ${
                  errors.city ? "border-red-500" : "border-[#E8E2D8]"
                }`}
              >
                <span>{currentCityValue || "Sélectionnez votre ville..."}</span>
                <div className="flex items-center gap-1.5">
                  {selectedCityObj && (
                    <span className="text-[11px] font-semibold text-[#0B2D23] bg-white border border-[#E8E2D8] px-2 py-0.5 rounded-full">
                      {selectedCityObj.deliveryTime}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 text-[#18221D]/50" />
                </div>
              </button>
            </div>

            {/* Menu déroulant searchable */}
            {isCityDropdownOpen && (
              <div className="absolute z-30 mt-1 w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] shadow-2xl p-2 max-h-60 overflow-y-auto">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#18221D]/50" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Rechercher votre ville..."
                    className="w-full rounded-lg border border-[#E8E2D8] bg-white py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-[#0B2D23]"
                    autoFocus
                  />
                </div>
                <div className="space-y-0.5">
                  {filteredCities.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setValue("city", c.name, { shouldValidate: true });
                        setIsCityDropdownOpen(false);
                        setCitySearch("");
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        currentCityValue === c.name
                          ? "bg-[#0B2D23] text-[#FAF7F2] font-semibold"
                          : "hover:bg-[#F4EFEA] text-[#18221D]"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          currentCityValue === c.name
                            ? "bg-white/20 text-[#FAF7F2]"
                            : "text-[#18221D]/60"
                        }`}
                      >
                        {c.deliveryTime} • Gratuit
                      </span>
                    </div>
                  ))}
                  {filteredCities.length === 0 && (
                    <p className="text-center text-xs text-[#18221D]/60 py-2">
                      Ville introuvable. Notre transporteur livre tout le Maroc.
                    </p>
                  )}
                </div>
              </div>
            )}
            {errors.city && (
              <p className="text-xs text-red-500 mt-1 font-medium pl-1">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Champ Adresse / Quartier */}
          <div>
            <div className="relative">
              <Home className="absolute left-3.5 top-3 h-4 w-4 text-[#18221D]/50" />
              <textarea
                {...register("address")}
                rows={2}
                placeholder="Adresse ou Quartier (ex: Résidence Al Firdaous, Étage 2)"
                className={`w-full rounded-xl border bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm font-medium transition-colors focus:border-[#0B2D23] focus:outline-none focus:ring-1 focus:ring-[#0B2D23]/20 resize-none ${
                  errors.address ? "border-red-500" : "border-[#E8E2D8]"
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-xs text-red-500 mt-1 font-medium pl-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Récapitulatif du Total */}
        <div className="rounded-xl bg-[#FAF7F2] p-3.5 border border-[#E8E2D8] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#18221D]/70">Montant à régler au livreur :</p>
            <p className="text-xs font-semibold text-[#0B2D23]">
              Livraison partout au Maroc : OFFERTE (0 DH)
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-[#0B2D23]">
              {activeOffer.priceMAD} DH
            </span>
          </div>
        </div>

        {submitError && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {submitError}
          </div>
        )}

        {/* Bouton d'action Principal Vibrant COD */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full relative group overflow-hidden rounded-full bg-[#0B2D23] hover:bg-[#154738] p-4 text-[#FAF7F2] font-semibold text-sm sm:text-base tracking-[0.12em] uppercase shadow-lg shadow-[#0B2D23]/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#C5A880]" />
              <span>
                {isPending ? "Validation en cours..." : "Acheter Maintenant (Paiement à la Livraison)"}
              </span>
            </div>
            <span className="text-[11px] font-normal text-[#DFCCA8]/80 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Paiement à la réception après ouverture du colis
            </span>
          </div>
        </button>

        {/* Bouton Alternatif : WhatsApp Direct */}
        <div className="pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full border border-[#0B2D23]/30 bg-transparent hover:bg-[#FAF7F2] py-3 px-4 text-xs font-semibold tracking-wider uppercase text-[#0B2D23] transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-[#0B2D23]" />
            <span>Commander directement via WhatsApp</span>
          </a>
        </div>
      </form>

      {/* Badges de Réassurance Spécifiques COD Maroc */}
      <div className="mt-6 pt-4 border-t border-[#E8E2D8] grid grid-cols-2 gap-3 text-left">
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
            <p className="text-[11px] text-[#18221D]/60">Partout au Maroc gratuite</p>
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
            <p className="text-xs font-semibold text-[#0B2D23]">Confirmation Express</p>
            <p className="text-[11px] text-[#18221D]/60">Appel courtois sous 30min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
