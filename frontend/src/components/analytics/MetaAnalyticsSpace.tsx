"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getSocialAnalyticsAction,
  SocialAnalyticsResponse,
  SocialMediaPost,
} from "@/actions/social-analytics";
import {
  Instagram,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Users,
  Film,
  DollarSign,
  MousePointerClick,
  Sparkles,
  ArrowUpRight,
  Target,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface MetaAnalyticsSpaceProps {
  initialData?: SocialAnalyticsResponse | null;
}

export function MetaAnalyticsSpace({ initialData }: MetaAnalyticsSpaceProps) {
  const [data, setData] = useState<SocialAnalyticsResponse | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<"ALL" | "REEL" | "IMAGE">("ALL");

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSocialAnalyticsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Impossible de récupérer les analyses Meta.");
      }
    } catch {
      setError("Erreur réseau lors de la communication avec l'API Meta.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchAnalytics();
    }
  }, [initialData]);

  // Si non connecté à Meta
  if (!isLoading && (!data || !data.isConnected)) {
    return (
      <Card className="border-dashed border-2 border-rose-200 dark:border-rose-900/50 bg-gradient-to-b from-rose-50/40 to-transparent dark:from-rose-950/10">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white shadow-lg shadow-pink-500/20 mb-4">
            <Instagram className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Espace Meta & Instagram non connecté
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            Connectez votre compte Instagram Business et votre Page Meta dans les paramètres
            pour synchroniser en direct vos abonnés, portées publicitaires et performances de vos Reels COD.
          </p>
          <div className="flex items-center gap-3">
            <Button asChild className="gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Configurer l'intégration Meta</span>
              </Link>
            </Button>
            <Button variant="outline" onClick={fetchAnalytics} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Réessayer</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const account = data?.account;
  const metrics = data?.metrics || { reach: 0, impressions: 0, profileViews: 0 };
  const ads = data?.ads;
  const topMedia = data?.topMedia || [];

  const filteredMedia = topMedia.filter((m) => {
    if (mediaFilter === "ALL") return true;
    if (mediaFilter === "REEL") return m.mediaType.includes("VIDEO") || m.mediaType.includes("REEL");
    if (mediaFilter === "IMAGE") return m.mediaType.includes("IMAGE") || m.mediaType.includes("CAROUSEL");
    return true;
  });

  const totalViews = topMedia.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalLikes = topMedia.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);
  const avgEngagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      {/* En-tête Statut & Profil Meta */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-xs">
        <div className="flex items-center gap-3.5">
          {account?.profilePictureUrl ? (
            <img
              src={account.profilePictureUrl}
              alt={account.name}
              className="h-12 w-12 rounded-full border-2 border-pink-500/40 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-md">
              <Instagram className="h-6 w-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {account?.name || "Compte Instagram Business"}
              </h2>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connecté ({data?.source === "database" ? "MySQL" : "ENV"})
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span>@{account?.username || "instagram_account"}</span>
              <span>•</span>
              <span>Meta Graph API v19.0</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="gap-2 h-9 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Actualiser les métriques</span>
          </Button>

          <Button asChild variant="ghost" size="sm" className="h-9 text-xs gap-1.5">
            <Link href="/settings">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Paramètres</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Cartes KPI Principales Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers */}
        <Card className="shadow-xs hover:border-pink-300 dark:hover:border-pink-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Abonnés (Communauté)
            </CardTitle>
            <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-foreground">
              {account?.followersCount?.toLocaleString("fr-FR") ?? "—"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Abonnements : {account?.followsCount ?? 0}</span>
              <span className="text-pink-600 font-semibold">{account?.mediaCount ?? 0} posts</span>
            </p>
          </CardContent>
        </Card>

        {/* Reach */}
        <Card className="shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Portée Globale (Reach)
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {metrics.reach ? metrics.reach.toLocaleString("fr-FR") : "0"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Comptes uniques touchés sur la période
            </p>
          </CardContent>
        </Card>

        {/* Profile Views */}
        <Card className="shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition-colors">
          <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Vues & Visites Profil
            </CardTitle>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
              {metrics.profileViews ? metrics.profileViews.toLocaleString("fr-FR") : "0"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Impressions : {metrics.impressions ? metrics.impressions.toLocaleString("fr-FR") : "0"}
            </p>
          </CardContent>
        </Card>

        {/* Budget Ads ou Taux d'Engagement */}
        {ads ? (
          <Card className="shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
            <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground">
                Dépenses Meta Ads (30j)
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {ads.spend.toFixed(2)} $
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  (~{(ads.spend * 10).toFixed(0)} DH)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {ads.clicks.toLocaleString("fr-FR")} clics • CTR: {(ads.ctr * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-colors">
            <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground">
                Taux d'Engagement Moyen
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <Percent className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
                {avgEngagementRate}%
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Sur les {topMedia.length} publications analysées
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Module Meta Ads détaillé si présent */}
      {ads && (
        <Card className="shadow-xs border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/30 via-transparent to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-500 text-white">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    Campagnes Meta Ads & Rentabilité d'Acquisition
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Performances de vos publicités payantes Instagram & Facebook menant à votre boutique COD
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs border-amber-300 text-amber-700 dark:text-amber-300">
                Ad Account Actif
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Impressions Publicitaires</span>
                <p className="text-base font-bold font-mono">{ads.impressions.toLocaleString("fr-FR")}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Clics sur les Liens</span>
                <p className="text-base font-bold font-mono text-sky-600">{ads.clicks.toLocaleString("fr-FR")}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Coût par Clic Moyen (CPC)</span>
                <p className="text-base font-bold font-mono text-emerald-600">{ads.cpc.toFixed(2)} $ (~{(ads.cpc * 10).toFixed(2)} DH)</p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Taux de Clic (CTR)</span>
                <p className="text-base font-bold font-mono text-amber-600">{(ads.ctr * 100).toFixed(2)} %</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classement des Meilleurs Contenus / Reels */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Film className="h-4 w-4 text-rose-500" />
                <span>Performances des Contenus & Top Reels</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Classement par nombre de vues pour identifier les produits qui attirent le plus de trafic
              </CardDescription>
            </div>

            {/* Filtres Type */}
            <div className="flex items-center gap-1.5 self-start sm:self-center bg-muted/60 p-1 rounded-lg">
              <button
                onClick={() => setMediaFilter("ALL")}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  mediaFilter === "ALL"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tous ({topMedia.length})
              </button>
              <button
                onClick={() => setMediaFilter("REEL")}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  mediaFilter === "REEL"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reels & Vidéos
              </button>
              <button
                onClick={() => setMediaFilter("IMAGE")}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  mediaFilter === "IMAGE"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Photos / Carrousels
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredMedia.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Aucun contenu correspondant à ce filtre.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMedia.map((media, index) => {
                const engagementRate =
                  media.viewsCount > 0
                    ? (((media.likesCount + media.commentsCount) / media.viewsCount) * 100).toFixed(1)
                    : "0.0";

                return (
                  <div
                    key={media.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/40 transition-colors gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold font-mono text-muted-foreground">
                        #{index + 1}
                      </span>

                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono py-0 px-2 uppercase tracking-wide"
                          >
                            {media.mediaType.includes("VIDEO") ? "REEL" : media.mediaType}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(media.publishedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 font-medium">
                            Engagement : {engagementRate}%
                          </span>
                        </div>
                        <p className="text-xs text-foreground font-medium line-clamp-2">
                          {media.caption || "(Sans légende)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                      {/* Vues */}
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 font-mono font-bold text-xs text-foreground sm:justify-end">
                          <Eye className="h-3.5 w-3.5 text-sky-500" />
                          <span>{media.viewsCount.toLocaleString("fr-FR")}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase">Vues</span>
                      </div>

                      {/* Likes */}
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 font-mono text-xs text-rose-500 sm:justify-end">
                          <Heart className="h-3 w-3 fill-rose-500" />
                          <span>{media.likesCount.toLocaleString("fr-FR")}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase">J'aime</span>
                      </div>

                      {/* Commentaires */}
                      <div className="text-left sm:text-right hidden md:block">
                        <div className="flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-400 sm:justify-end">
                          <MessageCircle className="h-3 w-3" />
                          <span>{media.commentsCount.toLocaleString("fr-FR")}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase">Avis</span>
                      </div>

                      {/* Bouton Voir sur Instagram */}
                      {media.permalink && (
                        <a
                          href={media.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline bg-muted/60 hover:bg-muted px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          <Instagram className="h-3.5 w-3.5 text-pink-500" />
                          <span className="hidden lg:inline text-[11px]">Voir</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
