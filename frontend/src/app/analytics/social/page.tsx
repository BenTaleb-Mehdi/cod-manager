import React from "react";
import { getSocialAnalyticsAction } from "@/actions/social-analytics";
import { MetaAnalyticsSpace } from "@/components/analytics/MetaAnalyticsSpace";
import { AIAdvisorPanel } from "@/components/analytics/ai-advisor-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, ArrowLeft, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyses Sociales & Conseiller IA | COD Manager",
  description:
    "Espace dédié au pilotage des Reels Instagram, campagnes Meta Ads et recommandations stratégiques IA pour l'e-commerce au Maroc.",
};

export default async function SocialAnalyticsPage() {
  const metaRes = await getSocialAnalyticsAction();
  const metaData = metaRes.success && metaRes.data ? metaRes.data : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header avec Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs -ml-2 text-muted-foreground hover:text-foreground">
              <Link href="/analytics">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>Retour aux Analyses</span>
              </Link>
            </Button>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <Instagram className="h-3.5 w-3.5" />
              Meta & Instagram
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Performance Sociale & Acquisition Reels</span>
            <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
              Instagram Business
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi des vues Reels, engagement organique, campagnes Meta Ads et copilote IA stratégique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Link href="/settings">
              <Settings className="h-3.5 w-3.5" />
              <span>Paramètres API</span>
            </Link>
          </Button>

          <Button asChild variant="default" size="sm" className="h-9 gap-1.5 text-xs">
            <Link href="/analytics?tab=orders">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analyses Commandes</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 1. Espace Analytique Meta (Cartes métriques, graphiques et classement des Reels) */}
      <MetaAnalyticsSpace initialData={metaData} />

      {/* 2. Conseiller Stratégique IA Gemini 2.5 Flash intégré à la fin de la page */}
      <div className="pt-6 border-t space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs">
            IA Stratégique
          </Badge>
          <h2 className="text-base font-bold text-foreground">
            Audit Intelligent & Assistant Conversationnel Gemini
          </h2>
        </div>
        <AIAdvisorPanel />
      </div>
    </div>
  );
}
