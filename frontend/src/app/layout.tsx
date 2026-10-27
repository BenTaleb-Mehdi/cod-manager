import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { StorefrontOrAdminShell } from "@/components/layout/StorefrontOrAdminShell";
import { Analytics } from "@vercel/analytics/next"
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "MÉRAF | Accessoires & Bijoux Acier Inoxydable Haute Qualité Maroc",
  description:
    "Maison MÉRAF. Accessoires & bijoux tendance pour femmes et jeunes filles en Acier Inoxydable 316L haute qualité. Finition dorée inaltérable, résistant à l'eau, ne noircit jamais. Livraison gratuite partout au Maroc et paiement à la livraison après inspection.",
  keywords: [
    "meraf accessories",
    "accessoires femmes maroc",
    "accessoires filles maroc",
    "bijoux acier inoxydable maroc",
    "acier 316L inaltérable",
    "bijoux waterproof maroc",
    "bijoux ne noircit pas",
    "slasel inox",
    "dmalj inox",
    "khowatem inox",
    "paiement a la livraison maroc",
  ],
  openGraph: {
    title: "MÉRAF | Accessoires & Bijoux Acier Inoxydable Inaltérables",
    description: "Accessoires haute qualité pour femmes et filles. 100% waterproof, ne noircit pas. Paiement à la livraison après vérification.",
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
    <html
      lang="fr"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Analytics/>
        <StorefrontOrAdminShell>{children}</StorefrontOrAdminShell>
      </body>
    </html>
  );
}
