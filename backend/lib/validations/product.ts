import { z } from "zod";

export const CreateProductSchema = z.object({
  sku: z
    .string({ required_error: "Le SKU est obligatoire." })
    .trim()
    .min(3, "Le SKU doit comporter au moins 3 caractères.")
    .max(100, "Le SKU ne peut pas dépasser 100 caractères.")
    .transform((val) => val.toUpperCase()),
  name: z
    .string({ required_error: "Le nom du produit est obligatoire." })
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(255, "Le nom ne peut pas dépasser 255 caractères."),
  description: z.string().trim().max(5000).optional().nullable(),
  costPrice: z
    .coerce
    .number({ invalid_type_error: "Le prix d'achat doit être un nombre valide." })
    .positive("Le prix d'achat (prix de revient) doit être supérieur à zéro.")
    .max(1_000_000, "Le montant dépasse la limite autorisée."),
  salePrice: z
    .coerce
    .number({ invalid_type_error: "Le prix de vente doit être un nombre valide." })
    .positive("Le prix de vente doit être supérieur à zéro.")
    .max(1_000_000, "Le montant dépasse la limite autorisée."),
  stock: z
    .coerce
    .number({ invalid_type_error: "Le stock doit être un entier." })
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif."),
  categoryId: z
    .string({ required_error: "La catégorie est obligatoire." })
    .uuid("Identifiant de catégorie invalide."),
}).refine((data) => data.salePrice >= data.costPrice, {
  message: "Le prix de vente ne peut pas être inférieur au prix d'achat.",
  path: ["salePrice"],
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.string().uuid("Identifiant de produit invalide."),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
