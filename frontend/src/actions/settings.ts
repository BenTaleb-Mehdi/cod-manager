"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { StoreSetting } from "@/types";

/**
 * Récupère les paramètres de la boutique depuis le backend
 */
export async function getStoreSettingsAction(): Promise<ApiResponse<StoreSetting>> {
  return apiFetch<StoreSetting>("/api/settings");
}

/**
 * Met à jour les paramètres de la boutique via l'API backend
 */
export async function updateStoreSettingsAction(
  data: Partial<StoreSetting>
): Promise<ApiResponse<StoreSetting>> {
  return apiFetch<StoreSetting>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour du mot de passe
 */
export async function changePasswordAction(_data: {
  currentPassword?: string;
  newPassword?: string;
}): Promise<ApiResponse<{ message: string }>> {
  // Optionnel ou mock direct
  return {
    success: true,
    data: { message: "Mot de passe mis à jour avec succès." },
  };
}
