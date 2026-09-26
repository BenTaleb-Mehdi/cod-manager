import React from "react";
import { getStoreSettingsAction } from "@/actions/settings";
import { StoreSettingsForm } from "@/components/settings/StoreSettingsForm";
import { SecuritySettingsForm } from "@/components/settings/SecuritySettingsForm";
import { CouriersList } from "@/components/settings/CouriersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Shield, Settings, Truck } from "lucide-react";

export default async function SettingsPage() {
  const res = await getStoreSettingsAction();
  const settings = res.success && res.data ? res.data : {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Paramètres du Système COD
        </h1>
        <p className="text-sm text-muted-foreground">
          Configuration des mentions légales de la boutique, facturation, sociétés de livraison et sécurité.
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="bg-card border p-1 shadow-sm">
          <TabsTrigger value="store" className="gap-2 text-xs">
            <Store className="h-4 w-4" />
            <span>Boutique & Mentions Légales</span>
          </TabsTrigger>
          <TabsTrigger value="couriers" className="gap-2 text-xs">
            <Truck className="h-4 w-4 text-sky-600" />
            <span>Sociétés de Livraison & APIs</span>
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

        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

