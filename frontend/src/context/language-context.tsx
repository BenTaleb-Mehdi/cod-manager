"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    brand_subtitle: "ACCESSOIRES & BIJOUX EN ACIER INOXYDABLE HAUTE QUALITÉ",
    announcement: "LIVRAISON GRATUITE PARTOUT AU MAROC • PAIEMENT À LA LIVRAISON",
    announcement_sub: "الدفع بعد معاينة وفتح الطرد",
    nav_collections: "COLLECTIONS",
    nav_journal: "LE JOURNAL",
    nav_contact: "CONTACT",
    nav_search: "RECHERCHE",
    nav_advisor: "CONSEILLÈRE",
    nav_favorites: "FAVORIS",
    nav_cart: "PANIER",
    action_order: "Commander | طلبات",
    action_order_now: "Commander | طلب الآن",
    action_add_cart: "Ajouter au Panier | إلى السلة",
    action_view_cart: "Voir mon panier",
    quick_checkout: "Commander en 1 Clic",
    search_placeholder: "Rechercher un accessoire (collier émeraude, bague ajustable, jonc inox)...",
    search_title: "Rechercher un accessoire ou bijou",
    search_popular: "Recherches populaires :",
    search_no_results: "Aucun bijou ne correspond à votre recherche.",
    wishlist_title: "Mes Favoris",
    wishlist_title_ar: "قائمة المفضلة",
    wishlist_empty: "Votre liste de favoris est vide",
    wishlist_empty_desc: "Enregistrez vos créations coups de cœur pour les retrouver facilement.",
    wishlist_explore: "Découvrir nos créations",
    wishlist_view_page: "Voir toute ma liste de favoris",
    wishlist_clear: "Vider mes favoris",
    dock_home: "Accueil",
    dock_categories: "Catégories",
    dock_favorites: "Favoris",
    dock_cart: "Panier",
    dock_orders: "Commandes",
    whatsapp_advisor: "Conseillère WhatsApp",
    price_currency: "DH",
  },
  ar: {
    brand_subtitle: "إكسسوارات ومجوهرات إينوكس عالية الجودة للنساء والبنات",
    announcement: "توصيل مجاني لجميع مدن المغرب • الدفع عند الاستلام بعد معاينة الطرد",
    announcement_sub: "افتحي الطرد وعايني إكسسواراتك قبل الدفع للموزع",
    nav_collections: "التشكيلات",
    nav_journal: "المجلة",
    nav_contact: "اتصل بنا",
    nav_search: "بحث",
    nav_advisor: "مستشارة",
    nav_favorites: "المفضلة",
    nav_cart: "السلة",
    action_order: "طلب الآن | Commander",
    action_order_now: "طلب الآن | Commander",
    action_add_cart: "إضافة إلى السلة",
    action_view_cart: "معاينة السلة",
    quick_checkout: "طلب سريع بضغطة واحدة",
    search_placeholder: "ابحثي عن مجوهراتك المفضلة (خاتم، قلادة، سوار، ذهب 18K)...",
    search_title: "البحث في تشكيلات مِيراف",
    search_popular: "عمليات البحث الشائعة :",
    search_no_results: "لم يتم العثور على أي قطعة تطابق بحثك.",
    wishlist_title: "قائمة المفضلة",
    wishlist_title_ar: "Mes Favoris",
    wishlist_empty: "قائمة المفضلة فارغة حالياً",
    wishlist_empty_desc: "احفظي مجوهراتك المفضلة بالنقر على أيقونة القلب للعودة إليها لاحقاً.",
    wishlist_explore: "تصفحي التشكيلات الآن",
    wishlist_view_page: "عرض كل المفضلة",
    wishlist_clear: "مسح المفضلة",
    dock_home: "الرئيسية",
    dock_categories: "الأصناف",
    dock_favorites: "المفضلة",
    dock_cart: "السلة",
    dock_orders: "طلبات",
    whatsapp_advisor: "مستشارة واتساب",
    price_currency: "درهم",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("meraf_language") as Language;
      if (saved && (saved === "fr" || saved === "ar")) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("meraf_language", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "ar" : "fr");
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["fr"][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isArabic: language === "ar",
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
