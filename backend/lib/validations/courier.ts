import { z } from "zod";
import { MoroccanPhoneRegex, OrderStatusEnum } from "./order";

export const CreateCourierSchema = z.object({
  name: z
    .string({ required_error: "Le nom du transporteur est obligatoire." })
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(191),
  phone: z
    .string({ required_error: "Le numéro de contact est obligatoire." })
    .trim()
    .transform((val) => val.replace(/[\s.-]/g, ""))
    .refine(
      (val) => MoroccanPhoneRegex.test(val),
      "Numéro de téléphone marocain invalide."
    ),
  apiEndpoint: z.string().url("URL de l'API invalide.").optional().nullable(),
});

export const CourierWebhookPayloadSchema = z.object({
  trackingNumber: z
    .string({ required_error: "Le numéro de suivi est obligatoire." })
    .trim()
    .min(1, "Numéro de suivi manquant."),
  courierStatus: z.string({ required_error: "Le statut transporteur est obligatoire." }),
  mappedStatus: OrderStatusEnum.optional(),
  attemptsCount: z.number().int().min(0).optional(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateCourierInput = z.infer<typeof CreateCourierSchema>;
export type CourierWebhookPayload = z.infer<typeof CourierWebhookPayloadSchema>;
