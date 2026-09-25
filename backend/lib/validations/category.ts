import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string({ required_error: "Le nom de la catégorie est obligatoire." })
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(191, "Le nom ne peut pas dépasser 191 caractères."),
  slug: z
    .string()
    .trim()
    .min(2, "Le slug doit comporter au moins 2 caractères.")
    .max(191)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules et ne contenir que des lettres, chiffres et tirets."
    )
    .optional(),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.string().uuid("Identifiant de catégorie invalide."),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
