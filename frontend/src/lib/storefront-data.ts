import productsData from "@/data/products.json";
import citiesData from "@/data/morocco-cities.json";
import { Product, MoroccoCity } from "@/types/storefront";

export const BRAND_PHONE_WHATSAPP = "212718904631";
export const BRAND_NAME = "MÉRAF";
export const BRAND_SUBTITLE = "JEWELRY";
export const BRAND_SLOGAN = "Exquisite designs, ethically crafted to celebrate every moment that matters.";

// Réseaux Sociaux & Coordonnées Storefront (Modifiables facilement)
export const BRAND_INSTAGRAM = "https://www.instagram.com/meraf.jewelry";
export const BRAND_FACEBOOK = "https://www.facebook.com/meraf.jewelry";
export const BRAND_X = "https://x.com/meraf_jewelry";
export const BRAND_GMAIL = "meraf.jewelry@gmail.com";
export const BRAND_EMAIL = "meraf.jewelry@gmail.com";

export const BRAND_SOCIALS = {
  instagram: BRAND_INSTAGRAM,
  facebook: BRAND_FACEBOOK,
  x: BRAND_X,
  gmail: `mailto:${BRAND_GMAIL}`,
  email: `mailto:${BRAND_EMAIL}`,
  whatsapp: `https://wa.me/${BRAND_PHONE_WHATSAPP}`,
};

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.slug === slug);
}

export function getCities(): MoroccoCity[] {
  return citiesData as MoroccoCity[];
}

export function getCategories() {
  const products = getProducts();
  const categoriesMap = [
    {
      id: "Slasel",
      name: "Necklaces",
      moroccanLabel: "Slasel (Colliers)",
      subtitle: "Colliers & Pendentifs",
      slug: "slasel",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Khowatem",
      name: "Rings",
      moroccanLabel: "Khowatem (Bagues)",
      subtitle: "Bagues Ajustables & Solitaires",
      slug: "khowatem",
      icon: "Gem",
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Dmalj",
      name: "Bracelets",
      moroccanLabel: "Dmalj (Bracelets)",
      subtitle: "Bracelets & Joncs",
      slug: "dmalj",
      icon: "CircleDot",
      image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Khwarsi",
      name: "Earrings",
      moroccanLabel: "Khwarsi (Boucles)",
      subtitle: "Créoles & Boucles d'oreilles",
      slug: "khwarsi",
      icon: "Heart",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return categoriesMap.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.id).length,
  }));
}

/**
 * Génère le lien WhatsApp pré-rempli pour la commande ou le support client avec tous les détails
 */
export function buildWhatsAppOrderLink(params: {
  orderId?: string;
  productTitle?: string;
  priceMAD?: number;
  packName?: string;
  productUrl?: string;
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
}): string {
  let message = `Salam Maison MÉRAF ! 👋\n`;

  if (params.orderId) {
    message += `Bghit n'confirmer ma commande joaillerie :\n`;
    message += `🏷️ *Réf Commande :* ${params.orderId}\n`;
  } else if (params.productTitle) {
    message += `Bghit n'commander had le bijou svp :\n`;
  } else {
    message += `Bghit des informations 3la les collections joaillerie MÉRAF svp.\n`;
  }

  if (params.productTitle) {
    message += `✨ *Création :* ${params.productTitle}\n`;
  }
  if (params.packName) {
    message += `📦 *Offre :* ${params.packName}\n`;
  }
  if (params.priceMAD !== undefined) {
    message += `💰 *Montant :* ${params.priceMAD} DH (Paiement à la livraison)\n`;
  }
  if (params.customerName) {
    message += `👤 *Nom complet :* ${params.customerName}\n`;
  }
  if (params.phone) {
    message += `📞 *Téléphone :* ${params.phone}\n`;
  }
  if (params.city) {
    message += `📍 *Ville :* ${params.city}\n`;
  }
  if (params.address) {
    message += `🏠 *Adresse de livraison :* ${params.address}\n`;
  }
  if (params.notes) {
    message += `📝 *Note livraison :* ${params.notes}\n`;
  }
  if (params.productUrl) {
    message += `🔗 *Lien produit :* ${params.productUrl}\n`;
  }

  message += `\nMerhba b confirmation dialkoum ! Choukran.`;

  return `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

