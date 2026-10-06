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
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  BookOpen,
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
  const [showGuide, setShowGuide] = useState(false);
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
          const data = res.data;
          setFormData((prev) => ({
            ...prev,
            ...data,
            accessToken: (data as any).rawAccessToken || data.accessToken || prev.accessToken,
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
        const err = result.error || "Échec de validation des identifiants avec la Meta Graph API.";
        setErrorMessage(err);
        if (err.includes("190") || err.toLowerCase().includes("expir")) {
          setShowGuide(true);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur réseau inattendue est survenue.";
      setErrorMessage(msg);
      if (msg.includes("190") || msg.toLowerCase().includes("expir")) {
        setShowGuide(true);
      }
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

          {/* Badge de Statut de Connexion & Bouton Guide */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(!showGuide)}
              className="h-8 gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Guide Token Permanent</span>
              {showGuide ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>

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
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3.5 text-xs text-red-800 dark:text-red-300">
                <XCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>

              {(errorMessage.includes("190") || errorMessage.toLowerCase().includes("expir")) && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50/90 dark:bg-amber-950/40 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <p className="font-semibold text-xs">Pourquoi cette erreur d'expiration (Code 190) ?</p>
                    <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                      Les tokens générés via l'outil <strong>Graph API Explorer</strong> ont une durée de validité courte (1 à 2 heures). Pour que votre synchronisation COD Manager reste active en continu, générez un <strong>Token Permanent</strong> via un Utilisateur Système Meta Business.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowGuide(true)}
                        className="h-7 text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 gap-1.5"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Voir comment obtenir un Token Permanent</span>
                      </Button>
                      <a
                        href="https://business.facebook.com/settings/system-users"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 hover:underline"
                      >
                        <span>Ouvrir Meta Business Settings</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guide Interactif Token Permanent Meta */}
          {showGuide && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-purple-950/30 p-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Comment obtenir un Token Permanent (Qui n'expire jamais) ?</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuide(false)}
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Fermer
                </Button>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Par défaut, les tokens générés sur l'explorateur Meta expirent après 1 à 2 heures (Erreur 190).
                Pour que COD Manager fonctionne en continu sans coupure, suivez cette méthode recommandée :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                <div className="rounded-lg bg-card border p-3 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">1</span>
                    <span>Utilisateur Système</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Allez dans <strong>Meta Business Suite</strong> &gt; Paramètres &gt; <strong>Utilisateurs système</strong>. Créez un utilisateur avec le rôle <em>Admin</em>.
                  </p>
                  <a
                    href="https://business.facebook.com/settings/system-users"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                  >
                    <span>Ouvrir Business Suite</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg bg-card border p-3 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">2</span>
                    <span>Attribuer les Actifs</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Cliquez sur <em>Ajouter des actifs</em> et associez votre <strong>Page Facebook</strong>, <strong>Compte Instagram</strong> et compte publicitaire.
                  </p>
                </div>

                <div className="rounded-lg bg-card border p-3 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">3</span>
                    <span>Générer avec "Jamais"</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Cliquez sur <em>Générer un token</em>, réglez l'expiration sur <strong>Jamais</strong>, cochez les permissions ci-dessous et collez le token ici.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Permissions requises :</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono">instagram_basic</code>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono">instagram_manage_insights</code>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono">pages_show_list</code>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono">pages_read_engagement</code>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-mono">ads_read (optionnel)</code>
              </div>

              <div className="rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-2.5 text-[11px] text-indigo-900 dark:text-indigo-300">
                <strong>Astuce automatique :</strong> Si vous renseignez également votre <em>Meta App ID</em> et <em>Meta App Secret</em>, COD Manager convertit automatiquement vos tokens temporaires en tokens longue durée (60 jours) ou permanents lors de l'enregistrement.
              </div>
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
