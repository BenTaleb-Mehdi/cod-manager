"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export interface MetaSettingsData {
  appId: string;
  appSecret: string;
  accessToken: string;
  rawAccessToken?: string;
  instagramAccountId: string;
  adAccountId: string;
  pageId: string;
  isConnected: boolean;
  source?: "database" | "env" | "none";
}

export interface MetaUpdateResult {
  message: string;
  account?: {
    username?: string;
    name?: string;
    followersCount: number;
    mediaCount: number;
    profilePictureUrl?: string;
  };
  integration?: {
    id: string;
    instagramAccountId: string;
    isConnected: boolean;
    updatedAt: string;
  };
}

/**
 * Récupère les paramètres Meta actuels
 */
export async function getMetaSettingsAction(): Promise<ApiResponse<MetaSettingsData>> {
  return apiFetch<MetaSettingsData>("/api/settings/meta");
}

/**
 * Server Action : Met à jour les credentials Meta, teste la connexion avec l'API Graph
 * et met à jour `isConnected: true` en base si la validation réussit.
 */
export async function updateMetaCredentials(
  input: FormData | Partial<MetaSettingsData>
): Promise<ApiResponse<MetaUpdateResult>> {
  let payload: Partial<MetaSettingsData> = {};

  if (input instanceof FormData) {
    payload = {
      appId: (input.get("appId") as string) || undefined,
      appSecret: (input.get("appSecret") as string) || undefined,
      accessToken: (input.get("accessToken") as string) || "",
      instagramAccountId: (input.get("instagramAccountId") as string) || "",
      adAccountId: (input.get("adAccountId") as string) || undefined,
      pageId: (input.get("pageId") as string) || undefined,
    };
  } else {
    payload = input;
  }

  // Validation rapide côté client avant l'appel API
  if (!payload.accessToken || payload.accessToken.trim().length < 10) {
    return {
      success: false,
      error: "Veuillez fournir un Access Token Meta (Page Access Token) valide.",
    };
  }

  if (!payload.instagramAccountId || payload.instagramAccountId.trim().length < 4) {
    return {
      success: false,
      error: "L'identifiant du compte Instagram Business (Instagram Account ID) est obligatoire.",
    };
  }

  const response = await apiFetch<MetaUpdateResult>("/api/settings/meta", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (response.success) {
    revalidatePath("/settings");
  }

  return response;
}

/**
 * Server Action : Déconnecte l'intégration Meta
 */
export async function disconnectMetaAction(): Promise<ApiResponse<{ message: string }>> {
  const res = await apiFetch<{ message: string }>("/api/settings/meta", {
    method: "DELETE",
  });

  if (res.success) {
    revalidatePath("/settings");
  }

  return res;
}
