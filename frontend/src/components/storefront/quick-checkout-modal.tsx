"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle2,
  Lock,
  Truck,
  ShieldCheck,
  Sparkles,
  Phone,
  MapPin,
  User,
  Home,
  MessageCircle,
  Tag,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Product, ProductOffer } from "@/types/storefront";
import { getCities, buildWhatsAppOrderLink } from "@/lib/storefront-data";
import { useCart } from "@/context/cart-context";
import { CityCombobox } from "./city-combobox";

interface QuickCheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCheckoutModal({
  product,
  isOpen,
  onClose,
}: QuickCheckoutModalProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const [selectedPackId, setSelectedPackId] = useState<string>("pack-1");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const cities = useMemo(() => getCities(), []);

  // Sync selected pack when product opens
  useEffect(() => {
    if (product?.offers && product.offers.length > 0) {
      const popular = product.offers.find((o) => o.isPopular);
      setSelectedPackId(popular ? popular.id : product.offers[0].id);
    }
    setFormError(null);
  }, [product, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
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

  if (!isOpen || !product) return null;

  const activeOffer: ProductOffer =
    product.offers.find((o) => o.id === selectedPackId) ||
    product.offers[0] || {
      id: "pack-1",
      title: "1 Pièce",
      quantity: 1,
      priceMAD: product.priceMAD,
      compareAtPriceMAD: product.compareAtPriceMAD,
      savingsMAD: product.compareAtPriceMAD - product.priceMAD,
      badge: "Livraison Gratuite",
    };

  // Live formatting for Moroccan phone (06 / 07 XX XX XX XX)
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setRawPhone(digitsOnly);

    let formatted = digitsOnly;
    if (digitsOnly.length > 2 && digitsOnly.length <= 4) {
      formatted = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2)}`;
    } else if (digitsOnly.length > 4 && digitsOnly.length <= 6) {
      formatted = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 4)} ${digitsOnly.slice(4)}`;
    } else if (digitsOnly.length > 6 && digitsOnly.length <= 8) {
      formatted = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 4)} ${digitsOnly.slice(4, 6)} ${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length > 8) {
      formatted = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 4)} ${digitsOnly.slice(4, 6)} ${digitsOnly.slice(6, 8)} ${digitsOnly.slice(8, 10)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError("Veuillez saisir votre nom et prénom complet.");
      return;
    }

    const moroccanPhoneRegex = /^(?:(?:\+?212\s?|0)[67]\d{8})$/;
    if (!moroccanPhoneRegex.test(rawPhone)) {
      setFormError("Numéro de téléphone invalide (doit commencer par 06... ou 07...).");
      return;
    }

    if (!city.trim()) {
      setFormError("Veuillez choisir votre ville de livraison.");
      return;
    }

    if (!address.trim() || address.trim().length < 3) {
      setFormError("Veuillez indiquer votre quartier ou adresse.");
      return;
    }

    startTransition(async () => {
      try {
        const orderId = `MORLY-${Date.now().toString().slice(-6)}`;
        const orderPayload = {
          orderId,
          customerName: fullName.trim(),
          phone: rawPhone,
          city: city.trim(),
          address: `${address.trim()} (Offre: ${activeOffer.title})`,
          notes: notes.trim(),
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
          window.localStorage.setItem("morly_last_order", JSON.stringify(orderPayload));
        }

        try {
          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: fullName.trim(),
              phone: rawPhone,
              city: city.trim(),
              address: `${address.trim()} (Offre: ${activeOffer.title})`,
              shippingNote: notes.trim(),
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
          // Fallback silencieux : commande enregistrée localement
        }

        onClose();

        const queryParams = new URLSearchParams({
          orderId,
          name: fullName.trim(),
          city: city.trim(),
          product: product.title,
          pack: activeOffer.title,
          total: String(activeOffer.priceMAD),
        });

        router.push(`/merci?${queryParams.toString()}`);
      } catch (err) {
        console.error("Quick checkout error:", err);
        setFormError("Une erreur est survenue. Veuillez réessayer ou commander par WhatsApp.");
      }
    });
  };

  const whatsappUrl = buildWhatsAppOrderLink({
    productTitle: product.title,
    packName: activeOffer.title,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#E8E2D8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B2D23] text-[#FAF7F2] px-5 py-4 flex items-center justify-between border-b border-[#C5A880]/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#C5A880] animate-pulse" />
            <h3 className="font-serif text-base sm:text-lg font-normal tracking-wide text-white">
              Commande Express 1-Clic
            </h3>
            <span className="text-[10px] bg-[#C5A880] text-[#0B2D23] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              COD Maroc
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="p-1 rounded-full text-[#FAF7F2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 text-xs">
          {/* Product Summary Preview */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E2D8]">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A8875A] block">
                {product.categoryLabel || product.category}
              </span>
              <h4 className="font-serif text-sm font-medium text-[#0B2D23] truncate">
                {product.title}
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-bold text-base text-[#0B2D23]">
                  {activeOffer.priceMAD} DH
                </span>
                <span className="text-[11px] text-[#18221D]/40 line-through">
                  {activeOffer.compareAtPriceMAD} DH
                </span>
                <span className="text-[10px] font-bold text-[#0B2D23] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E8E2D8]">
                  🚚 Livr. 0 DH
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Offer Selector if multiple offers */}
            {product.offers && product.offers.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0B2D23] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Choisissez votre formule avantage :</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.offers.map((offer) => {
                    const isSelected = selectedPackId === offer.id;
                    return (
                      <button
                        key={offer.id}
                        type="button"
                        onClick={() => setSelectedPackId(offer.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[#0B2D23] bg-[#0B2D23]/5 ring-1 ring-[#0B2D23]"
                            : "border-[#E8E2D8] bg-white hover:border-[#C5A880]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-[11px] text-[#0B2D23]">
                            {offer.title}
                          </span>
                          {offer.badge && (
                            <span className="text-[9px] font-bold bg-[#0B2D23] text-[#FAF7F2] px-1.5 py-0.5 rounded-full">
                              {offer.isPopular ? "🔥 Promo" : "Offert"}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-sm font-serif font-bold text-[#0B2D23]">
                            {offer.priceMAD} DH
                          </span>
                          {offer.savingsMAD > 0 && (
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              Éco. {offer.savingsMAD} DH
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {/* Client Inputs */}
            <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-[#E8E2D8]">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0B2D23] mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Nom & Prénom</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex. Salma Bennani"
                  className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#18221D] focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all placeholder:text-[#18221D]/40"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0B2D23] mb-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Numéro de Téléphone (WhatsApp)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-[#18221D]/60 font-semibold">
                    🇲🇦 +212
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneInput}
                    placeholder="06 XX XX XX XX"
                    className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] pl-18 pr-3 py-2 text-xs text-[#18221D] font-mono tracking-wide focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all placeholder:text-[#18221D]/40"
                  />
                </div>
                <p className="text-[10px] text-[#18221D]/55 mt-0.5">
                  Le livreur vous contactera sur ce numéro avant la livraison.
                </p>
              </div>

              {/* City Combobox */}
              <CityCombobox
                label="Ville de livraison"
                value={city}
                onChange={(newCity) => setCity(newCity)}
              />

              {/* Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0B2D23] mb-1 flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Quartier ou Adresse</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex. Maarif, Résidence Al Yassmine, 3ème étage"
                  className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#18221D] focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all placeholder:text-[#18221D]/40"
                />
              </div>
            </div>

            {/* Total Recap */}
            <div className="rounded-2xl bg-white p-3 border border-[#E8E2D8] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#18221D]/70 font-medium">À payer à la livraison :</p>
                <p className="text-[11px] text-emerald-800 font-bold">
                  🚚 Livraison GRATUITE partout au Maroc
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-[#0B2D23]">
                  {activeOffer.priceMAD} DH
                </span>
              </div>
            </div>

            {/* Submit Primary Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2D23] via-[#123E32] to-[#0B2D23] hover:from-[#123E32] hover:to-[#1a5544] text-[#FAF7F2] py-3.5 px-4 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#0B2D23]/25 border border-[#C5A880]/30 active:scale-98 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-75"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#C5A880] shrink-0" />
                <span>
                  {isPending ? "Validation..." : `Confirmer ma Commande (${activeOffer.priceMAD} DH)`}
                </span>
              </div>
              <span className="text-[10px] font-normal text-[#DFCCA8]/90 flex items-center gap-1">
                <Lock className="h-3 w-3 text-[#C5A880] shrink-0" /> Paiement à la réception après ouverture du colis
              </span>
            </button>

            {/* Actions Secondaires : Ajouter au Panier & WhatsApp */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  addToCart(product, activeOffer, 1);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#0B2D23] bg-white hover:bg-[#FAF7F2] py-2.5 px-2 text-[11px] font-bold tracking-wider uppercase text-[#0B2D23] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-[#C5A880]" />
                <span>+ Panier</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0B2D23]/30 bg-[#FAF7F2] hover:bg-white py-2.5 px-2 text-[11px] font-semibold tracking-wider uppercase text-[#0B2D23] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#0B2D23]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Guarantees */}
            <div className="pt-2 border-t border-[#E8E2D8] grid grid-cols-2 gap-2 text-[10px] text-[#18221D]/70">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0B2D23] shrink-0" />
                <span>Ouvrez le colis avant de payer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-[#0B2D23] shrink-0" />
                <span>Livraison 24h/48h gratuite</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
