import productsData from "@/data/products.json";
import citiesData from "@/data/morocco-cities.json";
import { Product, MoroccoCity } from "@/types/storefront";

export const BRAND_PHONE_WHATSAPP = "212718904631";
export const BRAND_NAME = "MÉRAF";
export const BRAND_SUBTITLE = "ACCESSORIES";
export const BRAND_SLOGAN = "Accessoires & bijoux en acier inoxydable haute qualité pour femmes et filles. Inaltérables, waterproof et ne noircissent jamais.";

// Réseaux Sociaux & Coordonnées Storefront
export const BRAND_INSTAGRAM = "https://www.instagram.com/meraf.ma";
export const BRAND_FACEBOOK = "https://web.facebook.com/profile.php?id=61595194649596";
export const BRAND_X = "https://x.com/MerafJewels";
export const BRAND_GMAIL = "https://www.tiktok.com/@meraf.ma";
export const BRAND_EMAIL = "meraf.officiel@gmail.com";

export const BRAND_SOCIALS = {
  instagram: BRAND_INSTAGRAM,
  facebook: BRAND_FACEBOOK,
  x: BRAND_X,
  gmail: `mailto:${BRAND_GMAIL}`,
  email: `mailto:${BRAND_EMAIL}`,
  whatsapp: `https://wa.me/${BRAND_PHONE_WHATSAPP}`,
};

export function matchesCategory(productCategory: string, categoryIdOrSlug: string): boolean {
  const p = (productCategory || "").toLowerCase().trim();
  const c = (categoryIdOrSlug || "").toLowerCase().trim();
  if (!p || !c) return false;
  if (p === c) return true;

  const aliases: Record<string, string[]> = {
    colliers: ["slasel", "collier", "colliers", "pendentif", "pendentifs", "necklace", "necklaces"],
    bagues: ["khowatem", "bague", "bagues", "solitaire", "solitaires", "ring", "rings"],
    bracelets: ["dmalj", "bracelet", "bracelets", "jonc", "joncs"],
    boucles: ["khwarsi", "boucle", "boucles", "boucles d'oreilles", "creoles", "créoles", "earrings", "earring"],
  };

  const matchedKey = Object.keys(aliases).find(
    (key) => key === c || aliases[key].includes(c)
  );

  if (matchedKey) {
    return p === matchedKey || aliases[matchedKey].includes(p);
  }

  return p.includes(c) || c.includes(p);
}

export function getProducts(): Product[] {
  const seenSlugs = new Set<string>();

  return (productsData as Product[]).map((raw, index) => {
    let slug = raw.slug || raw.id || `product-${index + 1}`;
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${raw.id || index + 1}`;
    }
    seenSlugs.add(slug);

    const price = raw.priceMAD || 199;
    const comparePrice = raw.compareAtPriceMAD || Math.round(price * 1.5);

    return {
      ...raw,
      slug,
      title: raw.title || "Bijou MÉRAF Tanger",
      category: raw.category || "colliers",
      categoryLabel: raw.categoryLabel || raw.category || "Joaillerie",
      priceMAD: price,
      compareAtPriceMAD: comparePrice,
      stock: raw.stock !== undefined ? raw.stock : 10,
      badge: raw.badge || "Nouveau ✦",
      rating: raw.rating || 5.0,
      reviewsCount: raw.reviewsCount || (raw.reviews ? raw.reviews.length : 12),
      shortDescription:
        raw.shortDescription ||
        "Bijou raffiné en acier inoxydable haute qualité 316L. Finition dorée inaltérable qui ne noircit jamais.",
      images: raw.images && raw.images.length > 0 ? raw.images : ["/images/products/collier/image-02.jpg"],
      highlights:
        raw.highlights && raw.highlights.length > 0
          ? raw.highlights
          : [
              "Acier Inoxydable 316L haute qualité garanti inaltérable",
              "Finition dorée éclatante haute tenue (ne noircit pas, ne rouille pas)",
              "100% Résistant à l'eau, à la douche, sueur et parfums (Waterproof)",
              "Hypoallergénique (Garanti sans nickel ni plomb, peaux sensibles)",
              "Garantie éclat & anti-rouille MÉRAF",
            ],
      offers:
        raw.offers && raw.offers.length > 0
          ? raw.offers
          : [
              {
                id: "pack-1",
                title: "1 Pièce (Offre Standard)",
                quantity: 1,
                priceMAD: price,
                compareAtPriceMAD: comparePrice,
                savingsMAD: comparePrice - price,
                badge: "Standard",
                isPopular: true,
              },
            ],
      reviews: raw.reviews || [],
    };
  });
}

export function getProductBySlug(slugOrId: string): Product | undefined {
  if (!slugOrId) return undefined;
  const products = getProducts();
  const target = decodeURIComponent(slugOrId).toLowerCase().trim();

  const bySlug = products.find((p) => p.slug.toLowerCase() === target);
  if (bySlug) return bySlug;

  const byId = products.find((p) => p.id.toLowerCase() === target);
  if (byId) return byId;

  return products.find(
    (p) => p.slug.toLowerCase().startsWith(target) || target.startsWith(p.slug.toLowerCase())
  );
}

export function getCities(): MoroccoCity[] {
  return citiesData as MoroccoCity[];
}

// Liste fixe et directe des catégories avec leurs images locales
const DIRECT_CATEGORIES = [
  {
    id: "colliers",
    slug: "colliers",
    name: "Colliers",
    moroccanLabel: "Colliers & Pendentifs",
    subtitle: "Colliers & Pendentifs",
    icon: "Sparkles",
    image: "/images/products/categories/cat1.jpeg",
  },
  {
    id: "bagues",
    slug: "bagues",
    name: "Bagues",
    moroccanLabel: "Bagues Ajustables & Solitaires",
    subtitle: "Bagues Ajustables & Solitaires",
    icon: "Gem",
    image: "/images/products/categories/cat2.jpeg",
  },
  {
    id: "bracelets",
    slug: "bracelets",
    name: "Bracelets",
    moroccanLabel: "Bracelets & Joncs",
    subtitle: "Bracelets & Joncs",
    icon: "CircleDot",
    image: "/images/products/categories/cat3.jpeg",
  },
  {
    id: "boucles",
    slug: "boucles",
    name: "Boucles d'oreilles",
    moroccanLabel: "Créoles & Boucles d'oreilles",
    subtitle: "Créoles & Boucles d'oreilles",
    icon: "Heart",
    image: "/images/products/categories/cat4.jpeg",
  },
];

/**
 * Retourne directement la liste des catégories avec le nombre d'articles associés.
 */
export function getCategories() {
  const products = getProducts();

  return DIRECT_CATEGORIES.map((cat) => {
    const count = products.filter((p) =>
      matchesCategory(p.category || p.categoryLabel || "", cat.slug)
    ).length;

    return {
      ...cat,
      count,
    };
  });
}

/**
 * Génère le lien WhatsApp pré-rempli pour la commande ou le support client
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
  let message = `Bonjour Maison MÉRAF ! 👋\n`;

  if (params.orderId) {
    message += `Je souhaite confirmer ma commande joaillerie :\n`;
    message += `🏷️ *Réf Commande :* ${params.orderId}\n`;
  } else if (params.productTitle) {
    message += `Je souhaite commander ce bijou svp :\n`;
  } else {
    message += `Je souhaite des informations sur les collections joaillerie MÉRAF svp.\n`;
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
    message += `📝 *Note :* ${params.notes}\n`;
  }
  if (params.productUrl) {
    message += `🔗 *Lien produit :* ${params.productUrl}\n`;
  }

  message += `\nMerci pour votre confirmation. À bientôt !`;

  return `https://wa.me/${BRAND_PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}