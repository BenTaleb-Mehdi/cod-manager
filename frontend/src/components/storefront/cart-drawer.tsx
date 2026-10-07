"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Lock,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Phone,
  MapPin,
  User,
  Home,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { buildWhatsAppOrderLink } from "@/lib/storefront-data";
import { CityCombobox } from "./city-combobox";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalMAD,
    totalItems,
  } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [rawPhone, setRawPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Phone input formatting
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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) return;

    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError("Veuillez saisir votre nom et prénom complet.");
      return;
    }

    const moroccanPhoneRegex = /^(?:(?:\+?212\s?|0)[67]\d{8})$/;
    if (!moroccanPhoneRegex.test(rawPhone)) {
      setFormError("Numéro de téléphone marocain invalide (doit commencer par 06... ou 07...).");
      return;
    }

    if (!city.trim()) {
      setFormError("Veuillez sélectionner votre ville.");
      return;
    }

    if (!address.trim() || address.trim().length < 3) {
      setFormError("Veuillez préciser votre adresse ou quartier.");
      return;
    }

    startTransition(async () => {
      try {
        const orderId = `MERAF-${Date.now().toString().slice(-6)}`;
        const productsSummary = items
          .map((i) => `${i.product.title} (${i.offer.title} x${i.quantity})`)
          .join(", ");

        const orderPayload = {
          orderId,
          customerName: fullName.trim(),
          phone: rawPhone,
          city: city.trim(),
          address: `${address.trim()} (Panier: ${productsSummary})`,
          notes: `Commande multi-produits (${totalItems} article(s))`,
          productTitle: productsSummary,
          productId: items[0]?.product.id || "multi",
          productSlug: items[0]?.product.slug || "",
          productImage: items[0]?.product.images[0] || "",
          packTitle: `${totalItems} article(s)`,
          quantity: totalItems,
          totalMAD,
          deliveryFee: 0,
          paymentMethod: "COD (Cash on Delivery)",
          createdAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          window.localStorage.setItem("meraf_last_order", JSON.stringify(orderPayload));
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
              address: `${address.trim()} (Panier: ${productsSummary})`,
              shippingNote: `Commande de ${totalItems} article(s)`,
              items: items.map((i) => ({
                productId: i.product.id,
                quantity: i.quantity,
                price: i.offer.priceMAD,
              })),
            }),
          });
        } catch {
          // Fallback silencieux : commande enregistrée localement
        }

        clearCart();
        closeCart();

        const queryParams = new URLSearchParams({
          orderId,
          name: fullName.trim(),
          phone: rawPhone,
          city: city.trim(),
          address: address.trim(),
          product: `Votre Panier (${totalItems} articles: ${productsSummary})`,
          pack: `${totalItems} pièces`,
          total: String(totalMAD),
        });

        router.push(`/merci?${queryParams.toString()}`);
      } catch (err) {
        console.error("Cart checkout error:", err);
        setFormError("Une erreur est survenue lors de la commande. Veuillez réessayer.");
      }
    });
  };

  const whatsappCartUrl = buildWhatsAppOrderLink({
    productTitle:
      items.length > 0
        ? items.map((i) => `${i.product.title} (x${i.quantity})`).join(", ")
        : "Articles Panier MÉRAF",
    priceMAD: totalMAD,
    packName: `${totalItems} article(s)`,
    customerName: fullName.trim() || undefined,
    phone: rawPhone || undefined,
    city: city.trim() || undefined,
    address: address.trim() || undefined,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Cart Drawer from RIGHT */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FAF7F2] border-l border-[#E8E2D8] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D8] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#0B2D23] flex items-center justify-center text-[#C5A880]">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-normal text-[#0B2D23]">
                Mon Panier Joaillier
              </h3>
              <p className="text-[11px] text-[#18221D]/60 font-medium">
                {totalItems === 0
                  ? "Votre panier est vide"
                  : `${totalItems} création${totalItems > 1 ? "s" : ""} sélectionnée${totalItems > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="p-2 rounded-full text-[#18221D] hover:bg-[#FAF7F2] hover:text-[#0B2D23] active:scale-95 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-[#0B2D23] text-[#FAF7F2] py-2 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-1.5 shrink-0">
          <Truck className="h-3.5 w-3.5 text-[#C5A880]" />
          <span>🚚 Livraison GRATUITE partout au Maroc activée (0 DH)</span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            /* Empty State */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[#C5A880] shadow-sm">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-[#0B2D23]">
                  Votre panier est vide
                </h4>
                <p className="text-xs text-[#18221D]/65 max-w-xs">
                  Explorez nos collections d&apos;exception en or 18k et acier 316L inaltérable.
                </p>
              </div>

              <Link
                href="/collections"
                onClick={closeCart}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase shadow-md active:scale-95 transition-all"
              >
                <span>Découvrir les bijoux</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C5A880]" />
              </Link>
            </div>
          ) : (
            /* Item List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center gap-3 relative group"
                >
                  {/* Photo */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E2D8]">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-serif text-xs sm:text-sm font-medium text-[#0B2D23] hover:text-[#9F8259] transition-colors truncate block"
                      >
                        {item.product.title}
                      </Link>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Supprimer du panier"
                        className="text-[#18221D]/40 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-[#A8875A] font-semibold">
                      {item.offer.title}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      {/* Price */}
                      <span className="font-serif font-bold text-sm text-[#0B2D23]">
                        {item.offer.priceMAD * item.quantity} DH
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuer"
                          className="text-[#18221D]/70 hover:text-[#0B2D23] p-0.5"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold text-[#0B2D23] min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Augmenter"
                          className="text-[#18221D]/70 hover:text-[#0B2D23] p-0.5"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick COD Form inside Cart Drawer when showCheckoutForm is true */}
          {items.length > 0 && showCheckoutForm && (
            <div className="mt-4 p-4 rounded-2xl bg-white border border-[#0B2D23]/30 shadow-md space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#0B2D23] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Vos coordonnées de livraison :</span>
                </span>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-[11px] text-[#18221D]/60 hover:text-[#0B2D23]"
                >
                  Fermer
                </button>
              </div>

              {formError && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#0B2D23] mb-0.5">
                    Nom et Prénom :
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex. Kenza Mansouri"
                    className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#18221D] focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#0B2D23] mb-0.5">
                    Téléphone (06 / 07) :
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
                      className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] pl-18 pr-3 py-2 text-xs text-[#18221D] font-mono focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <CityCombobox
                  label="Ville de livraison :"
                  value={city}
                  onChange={(newCity) => setCity(newCity)}
                />

                <div>
                  <label className="block text-[11px] font-semibold text-[#0B2D23] mb-0.5">
                    Quartier ou Adresse :
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex. Bourgogne, Rue 12, Apt 4"
                    className="w-full rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#18221D] focus:border-[#0B2D23] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-2xl bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] py-3 px-4 font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#C5A880]" />
                  <span>
                    {isPending ? "Validation..." : `Confirmer ma Commande (${totalMAD} DH)`}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer / Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E8E2D8] bg-white space-y-3 shrink-0">
            {/* Total Recap */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#18221D]/70">
                <span>Sous-total ({totalItems} articles) :</span>
                <span className="font-semibold text-[#18221D]">{totalMAD} DH</span>
              </div>
              <div className="flex justify-between text-[#18221D]/70">
                <span>Livraison partout au Maroc :</span>
                <span className="font-bold text-emerald-800">GRATUITE (0 DH)</span>
              </div>
              <div className="pt-2 border-t border-[#E8E2D8] flex justify-between items-baseline">
                <span className="font-serif font-bold text-sm text-[#0B2D23]">
                  Total à régler au livreur :
                </span>
                <span className="font-serif font-bold text-2xl text-[#0B2D23]">
                  {totalMAD} DH
                </span>
              </div>
            </div>

            {/* Direct Checkout Button */}
            {!showCheckoutForm ? (
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2D23] via-[#123E32] to-[#0B2D23] hover:from-[#123E32] hover:to-[#1a5544] text-[#FAF7F2] py-3.5 px-4 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#0B2D23]/25 border border-[#C5A880]/30 active:scale-98 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#C5A880]" />
                  <span>Passer la Commande ({totalMAD} DH)</span>
                </div>
                <span className="text-[10px] font-normal text-[#DFCCA8]/90 flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5 text-[#C5A880]" /> Paiement à la réception après ouverture du colis
                </span>
              </button>
            ) : null}

            {/* Continuer mes achats & WhatsApp */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={closeCart}
                className="flex-1 py-2 text-center text-xs font-semibold text-[#0B2D23] hover:underline cursor-pointer"
              >
                + Ajouter d&apos;autres bijoux
              </button>
              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0B2D23]/30 bg-[#FAF7F2] hover:bg-white py-2 px-3 text-[11px] font-semibold tracking-wider uppercase text-[#0B2D23] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#0B2D23]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Reassurance */}
            <div className="pt-1 flex items-center justify-center gap-4 text-[10px] text-[#18221D]/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#0B2D23]" /> Paiement COD
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-[#0B2D23]" /> Livr. 24/48h
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#C5A880]" /> Acier 316L
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
