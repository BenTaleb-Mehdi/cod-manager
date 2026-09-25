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

// Catégories initiales
export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Beauté & Soins", slug: "beaute-soins", productCount: 4, createdAt: "2026-09-01" },
  { id: "cat-2", name: "Maison & Cuisine", slug: "maison-cuisine", productCount: 3, createdAt: "2026-09-05" },
  { id: "cat-3", name: "High-Tech & Gadgets", slug: "high-tech-gadgets", productCount: 2, createdAt: "2026-09-10" },
];

// Produits initiaux avec calcul de marge
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    sku: "SERUM-ARG-50",
    name: "Sérum Anti-Âge Huile d'Argan Pure 50ml",
    description: "Sérum bio formulé à base d'huile d'argan certifiée du Souss.",
    costPrice: 45.0,
    salePrice: 199.0,
    stock: 24,
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    createdAt: "2026-09-01",
  },
  {
    id: "p2",
    sku: "HAC-ELEC-PRO",
    name: "Hachoir Électrique Multifonction Inox 2L",
    description: "Hachoir 4 lames puissant pour viandes, oignons et herbes.",
    costPrice: 75.0,
    salePrice: 249.0,
    stock: 4, // Alerte stock bas <= 5
    categoryId: "cat-2",
    category: MOCK_CATEGORIES[1],
    createdAt: "2026-09-02",
  },
  {
    id: "p3",
    sku: "DIFF-AROMA-FLAME",
    name: "Diffuseur d'Huiles Essentielles Effet Flamme LED",
    description: "Humidificateur d'air ultrasonique ultra silencieux.",
    costPrice: 55.0,
    salePrice: 189.0,
    stock: 3, // Alerte stock bas <= 5
    categoryId: "cat-2",
    category: MOCK_CATEGORIES[1],
    createdAt: "2026-09-03",
  },
  {
    id: "p4",
    sku: "WATCH-ULTRA-PRO",
    name: "Montre Connectée Sport Pro Étanche IP68",
    description: "Compatible iOS & Android avec suivi cardio et notifications appel.",
    costPrice: 110.0,
    salePrice: 320.0,
    stock: 18,
    categoryId: "cat-3",
    category: MOCK_CATEGORIES[2],
    createdAt: "2026-09-04",
  },
  {
    id: "p5",
    sku: "MASQ-CHEVEUX-KERAT",
    name: "Masque Capillaire Kératine & Ricin 500ml",
    description: "Soin réparateur intensif cheveux abîmés.",
    costPrice: 35.0,
    salePrice: 149.0,
    stock: 42,
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    createdAt: "2026-09-05",
  },
];

// Commandes initiales représentatives du flux call center COD
export const MOCK_ORDERS: Order[] = [
  {
    id: "cmd-101",
    customerName: "Mohammed Bennani",
    phone: "0661234567",
    city: "Casablanca",
    address: "Bd Al Qods, Résidence Al Yassamine Imm B N°12, Ain Chock",
    shippingNote: "Appeler avant 14h, concierge disponible.",
    totalAmount: 199.0,
    status: "NEW",
    attemptsCount: 0,
    courierId: null,
    assignedToId: "a1",
    assignedTo: MOCK_AGENTS[0],
    items: [
      {
        id: "item-1",
        productId: "p1",
        productName: "Sérum Anti-Âge Huile d'Argan Pure 50ml",
        productSku: "SERUM-ARG-50",
        quantity: 1,
        price: 199.0,
      },
    ],
    createdAt: "2026-09-25T10:15:00Z",
    updatedAt: "2026-09-25T10:15:00Z",
  },
  {
    id: "cmd-102",
    customerName: "Fatima Zahra El Alami",
    phone: "0668991122",
    city: "Rabat",
    address: "Avenue Mohammed VI, Souissi, Villa 45",
    shippingNote: "Livraison le matin impérative.",
    totalAmount: 249.0,
    status: "CONFIRMED",
    attemptsCount: 1,
    trackingNumber: "CAT-RBT-98210",
    courierId: "c1",
    courier: MOCK_COURIERS[0],
    assignedToId: "a2",
    assignedTo: MOCK_AGENTS[1],
    items: [
      {
        id: "item-2",
        productId: "p2",
        productName: "Hachoir Électrique Multifonction Inox 2L",
        productSku: "HAC-ELEC-PRO",
        quantity: 1,
        price: 249.0,
      },
    ],
    createdAt: "2026-09-25T09:30:00Z",
    updatedAt: "2026-09-25T11:00:00Z",
  },
  {
    id: "cmd-103",
    customerName: "Hicham Bouziane",
    phone: "0770451234",
    city: "Marrakech",
    address: "Guéliz, Rue de la Liberté, Appt 5",
    shippingNote: "A demandé rappel après 17h.",
    totalAmount: 189.0,
    status: "NO_ANSWER",
    attemptsCount: 2,
    courierId: null,
    assignedToId: "a1",
    assignedTo: MOCK_AGENTS[0],
    items: [
      {
        id: "item-3",
        productId: "p3",
        productName: "Diffuseur d'Huiles Essentielles Effet Flamme LED",
        productSku: "DIFF-AROMA-FLAME",
        quantity: 1,
        price: 189.0,
      },
    ],
    createdAt: "2026-09-25T08:20:00Z",
    updatedAt: "2026-09-25T12:45:00Z",
  },
  {
    id: "cmd-104",
    customerName: "Khadija Idrissi",
    phone: "0662778844",
    city: "Tanger",
    address: "Malabata, Résidence Baie de Tanger, Bloc C N°8",
    shippingNote: "Paiement en espèces prévu.",
    totalAmount: 320.0,
    status: "SHIPPED",
    attemptsCount: 1,
    trackingNumber: "OZN-TNG-44512",
    courierId: "c2",
    courier: MOCK_COURIERS[1],
    assignedToId: "a2",
    assignedTo: MOCK_AGENTS[1],
    items: [
      {
        id: "item-4",
        productId: "p4",
        productName: "Montre Connectée Sport Pro Étanche IP68",
        productSku: "WATCH-ULTRA-PRO",
        quantity: 1,
        price: 320.0,
      },
    ],
    createdAt: "2026-09-24T14:10:00Z",
    updatedAt: "2026-09-25T08:00:00Z",
  },
  {
    id: "cmd-105",
    customerName: "Mehdi Chraibi",
    phone: "0661993355",
    city: "Casablanca",
    address: "Maârif Extension, Rue Jean Jaurès, Imm 14 N°4",
    shippingNote: null,
    totalAmount: 398.0,
    status: "DELIVERED",
    attemptsCount: 1,
    trackingNumber: "SND-CAS-88192",
    courierId: "c3",
    courier: MOCK_COURIERS[2],
    assignedToId: "a1",
    assignedTo: MOCK_AGENTS[0],
    items: [
      {
        id: "item-5",
        productId: "p1",
        productName: "Sérum Anti-Âge Huile d'Argan Pure 50ml",
        productSku: "SERUM-ARG-50",
        quantity: 2,
        price: 199.0,
      },
    ],
    createdAt: "2026-09-23T11:00:00Z",
    updatedAt: "2026-09-24T16:30:00Z",
  },
  {
    id: "cmd-106",
    customerName: "Souad Tahiri",
    phone: "0672114433",
    city: "Fès",
    address: "Route d'Immouzzer, Hay Saada N°33",
    shippingNote: "Client a refusé à la porte, motif: délai dépassé.",
    totalAmount: 149.0,
    status: "RETURNED",
    attemptsCount: 1,
    trackingNumber: "CAT-FES-11923",
    courierId: "c1",
    courier: MOCK_COURIERS[0],
    assignedToId: "a2",
    assignedTo: MOCK_AGENTS[1],
    items: [
      {
        id: "item-6",
        productId: "p5",
        productName: "Masque Capillaire Kératine & Ricin 500ml",
        productSku: "MASQ-CHEVEUX-KERAT",
        quantity: 1,
        price: 149.0,
      },
    ],
    createdAt: "2026-09-22T09:40:00Z",
    updatedAt: "2026-09-24T18:00:00Z",
  },
  {
    id: "cmd-107",
    customerName: "Omar Lahlou",
    phone: "0663445566",
    city: "Agadir",
    address: "Quartier Dakhla, Rue 412 N°19",
    shippingNote: "Numéro erroné après vérification.",
    totalAmount: 249.0,
    status: "CANCELLED",
    attemptsCount: 3,
    courierId: null,
    assignedToId: "a1",
    assignedTo: MOCK_AGENTS[0],
    items: [
      {
        id: "item-7",
        productId: "p2",
        productName: "Hachoir Électrique Multifonction Inox 2L",
        productSku: "HAC-ELEC-PRO",
        quantity: 1,
        price: 249.0,
      },
    ],
    createdAt: "2026-09-21T16:20:00Z",
    updatedAt: "2026-09-22T10:15:00Z",
  },
];

// Données initiales des KPI pour le Dashboard
export const INITIAL_KPIS: DashboardKPIs = {
  totalDeliveredRevenue: 34580.0,
  totalOrders: 184,
  confirmationRate: 74.5,
  deliveryRate: 82.3,
  pendingCallsCount: 23, // NEW (14) + NO_ANSWER (9)
  deliveredCount: 112,
  shippedCount: 24,
  returnedCount: 18,
  cancelledCount: 30,
};

export const INITIAL_CITY_STATS: CityStat[] = [
  { city: "Casablanca", totalOrders: 78, deliveredOrders: 54, deliveryRate: 85.7, revenue: 16840 },
  { city: "Rabat", totalOrders: 36, deliveredOrders: 26, deliveryRate: 83.8, revenue: 8120 },
  { city: "Marrakech", totalOrders: 28, deliveredOrders: 18, deliveryRate: 78.2, revenue: 5390 },
  { city: "Tanger", totalOrders: 24, deliveredOrders: 16, deliveryRate: 80.0, revenue: 4230 },
];
