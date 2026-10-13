import { z } from "zod";

/**
 * Moroccan Phone regex: matches 06/07/05 or +212/00212 followed by 8 digits.
 */
export const MoroccanPhoneRegex =
  /^(?:(?:\+|00)212|0)[5-7]\d{8}$/;

export const OrderStatusEnum = z.enum([
  "NEW",
  "CONFIRMED",
  "CANCELLED",
  "NO_ANSWER",
  "SHIPPED",
  "DELIVERED",
  "RETURNED",
]);

export const OrderItemSchema = z.object({
  productId: z
    .string({ required_error: "Le produit est obligatoire." })
    .uuid("Identifiant de produit invalide."),
  quantity: z
    .coerce
    .number({ invalid_type_error: "La quantité doit être un entier." })
    .int("La quantité doit être un entier.")
    .min(1, "La quantité minimale commandée est de 1 unitée.")
    .max(100, "Quantité maximale par article dépassée (100)."),
  price: z
    .coerce
    .number()
    .positive("Le prix unitaire doit être positif.")
    .optional(),
});

export const CreateOrderSchema = z.object({
  customerName: z
    .string({ required_error: "Le nom du client est obligatoire." })
    .trim()
    .min(2, "Le nom du client doit comporter au moins 2 caractères.")
    .max(191),
  phone: z
    .string({ required_error: "Le numéro de téléphone est obligatoire." })
    .trim()
    .transform((val) => val.replace(/[\s.-]/g, "")) // Nettoie les espaces et tirets
    .refine(
      (val) => MoroccanPhoneRegex.test(val),
      "Numéro de téléphone marocain invalide (ex: 0612345678, 0712345678, +212612345678)."
    ),
  city: z
    .string({ required_error: "La ville de livraison est obligatoire." })
    .trim()
    .min(2, "La ville doit comporter au moins 2 caractères.")
    .max(100),
  address: z
    .string({ required_error: "L'adresse de livraison est obligatoire." })
    .trim()
    .min(5, "L'adresse doit comporter au moins 5 caractères.")
    .max(2000),
  shippingNote: z.string().trim().max(1000).optional().nullable(),
  courierId: z.string().uuid("Identifiant de livreur invalide.").optional().nullable(),
  assignedToId: z.string().uuid("Identifiant d'agent invalide.").optional().nullable(),
  items: z
    .array(OrderItemSchema)
    .min(1, "La commande doit comporter au moins un article."),
});

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Identifiant de commande invalide."),
  status: OrderStatusEnum,
  trackingNumber: z.string().trim().max(100).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
});

export const BulkAssignToAgentSchema = z.object({
  orderIds: z
    .array(z.string().uuid())
    .min(1, "Veuillez sélectionner au moins une commande."),
  agentId: z.string().uuid("Identifiant d'agent invalide."),
});

export const BulkAssignToCourierSchema = z.object({
  orderIds: z
    .array(z.string().uuid())
    .min(1, "Veuillez sélectionner au moins une commande."),
  courierId: z.string().uuid("Identifiant de transporteur/livreur invalide."),
});

export type OrderStatusType = z.infer<typeof OrderStatusEnum>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
export type BulkAssignToAgentInput = z.infer<typeof BulkAssignToAgentSchema>;
export type BulkAssignToCourierInput = z.infer<typeof BulkAssignToCourierSchema>;
