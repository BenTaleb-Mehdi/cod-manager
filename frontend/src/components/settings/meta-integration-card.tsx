"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  updateMetaCredentials,
  disconnectMetaAction,
  getMetaSettingsAction,
  MetaSettingsData,
} from "@/actions/meta-settings";
import {
  Instagram,
  CheckCircle2,
  XCircle,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  Radio,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Video,
} from "lucide-react";

interface MetaIntegrationCardProps {
  initialSettings?: Partial<MetaSettingsData>;
}

export function MetaIntegrationCard({ initialSettings }: MetaIntegrationCardProps) {
  const [formData, setFormData] = useState<MetaSettingsData>({
    appId: initialSettings?.appId || "",
    appSecret: initialSettings?.appSecret || "",
    accessToken: initialSettings?.rawAccessToken || initialSettings?.accessToken || "",
    instagramAccountId: initialSettings?.instagramAccountId || "",
    adAccountId: initialSettings?.adAccountId || "",
    pageId: initialSettings?.pageId || "",
    isConnected: initialSettings?.isConnected || false,
    source: initialSettings?.source || "none",
  });

  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<{
    username?: string;
    name?: string;
    followersCount?: number;
    profilePictureUrl?: string;
  } | null>(null);

  // Charger les paramètres récents au montage
  useEffect(() => {
    async function loadCurrent() {
      try {
        const res = await getMetaSettingsAction();
        if (res.success && res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            accessToken: res.data.rawAccessToken || res.data.accessToken || prev.accessToken,
          }));
        }
      } catch (err) {
        console.error("Failed to load meta settings:", err);
      }
    }
    loadCurrent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await updateMetaCredentials({
        appId: formData.appId?.trim() || undefined,
        appSecret: formData.appSecret?.trim() || undefined,
        accessToken: formData.accessToken?.trim(),
        instagramAccountId: formData.instagramAccountId?.trim(),
        adAccountId: formData.adAccountId?.trim() || undefined,
        pageId: formData.pageId?.trim() || undefined,
      });

      if (result.success && result.data) {
        setSuccessMessage(result.data.message || "Connexion Meta validée et enregistrée !");
        setFormData((prev) => ({ ...prev, isConnected: true }));
        if (result.data.account) {
          setConnectedAccount(result.data.account);
        }
      } else {
        setErrorMessage(
          result.error || "Échec de validation des identifiants avec la Meta Graph API."
        );
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Une erreur réseau inattendue est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Êtes-vous sûr de vouloir déconnecter l'intégration Meta & Instagram ?")) {
      return;
    }

    setIsDisconnecting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await disconnectMetaAction();
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          isConnected: false,
          accessToken: "",
        }));
        setConnectedAccount(null);
        setSuccessMessage("Intégration Meta déconnectée.");
      } else {
        setErrorMessage(res.error || "Impossible de déconnecter l'intégration.");
      }
    } catch {
      setErrorMessage("Erreur lors de la déconnexion.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span>Intégration Meta (Instagram & Ads)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Synchronisez vos campagnes publicitaires, followers et top Reels directement depuis la base MySQL.
              </CardDescription>
            </div>
          </div>

          {/* Badge de Statut de Connexion */}
          <div>
            {formData.isConnected ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30 gap-1.5 px-3 py-1 font-semibold text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Connecté à Meta Graph API
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-300 text-red-600 bg-red-50 dark:bg-red-950/30 gap-1.5 px-3 py-1 font-semibold text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Non Connecté
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-5">
          {/* Notifications Succès / Erreur */}
          {successMessage && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3.5 text-xs text-red-800 dark:text-red-300">
              <XCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Carte Compte Connecté si actif */}
          {formData.isConnected && connectedAccount && (
            <div className="flex items-center justify-between rounded-xl border bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-900/40 p-4">
              <div className="flex items-center gap-3">
                {connectedAccount.profilePictureUrl ? (
                  <img
                    src={connectedAccount.profilePictureUrl}
                    alt={connectedAccount.username || "Instagram"}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold">
                    IG
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <span>@{connectedAccount.username}</span>
                    <ShieldCheck className="h-4 w-4 text-sky-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">{connectedAccount.name}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Abonnés
                </span>
                <span className="text-lg font-bold text-foreground font-mono">
                  {connectedAccount.followersCount?.toLocaleString("fr-FR")}
                </span>
              </div>
            </div>
          )}

          {/* Grille des Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instagram Account ID */}
            <div className="space-y-1.5">
              <Label htmlFor="instagramAccountId" className="text-xs font-semibold flex items-center justify-between">
                <span>Instagram Business Account ID *</span>
                <span className="text-[10px] text-muted-foreground">Requis</span>
              </Label>
              <Input
                id="instagramAccountId"
                name="instagramAccountId"
                value={formData.instagramAccountId}
                onChange={handleChange}
                placeholder="ex: 17841405309211234"
                required
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                L'identifiant numérique de votre compte Instagram Business lié à votre page Meta.
              </p>
            </div>

            {/* Page Access Token */}
            <div className="space-y-1.5">
              <Label htmlFor="accessToken" className="text-xs font-semibold flex items-center justify-between">
                <span>Meta Graph Access Token *</span>
                <span className="text-[10px] text-muted-foreground">Requis (Long-lived)</span>
              </Label>
              <div className="relative">
                <Input
                  id="accessToken"
                  name="accessToken"
                  type={showToken ? "text" : "password"}
                  value={formData.accessToken}
                  onChange={handleChange}
                  placeholder="EAABw..."
                  required
                  className="font-mono text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Token avec permissions : <code>instagram_basic</code>, <code>pages_show_list</code>, <code>ads_read</code>.
              </p>
            </div>

            {/* Ad Account ID */}
            <div className="space-y-1.5">
              <Label htmlFor="adAccountId" className="text-xs font-semibold flex items-center justify-between">
                <span>Meta Ad Account ID</span>
                <span className="text-[10px] text-muted-foreground">Optionnel</span>
              </Label>
              <Input
                id="adAccountId"
                name="adAccountId"
                value={formData.adAccountId}
                onChange={handleChange}
                placeholder="ex: act_1234567890"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Permet de synchroniser les métriques de dépenses et ROI publicitaires.
              </p>
            </div>

            {/* Facebook Page ID */}
            <div className="space-y-1.5">
              <Label htmlFor="pageId" className="text-xs font-semibold flex items-center justify-between">
                <span>Facebook Page ID</span>
                <span className="text-[10px] text-muted-foreground">Optionnel</span>
              </Label>
              <Input
                id="pageId"
                name="pageId"
                value={formData.pageId}
                onChange={handleChange}
                placeholder="ex: 1029384756"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                ID de la page Facebook associée à la boutique.
              </p>
            </div>

            {/* App ID */}
            <div className="space-y-1.5">
              <Label htmlFor="appId" className="text-xs font-semibold flex items-center justify-between">
                <span>Meta App ID</span>
                <span className="text-[10px] text-muted-foreground">Optionnel</span>
              </Label>
              <Input
                id="appId"
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                placeholder="ex: 9876543210"
                className="font-mono text-xs"
              />
            </div>

            {/* App Secret */}
            <div className="space-y-1.5">
              <Label htmlFor="appSecret" className="text-xs font-semibold flex items-center justify-between">
                <span>Meta App Secret</span>
                <span className="text-[10px] text-muted-foreground">Optionnel</span>
              </Label>
              <Input
                id="appSecret"
                name="appSecret"
                type="password"
                value={formData.appSecret}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className={`h-3 w-3 ${formData.isConnected ? "text-emerald-500 animate-ping" : "text-slate-400"}`} />
            <span>
              Source actuelle : <strong>{formData.source === "database" ? "Table MySQL (Dynamique)" : formData.source === "env" ? "Fichier .env" : "Aucune"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {formData.isConnected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting || isLoading}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Déconnexion...
                  </>
                ) : (
                  "Déconnecter"
                )}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading || isDisconnecting}
              size="sm"
              className="gap-2 h-9 bg-primary text-xs font-semibold px-4 w-full sm:w-auto shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validation Meta API...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tester & Enregistrer</span>
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
