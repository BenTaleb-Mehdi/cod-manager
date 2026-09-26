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
} from "lucide-react";

export function SocialAnalyticsPreview() {
  const [data, setData] = useState<SocialAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSocialAnalyticsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Impossible de récupérer les analytics.");
      }
    } catch {
      setError("Erreur réseau lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data?.isConnected) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Barre de synchronisation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Instagram className="h-4 w-4 text-rose-500" />
            <span>Performances Instagram & Top Reels</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Synchronisation en temps réel via la Meta Graph API v19.0.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="gap-1.5 h-8 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* Cartes KPI Instagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs">
          <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Abonnés (Followers)</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold font-mono">
              {data.account?.followersCount.toLocaleString("fr-FR")}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">@{data.account?.username}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Portée (Reach)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold font-mono text-emerald-600">
              {data.metrics.reach.toLocaleString("fr-FR")}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Comptes uniques touchés</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Vues du Profil</CardTitle>
            <Eye className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold font-mono">
              {data.metrics.profileViews.toLocaleString("fr-FR")}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Visites de page</p>
          </CardContent>
        </Card>

        {data.ads ? (
          <Card className="shadow-xs">
            <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Budget Ads (30j)</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl font-bold font-mono text-amber-600">
                {data.ads.spend.toFixed(2)} $
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {data.ads.clicks} clics • CTR: {(data.ads.ctr * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xs">
            <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Publications / Médias</CardTitle>
              <Film className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl font-bold font-mono">
                {data.account?.mediaCount.toLocaleString("fr-FR")}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Reels, photos & carrousels</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Classement des Meilleurs Reels / Posts par Nombre de Vues */}
      {data.topMedia && data.topMedia.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Film className="h-4 w-4 text-primary" />
                  <span>Top Reels & Publications (Classés par Vues)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Analyse des contenus générant le plus de trafic vers votre boutique COD.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono">
                {data.topMedia.length} contenus analysés
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.topMedia.slice(0, 5).map((media, index) => (
                <div key={media.id} className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      #{index + 1}
                    </span>

                    <div className="space-y-0.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-mono py-0 px-1.5 uppercase">
                          {media.mediaType}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(media.publishedAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-xs text-foreground font-medium line-clamp-1">
                        {media.caption}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Vues */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-mono font-bold text-xs text-foreground justify-end">
                        <Eye className="h-3.5 w-3.5 text-sky-500" />
                        <span>{media.viewsCount.toLocaleString("fr-FR")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase">Vues</span>
                    </div>

                    {/* Likes */}
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1 font-mono text-xs text-rose-500 justify-end">
                        <Heart className="h-3 w-3 fill-rose-500" />
                        <span>{media.likesCount.toLocaleString("fr-FR")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase">J'aime</span>
                    </div>

                    {/* Lien Instagram */}
                    {media.permalink && (
                      <a
                        href={media.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-primary p-1.5 rounded-md hover:bg-muted"
                        title="Ouvrir sur Instagram"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
