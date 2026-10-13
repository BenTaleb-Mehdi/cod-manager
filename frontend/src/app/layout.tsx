import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { StorefrontOrAdminShell } from "@/components/layout/StorefrontOrAdminShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MÉRAF | Fine Jewelry & Créations Inaltérables (Paiement à la Livraison Maroc)",
  description:
    "Maison MÉRAF Fine Jewelry. Créations joaillières d'exception en Acier Inoxydable 316L certifié et plaqué or 18k inaltérable. Livraison gratuite 24/48h et paiement à la livraison (COD) après ouverture du colis partout au Maroc.",
  keywords: [
    "meraf jewelry",
    "fine jewelry maroc",
    "bijoux luxe maroc",
    "slasel maroc",
    "dmalj maroc",
    "khowatem maroc",
    "khwarsi maroc",
    "acier inoxydable 316L",
    "paiement a la livraison",
    "cash on delivery maroc",
  ],
  openGraph: {
    title: "MÉRAF Jewelry Maroc | Joaillerie Intemporelle & Inaltérable",
    description: "Commandez en 1 Clic avec Paiement à la Livraison partout au Maroc après vérification.",
    locale: "fr_MA",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B2D23",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <StorefrontOrAdminShell>{children}</StorefrontOrAdminShell>
      </body>
    </html>
  );
}
