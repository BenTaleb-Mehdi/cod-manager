import productsData from "@/data/products.json";
import citiesData from "@/data/morocco-cities.json";
import { Product, MoroccoCity } from "@/types/storefront";

export const BRAND_PHONE_WHATSAPP = "212718904631";
export const BRAND_NAME = "MÉRAF";
export const BRAND_SUBTITLE = "ACCESSORIES";
export const BRAND_SLOGAN = "Accessoires & bijoux en acier inoxydable haute qualité pour femmes et filles. Inaltérables, waterproof et ne noircissent jamais.";

// Réseaux Sociaux & Coordonnées Storefront (Modifiables facilement)
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
    slasel: ["slasel", "collier", "colliers", "pendentif", "pendentifs", "necklace", "necklaces"],
    khowatem: ["khowatem", "bague", "bagues", "solitaire", "solitaires", "ring", "rings"],
    dmalj: ["dmalj", "bracelet", "bracelets", "jonc", "joncs"],
    khwarsi: ["khwarsi", "boucle", "boucles", "boucles d'oreilles", "creoles", "créoles", "earrings", "earring"],
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
    // Garantir un slug unique même si l'utilisateur l'oublie ou le duplique
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
      category: raw.category || "Slasel",
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

  // 1. Recherche par slug exact
  const bySlug = products.find((p) => p.slug.toLowerCase() === target);
  if (bySlug) return bySlug;

  // 2. Recherche par ID (ex: meraf-slasel-02)
  const byId = products.find((p) => p.id.toLowerCase() === target);
  if (byId) return byId;

  // 3. Fallback partiel si slug suffixé automatiquement
  return products.find(
    (p) => p.slug.toLowerCase().startsWith(target) || target.startsWith(p.slug.toLowerCase())
  );
}

export function getCities(): MoroccoCity[] {
  return citiesData as MoroccoCity[];
}

// Metadata enrichment table — add an entry here to customize icon/image/label
// for any category value used in products.json.
// Keys are the exact category strings (case-insensitive match).
const CATEGORY_META: Record<
  string,
  {
    name: string;
    moroccanLabel: string;
    subtitle: string;
    slug: string;
    icon: string;
    image: string;
  }
> = {
  // ── Colliers ────────────────────────────────────────────────────────────
  colliers: {
    name: "Colliers",
    moroccanLabel: "Colliers & Pendentifs",
    subtitle: "Colliers & Pendentifs",
    slug: "colliers",
    icon: "Sparkles",
    image: "/images/products/categories/cat1.jpeg",
  },

  // ── Bagues ──────────────────────────────────────────────────────────────
  bagues: {
    name: "Bagues",
    moroccanLabel: "Bagues Ajustables & Solitaires",
    subtitle: "Bagues Ajustables & Solitaires",
    slug: "bagues",
    icon: "Gem",
    image: "/images/products/categories/cat2.jpg",
  },
 
  // ── Bracelets ───────────────────────────────────────────────────────────
  bracelets: {
    name: "Bracelets",
    moroccanLabel: "Bracelets & Joncs",
    subtitle: "Bracelets & Joncs",
    slug: "bracelets",
    icon: "CircleDot",
    image: "/images/products/categories/cat3.jpeg",
  },
 
  // ── Boucles d'oreilles ──────────────────────────────────────────────────
  boucles: {
    name: "Boucles d'oreilles",
    moroccanLabel: "Créoles & Boucles d'oreilles",
    subtitle: "Créoles & Boucles d'oreilles",
    slug: "boucles",
    icon: "Heart",
    image: "/images/products/categories/cat4.jpeg",
  },
 
};

/**
 * Reads categories dynamically from products.json.
 * Adding a new "category" value in any product is enough —
 * no other file needs to be changed.
 */
export function getCategories() {
  const products = getProducts();

  // Collect unique category values from the products (preserve insertion order)
  const seen = new Map<string, string>(); // lowercase key → original value
  for (const p of products) {
    const raw = (p.categoryLabel || p.category || "").trim();
    if (raw) seen.set(raw.toLowerCase(), raw);
  }

  return Array.from(seen.entries()).map(([key, originalLabel]) => {
    const meta = CATEGORY_META[key];

    return {
      // id / slug use the exact category string from the product (lowercased slug)
      id: originalLabel,
      slug: meta?.slug ?? key.replace(/\s+/g, "-"),
      name: meta?.name ?? originalLabel,
      moroccanLabel: meta?.moroccanLabel ?? originalLabel,
      subtitle: meta?.subtitle ?? originalLabel,
      icon: meta?.icon ?? "Gem",
      image:
        meta?.image ??
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      count: products.filter(
        (p) =>
          (p.categoryLabel || p.category || "").toLowerCase() === key ||
          (p.category || "").toLowerCase() === key
      ).length,
    };
  });
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

