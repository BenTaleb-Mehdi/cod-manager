"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { MapPin, Search, ChevronDown, Check, Sparkles } from "lucide-react";
import { getCities } from "@/lib/storefront-data";
import { MoroccoCity } from "@/types/storefront";

interface CityComboboxProps {
  value: string;
  onChange: (cityName: string) => void;
  error?: string;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function CityCombobox({
  value,
  onChange,
  error,
  className = "",
  label,
  placeholder = "Sélectionnez ou recherchez votre ville...",
}: CityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cities = useMemo(() => getCities(), []);

  // Fermer lors d'un clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedCity = useMemo(() => {
    return cities.find((c) => c.name.toLowerCase() === value.toLowerCase()) || null;
  }, [cities, value]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [cities, search]);

  const popularCities = useMemo(() => {
    return cities.filter((c) => c.popular).slice(0, 5);
  }, [cities]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-[#0B2D23] mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#C5A880]" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-emerald-800 font-semibold">
            Livraison Gratuite 0 DH
          </span>
        </label>
      )}

      {/* Bouton Trigger du Combobox */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`w-full rounded-xl border bg-[#FAF7F2] py-2.5 pl-10 pr-3.5 text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer focus:outline-none ${
          error
            ? "border-red-500 ring-1 ring-red-500/20"
            : isOpen
            ? "border-[#0B2D23] ring-2 ring-[#0B2D23]/15 bg-white"
            : "border-[#E8E2D8] hover:border-[#C5A880]"
        }`}
      >
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C5A880] shrink-0" />

        <div className="flex items-center gap-2 truncate flex-1 pr-2">
          {value ? (
            <span className="font-semibold text-[#0B2D23] truncate">{value}</span>
          ) : (
            <span className="text-[#18221D]/50 text-xs">{placeholder}</span>
          )}

          {selectedCity && (
            <span className="hidden sm:inline-block text-[10px] font-bold text-[#0B2D23] bg-white border border-[#E8E2D8] px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
              ⚡ {selectedCity.deliveryTime}
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-[#18221D]/60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#0B2D23]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Combobox */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-[#E8E2D8] bg-[#FAF7F2] shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
          {/* Champ de recherche avec icône */}
          <div className="relative mb-2 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#18221D]/50" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tapez le nom de votre ville (ex. Casablanca, Fès...)"
              className="w-full rounded-xl border border-[#E8E2D8] bg-white py-2 pl-9 pr-3 text-xs text-[#18221D] font-medium placeholder:text-[#18221D]/40 focus:outline-none focus:border-[#0B2D23] focus:ring-1 focus:ring-[#0B2D23]/20"
            />
          </div>

          {/* Raccourcis Villes Populaires quand pas de recherche active */}
          {!search.trim() && (
            <div className="mb-2 shrink-0 border-b border-[#E8E2D8] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F8259] block mb-1.5 px-1">
                Villes fréquentes :
              </span>
              <div className="flex flex-wrap gap-1">
                {popularCities.map((pc) => (
                  <button
                    key={pc.id}
                    type="button"
                    onClick={() => handleSelect(pc.name)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      value.toLowerCase() === pc.name.toLowerCase()
                        ? "bg-[#0B2D23] text-white shadow-xs"
                        : "bg-white border border-[#E8E2D8] text-[#18221D] hover:border-[#0B2D23] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {pc.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Liste des villes filtrées */}
          <div className="overflow-y-auto space-y-0.5 flex-1 pr-1 max-h-48">
            {filteredCities.map((c) => {
              const isSelected = value.toLowerCase() === c.name.toLowerCase();
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c.name)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#0B2D23] text-[#FAF7F2] font-semibold shadow-xs"
                      : "hover:bg-white text-[#18221D]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880] shrink-0" />
                    )}
                    <span className="truncate">{c.name}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      isSelected
                        ? "bg-white/20 text-[#FAF7F2]"
                        : "bg-white border border-[#E8E2D8] text-[#0B2D23]"
                    }`}
                  >
                    {c.deliveryTime} • Gratuit
                  </span>
                </div>
              );
            })}

            {/* Option pour ville personnalisée si non trouvée */}
            {filteredCities.length === 0 && search.trim() && (
              <div
                onClick={() => handleSelect(search.trim())}
                className="p-3 text-center rounded-xl bg-white border border-[#C5A880] text-xs cursor-pointer hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5 text-[#0B2D23] font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Utiliser &quot;{search.trim()}&quot;</span>
                </div>
                <p className="text-[10px] text-[#18221D]/60 mt-0.5">
                  Notre transporteur livre toutes les localités et douars du Maroc sous 24h-48h.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
