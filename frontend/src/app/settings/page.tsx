import React from "react";
import { getStoreSettingsAction } from "@/actions/settings";
import { getMetaSettingsAction } from "@/actions/meta-settings";
import { StoreSettingsForm } from "@/components/settings/StoreSettingsForm";
import { SecuritySettingsForm } from "@/components/settings/SecuritySettingsForm";
import { CouriersList } from "@/components/settings/CouriersList";
import { MetaIntegrationCard } from "@/components/settings/meta-integration-card";
import { SocialAnalyticsPreview } from "@/components/settings/social-analytics-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Shield, Settings, Truck, Instagram } from "lucide-react";

export default async function SettingsPage() {
  const [storeRes, metaRes] = await Promise.all([
    getStoreSettingsAction(),
    getMetaSettingsAction(),
  ]);

  const settings = storeRes.success && storeRes.data ? storeRes.data : {};
  const metaSettings = metaRes.success && metaRes.data ? metaRes.data : {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Paramètres du Système COD
        </h1>
        <p className="text-sm text-muted-foreground">
          Configuration des mentions légales de la boutique, facturation, sociétés de livraison, intégrations Meta et sécurité.
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="bg-card border p-1 shadow-sm flex flex-wrap h-auto gap-1">
          <TabsTrigger value="store" className="gap-2 text-xs">
            <Store className="h-4 w-4" />
            <span>Boutique & Mentions Légales</span>
          </TabsTrigger>
          <TabsTrigger value="couriers" className="gap-2 text-xs">
            <Truck className="h-4 w-4 text-sky-600" />
            <span>Sociétés de Livraison & APIs</span>
          </TabsTrigger>
          <TabsTrigger value="meta" className="gap-2 text-xs">
            <Instagram className="h-4 w-4 text-rose-500" />
            <span>Intégrations Meta & Ads</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-xs">
            <Shield className="h-4 w-4" />
            <span>Sécurité & Profil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <StoreSettingsForm initialSettings={settings} />
        </TabsContent>

        <TabsContent value="couriers" className="space-y-4">
          <CouriersList />
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          <MetaIntegrationCard initialSettings={metaSettings} />
          <SocialAnalyticsPreview />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}


