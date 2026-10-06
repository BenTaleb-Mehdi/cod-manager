"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAIStoreAudit, generateReelScript } from "@/actions/ai-advisor";
import { getInventoryAction } from "@/actions/inventory";
import { Product } from "@/types";
import {
  Sparkles,
  Bot,
  User,
  Send,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Film,
  Zap,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Camera,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  "💡 Kifash n9ess men les retours (NPAI) au Maroc ?",
  "📦 Fikra d'offre Bundle 2+1 pour booster le panier moyen",
  "📞 Script de relance Call Center pour les 'Pas de réponse'",
  "🚚 Chnou ahsan transporteur f Casa & Marrakech ?",
];

export function AIAdvisorPanel() {
  // --- États Rapport Stratégique ---
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [copiedAudit, setCopiedAudit] = useState(false);

  // --- États Produits & Multimodalité ---
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageMime, setCustomImageMime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- États Générateur de Script Reel ---
  const [reelScript, setReelScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // --- États Chat en Direct ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Salam ! Je suis votre Conseiller Stratégique IA propulsé par **Gemini 2.5 Flash**. J'ai accès en temps réel aux données de vos commandes et performances Reels. Posez-moi vos questions sur l'acquisition Meta, l'optimisation Call Center ou la réduction de vos retours au Maroc !",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Charger les produits réels au montage pour le sélecteur
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getInventoryAction();
        if (res.success && res.data && res.data.products.length > 0) {
          setProducts(res.data.products);
          const first = res.data.products[0];
          setSelectedProduct(first);
          setCustomName(first.name);
          setCustomPrice(String(first.salePrice));
        }
      } catch (err) {
        console.warn("Could not load products for AI script selector:", err);
      }
    }
    loadProducts();
  }, []);

  // Auto-scroll du chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Sélection d'un produit depuis la liste
  const handleSelectProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      setCustomName(prod.name);
      setCustomPrice(String(prod.salePrice));
      setCustomImageBase64(null); // Réinitialiser l'image personnalisée pour utiliser celle du produit
    }
  };

  // Upload manuel d'une photo réelle du produit
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type || "image/jpeg";
    setCustomImageMime(mime);

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setCustomImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  // Génération de l'audit complet du store
  const handleGenerateAudit = async () => {
    setIsGeneratingAudit(true);
    setAuditError(null);
    try {
      const res = await generateAIStoreAudit();
      if (res.success && res.data) {
        setAuditReport(res.data);
      } else {
        setAuditError(res.error || "Impossible de générer l'audit du store.");
      }
    } catch (e) {
      setAuditError(e instanceof Error ? e.message : "Erreur inattendue lors de l'audit.");
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  // Copie de l'audit dans le presse-papiers
  const handleCopyAudit = () => {
    if (!auditReport) return;
    navigator.clipboard.writeText(auditReport);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  // Génération du script Reel avec ANALYSE MULTIMODALE DE L'IMAGE
  const handleGenerateScript = async () => {
    const nameToUse = customName.trim() || selectedProduct?.name || "";
    if (!nameToUse) {
      setScriptError("Veuillez sélectionner ou saisir le nom exact de votre produit.");
      return;
    }

    setIsGeneratingScript(true);
    setScriptError(null);
    try {
      const priceVal = parseFloat(customPrice) || selectedProduct?.salePrice || 199;
      const effectiveImageUrl = customImageBase64 ? null : selectedProduct?.imageUrl || null;
      const effectiveBase64 = customImageBase64 || null;

      const res = await generateReelScript({
        productId: selectedProduct?.id,
        productName: nameToUse,
        productDescription: selectedProduct?.description || undefined,
        salePrice: priceVal,
        imageUrl: effectiveImageUrl,
        imageBase64: effectiveBase64,
        imageMimeType: customImageMime || "image/jpeg",
      });

      if (res.success && res.data) {
        setReelScript(res.data);
      } else {
        setScriptError(res.error || "Impossible de générer le script du Reel.");
      }
    } catch (e) {
      setScriptError(e instanceof Error ? e.message : "Erreur de génération.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Envoi d'un message dans le chat
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const payload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Erreur : ${data.error || "Impossible d'obtenir une réponse de l'IA."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Erreur réseau : impossible de joindre le service de chat IA.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const currentDisplayImage = customImageBase64 || selectedProduct?.imageUrl || null;

  return (
    <div className="space-y-6">
      {/* Bannière d'introduction du Conseiller IA */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Conseiller Stratégique IA & Vision Multimodale COD
                </h2>
                <Badge variant="outline" className="border-indigo-400 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Gemini 2.5 Flash
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Audit intelligent de vos Reels vs Ventes réelles, analyse par vision d'images de vos produits et chat opérationnel en Darija & Français.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateAudit}
              disabled={isGeneratingAudit}
              size="sm"
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:from-indigo-700 hover:to-purple-700 h-9"
            >
              {isGeneratingAudit ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Générer Audit Store</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Grille principale : 2 sections côte à côte */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ========================================================================= */}
        {/* SECTION 1 : PANNEAU RAPPORT STRATÉGIQUE & REEL SCRIPT MULTIMODAL          */}
        {/* ========================================================================= */}
        <div className="space-y-6 flex flex-col">
          {/* Module 1 : Audit Stratégique */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span>Audit & Diagnostic du Store</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Rapport en 4 volets croisant vos vues Reels et vos ventes livrées
                  </CardDescription>
                </div>
                {auditReport && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAudit}
                      className="h-8 gap-1 text-xs"
                    >
                      {copiedAudit ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateAudit}
                      disabled={isGeneratingAudit}
                      className="h-8 w-8 p-0"
                      title="Régénérer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 flex flex-col">
              {auditError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{auditError}</span>
                </div>
              )}

              {isGeneratingAudit ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
                    <Sparkles className="h-7 w-7 text-indigo-600 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Gemini 2.5 Flash analyse vos données réelles...
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Extraction des 6 meilleurs Reels, calcul des taux de livraison et détection des points de friction.
                    </p>
                  </div>
                </div>
              ) : auditReport ? (
                <div className="overflow-y-auto max-h-[380px] rounded-lg border bg-card p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground/90 space-y-3 shadow-inner">
                  {auditReport}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed bg-muted/10 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-xs font-semibold text-foreground">
                      Diagnostic Vues vs Ventes réelles
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Croisez vos métriques de vues Reels avec vos commandes livrées pour obtenir un plan d'action immédiat.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateAudit}
                    size="sm"
                    className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 h-8 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Lancer le Diagnostic IA</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Module 2 : Générateur de Script Reel Multimodal (Analyse Nom + Image) */}
          <Card className="shadow-sm border-purple-200 dark:border-purple-900/40">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Film className="h-4 w-4 text-purple-600" />
                    <span>Script Reel 30s : Analyse Visuelle & Produit Réel</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    L'IA inspecte visuellement la photo de votre produit réel pour rédiger un script 100% fidèle et percutant en Darija
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/40 text-[10px] gap-1 font-semibold">
                  <Eye className="h-3 w-3" />
                  Vision Multimodale
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Sélecteur de Produit Réel depuis l'inventaire */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>1. Choisir un produit de votre boutique :</span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    ({products.length} produits trouvés)
                  </span>
                </label>

                {products.length > 0 ? (
                  <Select
                    value={selectedProduct?.id || ""}
                    onValueChange={handleSelectProduct}
                  >
                    <SelectTrigger className="h-9 text-xs bg-card">
                      <SelectValue placeholder="Sélectionnez un produit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          <span className="font-semibold">{p.name}</span> —{" "}
                          <span className="text-emerald-600 font-mono font-medium">
                            {Number(p.salePrice)} MAD
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Aucun produit en base de données. Vous pouvez renseigner les détails ci-dessous.
                  </p>
                )}
              </div>

              {/* Détails du Produit & Image Prise en Charge */}
              <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Nom exact du produit :
                    </label>
                    <Input
                      placeholder="Ex: Hachoir Électrique Multifonction..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="h-8 text-xs bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Prix de Vente (MAD) :
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 249"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="h-8 text-xs bg-card font-mono"
                    />
                  </div>
                </div>

                {/* Section Image : Affichage & Upload */}
                <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {currentDisplayImage ? (
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden border bg-background shadow-sm shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentDisplayImage}
                          alt="Produit à analyser"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground shrink-0">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}

                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">
                          {currentDisplayImage ? "Photo du produit prête" : "Aucune photo associée"}
                        </span>
                        {currentDisplayImage && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {customImageBase64
                          ? "Photo importée depuis votre appareil."
                          : selectedProduct?.imageUrl
                          ? "Photo extraite de votre catalogue produit."
                          : "Ajoutez une photo pour que l'IA décrive fidèlement l'objet."}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex justify-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 h-8 text-xs border-dashed text-purple-700 dark:text-purple-300 w-full sm:w-auto"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>{currentDisplayImage ? "Changer la photo" : "Uploader une photo"}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bouton de Génération du Script */}
              <Button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript || !customName.trim()}
                className="w-full gap-2 h-9 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow"
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Gemini 2.5 Flash analyse l'image et rédige le script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Générer Script Reel 30s (Fidèle à mon produit)</span>
                  </>
                )}
              </Button>

              {scriptError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{scriptError}</span>
                </div>
              )}

              {/* Résultat du Script Généré */}
              {reelScript && (
                <div className="rounded-lg border bg-purple-50/50 dark:bg-purple-950/20 p-3.5 text-xs space-y-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                      <Film className="h-3.5 w-3.5" />
                      Script 30s en Darija (Basé sur la photo) :
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(reelScript);
                        setCopiedScript(true);
                        setTimeout(() => setCopiedScript(false), 2000);
                      }}
                      className="h-6 px-2 text-[10px] text-purple-700 hover:bg-purple-100"
                    >
                      {copiedScript ? "Copié !" : "Copier le script"}
                    </Button>
                  </div>
                  <div className="whitespace-pre-wrap max-h-56 overflow-y-auto text-foreground font-mono text-[11px] leading-relaxed">
                    {reelScript}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2 : PANNEAU CHAT EN DIRECT                                       */}
        {/* ========================================================================= */}
        <Card className="flex flex-col shadow-sm h-full min-h-[640px]">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    Copilote IA Conversationnel
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Posez vos questions sur la rentabilité, le Call Center ou vos publicités
                  </CardDescription>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome-reset",
                      role: "assistant",
                      content:
                        "Historique réinitialisé. Je suis prêt pour vos questions stratégiques !",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ])
                }
                className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Effacer
              </Button>
            </div>
          </CardHeader>

          {/* Corps de discussion scrollable */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[500px]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted/70 text-foreground border rounded-tl-none whitespace-pre-wrap font-sans"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex gap-2.5 justify-start items-center text-xs text-muted-foreground animate-pulse pl-9">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Le Conseiller IA rédige sa recommandation...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </CardContent>

          {/* Suggestions rapides en chips */}
          <div className="px-4 py-2 border-t bg-muted/10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Suggestions rapides :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isChatLoading}
                  className="rounded-full border bg-card px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Barre de saisie */}
          <div className="p-3 border-t bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Posez votre question en Français ou Darija..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isChatLoading}
                className="h-10 text-xs sm:text-sm"
              />
              <Button
                type="submit"
                disabled={isChatLoading || !inputMessage.trim()}
                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
              >
                {isChatLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
