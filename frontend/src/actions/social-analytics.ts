"use server";

import { apiFetch, ApiResponse } from "@/lib/api-client";

export interface SocialMediaPost {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  publishedAt: string;
}

export interface SocialAnalyticsResponse {
  isConnected: boolean;
  source: string;
  message?: string;
  account: {
    username: string;
    name: string;
    followersCount: number;
    followsCount: number;
    mediaCount: number;
    profilePictureUrl?: string;
  } | null;
  metrics: {
    reach: number;
    impressions: number;
    profileViews: number;
  };
  topMedia: SocialMediaPost[];
  ads?: {
    spend: number;
    impressions: number;
    clicks: number;
    cpc: number;
    ctr: number;
  };
}

/**
 * Server Action : Récupère les données sociales & publicitaires Meta/Instagram
 * en s'appuyant dynamiquement sur `getMetaConfig()` sans dépendre de variables d'environnement figées.
 */
export async function getSocialAnalyticsAction(): Promise<ApiResponse<SocialAnalyticsResponse>> {
  return apiFetch<SocialAnalyticsResponse>("/api/analytics/social");
}
