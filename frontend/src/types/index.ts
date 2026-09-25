export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "CANCELLED"
  | "NO_ANSWER"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED";

export type Role = "ADMIN" | "AGENT" | "COURIER";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  productCount?: number;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  costPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  category?: Category;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  apiEndpoint?: string | null;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  shippingNote?: string | null;
  totalAmount: number;
  status: OrderStatus;
  attemptsCount: number;
  trackingNumber?: string | null;
  courierId?: string | null;
  courier?: Courier | null;
  assignedToId?: string | null;
  assignedTo?: Agent | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardKPIs {
  totalDeliveredRevenue: number;
  totalOrders: number;
  confirmationRate: number;
  deliveryRate: number;
  pendingCallsCount: number; // NEW + NO_ANSWER
  deliveredCount: number;
  shippedCount: number;
  returnedCount: number;
  cancelledCount: number;
}

export interface CityStat {
  city: string;
  totalOrders: number;
  deliveredOrders: number;
  deliveryRate: number;
  revenue: number;
}
