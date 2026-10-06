import productsData from "@/data/products.json";
import citiesData from "@/data/morocco-cities.json";
import { Product, MoroccoCity } from "@/types/storefront";

export const BRAND_PHONE_WHATSAPP = "212660123456";
export const BRAND_NAME = "MÉRAF";
export const BRAND_SUBTITLE = "JEWELRY";
export const BRAND_SLOGAN = "Exquisite designs, ethically crafted to celebrate every moment that matters.";

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
      image: "https://images.unsplash.com/photo-1611591475871-332924376cbb?auto=format&fit=crop&w=600&q=80",
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
 * Génère le lien WhatsApp pré-rempli pour la commande ou le support client
 */
export function buildWhatsAppOrderLink(params: {
  productTitle?: string;
  priceMAD?: number;
  packName?: string;
  productUrl?: string;
  customerName?: string;
  city?: string;
}): string {
  let message = `Salam Maison MÉRAF! 👋\n`;
  if (params.productTitle) {
    message += `Bghit ncommander had le bijou svp :\n`;
    message += `✨ *${params.productTitle}*\n`;
    if (params.packName) message += `📦 Offre : *${params.packName}*\n`;
    if (params.priceMAD) message += `💰 Prix : *${params.priceMAD} DH* (Paiement à la livraison)\n`;
    if (params.productUrl) message += `🔗 Lien : ${params.productUrl}\n`;
  } else {
    message += `Bghit des informations 3la les collections joaillerie MÉRAF svp.\n`;
  }
  message += `\nMerhba b confirmation dialkoum !`;

  return `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
