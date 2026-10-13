"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, MessageCircle, Phone, Sparkles } from "lucide-react";
import { BRAND_PHONE_WHATSAPP } from "@/lib/storefront-data";

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Casablanca",
    orderNumber: "",
    subject: "Conseil produit & taille",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate instant pleasant response
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    const whatsappFollowup = `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(
      `Salam Maison MÉRAF! Je viens d'envoyer un message via le site web.\nNom: ${formData.fullName}\nTéléphone: ${formData.phone}\nSujet: ${formData.subject}\nMessage: ${formData.message}`
    )}`;

    return (
      <div className="rounded-3xl border border-[#C5A880]/50 bg-[#FDFCF9] p-8 sm:p-12 text-center space-y-6 shadow-xl animate-in fade-in duration-300">
        <div className="h-16 w-16 rounded-full bg-[#0B2D23] text-[#C5A880] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="h-8 w-8 text-[#C5A880]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
            DEMANDE BIEN REÇUE
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0B2D23]">
            Merci, {formData.fullName} !
          </h3>
          <p className="text-xs sm:text-sm text-[#18221D]/75 max-w-md mx-auto leading-relaxed">
            Votre message a été transmis à notre service conciergerie. Une conseillère joaillière prendra contact avec vous par WhatsApp ou téléphone sous 2 heures ouvrées.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappFollowup}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="h-4 w-4 text-[#C5A880]" />
            <span>Accélérer sur WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                fullName: "",
                phone: "",
                email: "",
                city: "Casablanca",
                orderNumber: "",
                subject: "Conseil produit & taille",
                message: "",
              });
            }}
            className="w-full sm:w-auto rounded-full border border-[#0B2D23]/30 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-[#0B2D23] hover:bg-[#F4EFEA] transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#E8E2D8] bg-[#FDFCF9] p-6 sm:p-10 shadow-sm space-y-6"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase block">
          FORMULAIRE CONCIERGERIE
        </span>
        <h3 className="font-serif text-2xl text-[#0B2D23]">
          Écrivez-nous directement
        </h3>
        <p className="text-xs text-[#18221D]/70">
          Remplissez vos coordonnées ci-dessous pour une prise en charge rapide et personnalisée.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            Nom et Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Ex: Fatima Zahra Bennani"
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Moroccan Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            Numéro de Téléphone (WhatsApp) <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="06 12 34 56 78"
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            Adresse Email (Optionnel)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="votre.email@domaine.com"
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Moroccan City */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            Ville <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 focus:outline-none focus:border-[#C5A880]"
          >
            <option value="Casablanca">Casablanca</option>
            <option value="Rabat">Rabat</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Fès">Fès</option>
            <option value="Tanger">Tanger</option>
            <option value="Agadir">Agadir</option>
            <option value="Meknès">Meknès</option>
            <option value="Oujda">Oujda</option>
            <option value="Kénitra">Kénitra</option>
            <option value="Tétouan">Tétouan</option>
            <option value="Autre Ville">Autre Ville du Maroc</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            Objet de votre message
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 focus:outline-none focus:border-[#C5A880]"
          >
            <option value="Conseil produit & taille">Conseil produit ou choix de taille</option>
            <option value="Suivi de commande">Suivi de livraison en cours</option>
            <option value="Demande d'échange">Demande d&apos;échange ou retour</option>
            <option value="Coffret cadeau & sur mesure">Coffret cadeau personnalisé</option>
            <option value="Autre question">Autre question générale</option>
          </select>
        </div>

        {/* Order number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
            N° de commande (si applicable)
          </label>
          <input
            type="text"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            placeholder="Ex: CMD-8492"
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] px-4 py-3 placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#0B2D23] uppercase tracking-wider">
          Votre Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Dites-nous comment nous pouvons vous aider..."
          className="w-full rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#0B2D23] p-4 placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#C5A880]"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0B2D23] hover:bg-[#154738] text-[#FAF7F2] py-4 text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 text-[#C5A880]" />
              <span>ENVOYER LE MESSAGE</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
