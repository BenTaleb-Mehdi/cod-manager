import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { jsonResponse, errorResponse, corsHeaders } from "@/lib/api-response";
import { getMetaConfig } from "@/lib/meta-config";
import { z } from "zod";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

const MetaCredentialsSchema = z.object({
  appId: z.string().optional().nullable(),
  appSecret: z.string().optional().nullable(),
  accessToken: z.string().min(10, "Le Token d'accès Meta (Page Access Token) est requis."),
  instagramAccountId: z.string().min(5, "L'identifiant du compte Instagram Business est requis."),
  adAccountId: z.string().optional().nullable(),
  pageId: z.string().optional().nullable(),
});

/**
 * GET /api/settings/meta
 * Récupère la configuration Meta actuelle
 */
export async function GET(_request: NextRequest) {
  try {
    const config = await getMetaConfig();

    return jsonResponse({
      success: true,
      data: {
        appId: config.appId || "",
        appSecret: config.appSecret ? "••••••••••••••••" : "",
        accessToken: config.accessToken ? `${config.accessToken.slice(0, 10)}...${config.accessToken.slice(-6)}` : "",
        rawAccessToken: config.accessToken || "",
        instagramAccountId: config.instagramAccountId || "",
        adAccountId: config.adAccountId || "",
        pageId: config.pageId || "",
        isConnected: config.isConnected,
        source: config.source,
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/settings/meta] Error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de la récupération des paramètres Meta.",
      500
    );
  }
}

/**
 * PUT /api/settings/meta
 * Valide les accès avec Meta Graph API et enregistre les identifiants
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = MetaCredentialsSchema.parse(body);

    const { accessToken, instagramAccountId } = validated;
    const currentConfig = await getMetaConfig();

    let effectiveAccessToken = accessToken.trim();
    let isUpgradedToPermanentOrLongLived = false;

    // 1. Tenter un échange automatique vers un Token Longue Durée (60 jours) ou Permanent
    // si l'App ID et l'App Secret sont configurés ou transmis
    const effectiveAppId = validated.appId?.trim() || currentConfig.appId || undefined;
    const effectiveAppSecret =
      validated.appSecret && validated.appSecret !== "••••••••••••••••"
        ? validated.appSecret.trim()
        : currentConfig.appSecret || undefined;

    if (effectiveAppId && effectiveAppSecret && effectiveAccessToken) {
      try {
        const exchangeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${encodeURIComponent(
          effectiveAppId
        )}&client_secret=${encodeURIComponent(
          effectiveAppSecret
        )}&fb_exchange_token=${encodeURIComponent(effectiveAccessToken)}`;

        const exRes = await fetch(exchangeUrl, { cache: "no-store" });
        const exData = await exRes.json();

        if (exData.access_token) {
          effectiveAccessToken = exData.access_token;
          isUpgradedToPermanentOrLongLived = true;
          console.log("[Meta API] Token étendu avec succès en Long-Lived Token (60 jours).");

          // Essayer de récupérer le Page Access Token permanent (Never-Expiring)
          try {
            const accountsUrl = `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${encodeURIComponent(
              effectiveAccessToken
            )}`;
            const accRes = await fetch(accountsUrl, { cache: "no-store" });
            const accData = await accRes.json();

            if (accData.data && Array.isArray(accData.data)) {
              const matchedPage = accData.data.find(
                (p: any) =>
                  (validated.pageId && p.id === validated.pageId.trim()) ||
                  p.instagram_business_account?.id === instagramAccountId.trim()
              ) || accData.data[0];

              if (matchedPage?.access_token) {
                effectiveAccessToken = matchedPage.access_token;
                console.log("[Meta API] Page Access Token permanent (Never Expiring) configuré !");
              }
            }
          } catch (pageErr) {
            console.warn("[Meta API] Page token retrieval skipped:", pageErr);
          }
        }
      } catch (exchangeErr) {
        console.warn("[Meta API] Token exchange warning:", exchangeErr);
      }
    }

    // 2. Tester la validité via la Meta Graph API
    const metaVerifyUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(
      instagramAccountId
    )}?fields=username,name,followers_count,media_count,profile_picture_url&access_token=${encodeURIComponent(
      effectiveAccessToken
    )}`;

    let metaData: {
      id?: string;
      username?: string;
      name?: string;
      followers_count?: number;
      media_count?: number;
      profile_picture_url?: string;
      error?: {
        message: string;
        type: string;
        code: number;
        error_subcode?: number;
      };
    };

    try {
      const metaRes = await fetch(metaVerifyUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      metaData = await metaRes.json();
    } catch (networkErr: unknown) {
      return errorResponse(
        `Impossible de contacter les serveurs de Meta : ${
          networkErr instanceof Error ? networkErr.message : "Vérifiez votre connexion Internet."
        }`,
        502
      );
    }

    if (metaData.error) {
      console.warn("[Meta Graph API Validation Failed]:", metaData.error);
      if (metaData.error.code === 190) {
        return errorResponse(
          `Erreur Meta Graph API (190) : Le token d'accès a expiré (${metaData.error.message}). ` +
          `Les tokens temporaires de session générés depuis l'explorateur Graph API expirent après 1 à 2 heures. ` +
          `Veuillez générer un Token Permanent (Utilisateur Système avec expiration "Jamais" dans Meta Business Suite) ou un Token Longue Durée (60 jours) pour continuer.`,
          400
        );
      }
      return errorResponse(
        `Erreur Meta Graph API (${metaData.error.code}): ${metaData.error.message}`,
        400
      );
    }

    // 3. Si la validation réussit, persister dans la table MySQL `meta_integrations`
    const updated = await db.metaIntegration.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        appId: validated.appId?.trim() || null,
        appSecret: validated.appSecret?.trim() || null,
        accessToken: effectiveAccessToken,
        instagramAccountId: validated.instagramAccountId.trim(),
        adAccountId: validated.adAccountId?.trim() || null,
        pageId: validated.pageId?.trim() || null,
        isConnected: true,
      },
      update: {
        appId: validated.appId?.trim() || null,
        ...(validated.appSecret && validated.appSecret !== "••••••••••••••••"
          ? { appSecret: validated.appSecret.trim() }
          : {}),
        accessToken: effectiveAccessToken,
        instagramAccountId: validated.instagramAccountId.trim(),
        adAccountId: validated.adAccountId?.trim() || null,
        pageId: validated.pageId?.trim() || null,
        isConnected: true,
      },
    });

    const statusNote = isUpgradedToPermanentOrLongLived
      ? " (Token Longue Durée / Permanent activé)"
      : "";

    return jsonResponse({
      success: true,
      data: {
        message: `Connexion réussie avec le compte Instagram @${metaData.username || metaData.name} !${statusNote}`,
        account: {
          username: metaData.username,
          name: metaData.name,
          followersCount: metaData.followers_count ?? 0,
          mediaCount: metaData.media_count ?? 0,
          profilePictureUrl: metaData.profile_picture_url,
        },
        integration: {
          id: updated.id,
          instagramAccountId: updated.instagramAccountId,
          isConnected: updated.isConnected,
          updatedAt: updated.updatedAt,
        },
      },
    });
  } catch (error: unknown) {
    console.error("[PUT /api/settings/meta] Error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message).join(" • "), 400);
    }
    return errorResponse(
      error instanceof Error ? error.message : "Erreur lors de l'enregistrement de l'intégration Meta.",
      500
    );
  }
}

/**
 * DELETE /api/settings/meta
 * Déconnecte l'intégration Meta
 */
export async function DELETE(_request: NextRequest) {
  try {
    await db.metaIntegration.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        isConnected: false,
      },
      update: {
        isConnected: false,
        accessToken: null,
      },
    });

    return jsonResponse({
      success: true,
      data: { message: "Intégration Meta déconnectée avec succès." },
    });
  } catch (error: unknown) {
    console.error("[DELETE /api/settings/meta] Error:", error);
    return errorResponse("Erreur lors de la déconnexion.", 500);
  }
}
