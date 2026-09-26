import { db } from "@/lib/db";

export interface MetaConfig {
  appId: string | null;
  appSecret: string | null;
  accessToken: string | null;
  instagramAccountId: string | null;
  adAccountId: string | null;
  pageId: string | null;
  isConnected: boolean;
  source: "database" | "env" | "none";
}

/**
 * Récupère en priorité les credentials Meta depuis la table MySQL `meta_integrations`.
 * Si non configurés ou vides en base, bascule sur les variables d'environnement (.env).
 */
export async function getMetaConfig(): Promise<MetaConfig> {
  try {
    const dbIntegration = await db.metaIntegration.findUnique({
      where: { id: "default" },
    });

    if (dbIntegration && (dbIntegration.accessToken || dbIntegration.instagramAccountId)) {
      return {
        appId: dbIntegration.appId || process.env.META_APP_ID || null,
        appSecret: dbIntegration.appSecret || process.env.META_APP_SECRET || null,
        accessToken: dbIntegration.accessToken || process.env.META_ACCESS_TOKEN || null,
        instagramAccountId:
          dbIntegration.instagramAccountId || process.env.META_INSTAGRAM_ACCOUNT_ID || null,
        adAccountId: dbIntegration.adAccountId || process.env.META_AD_ACCOUNT_ID || null,
        pageId: dbIntegration.pageId || process.env.META_PAGE_ID || null,
        isConnected: Boolean(dbIntegration.isConnected),
        source: "database",
      };
    }
  } catch (error) {
    console.warn("[MetaConfig] Erreur lors de la lecture de la table MySQL:", error);
  }

  // Fallback sur les variables d'environnement
  const envToken = process.env.META_ACCESS_TOKEN || null;
  const envInstaId = process.env.META_INSTAGRAM_ACCOUNT_ID || null;

  return {
    appId: process.env.META_APP_ID || null,
    appSecret: process.env.META_APP_SECRET || null,
    accessToken: envToken,
    instagramAccountId: envInstaId,
    adAccountId: process.env.META_AD_ACCOUNT_ID || null,
    pageId: process.env.META_PAGE_ID || null,
    isConnected: Boolean(envToken && envInstaId),
    source: envToken || envInstaId ? "env" : "none",
  };
}
