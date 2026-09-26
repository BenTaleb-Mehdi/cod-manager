import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COD Manager Maroc | Tableau de Bord E-commerce Local",
  description:
    "Interface haute performance pour Call Center et Gestion des Commandes Cash on Delivery au Maroc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full bg-muted/20 text-foreground print:bg-white print:h-auto print:overflow-visible`}>
        <div className="flex min-h-screen print:block print:min-h-0">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden print:block print:overflow-visible">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
