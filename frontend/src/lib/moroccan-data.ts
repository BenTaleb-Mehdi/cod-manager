import { Order, Product, Category, Courier, Agent, DashboardKPIs, CityStat } from "@/types";
export { formatMoroccanPhone } from "./utils";

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Salé",
  "Temara",
  "Mohammédia",
  "El Jadida",
  "Nador",
  "Béni Mellal",
  "Safi",
  "Khémisset",
  "Berrechid",
  "Settat",
] as const;

export const DEFAULT_STORE_NAME = "Atlas Boutique COD";

/**
 * Génère le lien WhatsApp avec le numéro normalisé au format international 212...
 * et le message type de confirmation pré-rempli.
 */
export function generateWhatsAppLink(
  phone: string,
  customerName: string,
  city: string,
  totalAmount: number,
  productSummary: string
): string {
  // Nettoyer le numéro pour WhatsApp (enlever le 0 initial si nécessaire et préfixer par 212)
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "212" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("212")) {
    cleanPhone = "212" + cleanPhone;
  }

  const message = `Salam ${customerName} ! 👋
C'est le service confirmation de *${DEFAULT_STORE_NAME}*.
Nous vous contactons pour valider votre commande de :
📦 *${productSummary}*
💰 Montant total : *${totalAmount} DH* (Paiement à la livraison)
📍 Ville : *${city}*

Confirmez-vous l'expédition de votre colis pour livraison sous 24-48h ? Merci de répondre par OUI.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Couriers partenaires
export const MOCK_COURIERS: Courier[] = [
  { id: "c1", name: "Cathedis Express", phone: "0522001122" },
  { id: "c2", name: "Ozone Delivery", phone: "0522334455" },
  { id: "c3", name: "Sendit Maroc", phone: "0522778899" },
  { id: "c4", name: "Speedaf Logistics", phone: "0522114477" },
];

// Agents de call center
export const MOCK_AGENTS: Agent[] = [
  { id: "a1", name: "Yassine Mansouri", email: "yassine@codmaroc.ma", role: "AGENT" },
  { id: "a2", name: "Salma El Amrani", email: "salma@codmaroc.ma", role: "AGENT" },
  { id: "a3", name: "Karim Tazi", email: "karim@codmaroc.ma", role: "ADMIN" },
];

// Catégories initiales (optionnelles)
export const MOCK_CATEGORIES: Category[] = [];

// Produits (désormais chargés dynamiquement depuis l'API backend)
export const MOCK_PRODUCTS: Product[] = [];

// Commandes (désormais chargées dynamiquement depuis l'API backend)
export const MOCK_ORDERS: Order[] = [];


// Données initiales des KPI pour le Dashboard (fallback)
export const INITIAL_KPIS: DashboardKPIs = {
  totalDeliveredRevenue: 0,
  totalOrders: 0,
  confirmationRate: 0,
  deliveryRate: 0,
  pendingCallsCount: 0,
  newCount: 0,
  noAnswerCount: 0,
  confirmedCount: 0,
  deliveredCount: 0,
  shippedCount: 0,
  returnedCount: 0,
  cancelledCount: 0,
};


export const INITIAL_CITY_STATS: CityStat[] = [
  { city: "Casablanca", totalOrders: 78, deliveredOrders: 54, deliveryRate: 85.7, revenue: 16840 },
  { city: "Rabat", totalOrders: 36, deliveredOrders: 26, deliveryRate: 83.8, revenue: 8120 },
  { city: "Marrakech", totalOrders: 28, deliveredOrders: 18, deliveryRate: 78.2, revenue: 5390 },
  { city: "Tanger", totalOrders: 24, deliveredOrders: 16, deliveryRate: 80.0, revenue: 4230 },
];
