export interface ProductOffer {
  id: string;
  title: string;
  quantity: number;
  priceMAD: number;
  compareAtPriceMAD: number;
  savingsMAD: number;
  badge?: string;
  isPopular?: boolean;
  includes?: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: "Slasel" | "Dmalj" | "Khowatem" | "Khwarsi" | string;
  categoryLabel?: string;
  priceMAD: number;
  compareAtPriceMAD: number;
  stock: number;
  badge: string;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  images: string[];
  highlights: string[];
  offers: ProductOffer[];
  reviews: ProductReview[];
}

export interface MoroccoCity {
  id: string;
  name: string;
  deliveryTime: string;
  shippingCost: number;
  popular?: boolean;
}

export interface CodOrderFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  packId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  totalPriceMAD: number;
  shippingCost: number;
}
