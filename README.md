# 🇲🇦 COD Manager Maroc

> **Plateforme de Gestion E-commerce Cash on Delivery (COD) & Call Center optimisée pour le marché marocain.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2d3748?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 📋 Table des Matières

- [Présentation](#-présentation)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Architecture & Technologies](#-architecture--technologies)
- [Structure du Projet](#-structure-du-projet)
- [Prérequis & Installation](#-prérequis--installation)
- [Variables d'Environnement](#-variables-denvironnement)
- [Scripts Disponibles](#-scripts-disponibles)
- [Module d'Impression & QR Code](#-module-dimpression--qr-code)
- [Mentions Légales Marocaines](#-mentions-légales-marocaines)

---

## 🌟 Présentation

**COD Manager Maroc** est une solution complète conçue pour répondre aux défis spécifiques du commerce électronique en paiement à la livraison (**Cash on Delivery - COD**) au Maroc.

Elle centralise tout le cycle de vie d'une commande : de l'acquisition jusqu'à l'encaissement des fonds par le livreur, en passant par la confirmation téléphonique Call Center, l'expédition, le suivi GPS en temps réel et la gestion des stocks.

---

## 🚀 Fonctionnalités Principales

### 1. 📞 Call Center & Confirmation des Commandes
- **Workflow de confirmation rapide** : Validation en 1 clic vers le statut `CONFIRMÉ`.
- **Gestion des "Pas de Réponse" (Relances)** : Compteur de tentatives d'appel, bouton d'incrémentation rapide et badge de relance automatique.
- **Formatage des numéros marocains** : Détection et affichage optimisé des numéros mobiles (Maroc Telecom, Orange, Inwi : `06...`, `07...`).
- **Attribution aux agents** : Répartition des commandes par agent de confirmation.

### 2. 📦 Gestion Avancée des Commandes (Data Table)
- **Table TanStack Table v8** performante avec pagination, tri multi-colonnes et sélection en masse.
- **Actions groupées (Bulk)** : Changement de statut de masse, affectation groupée à un livreur ou un agent.
- **Filtres multicritères** : Filtrage par statut COD (`NOUVEAU`, `CONFIRMÉ`, `EXPÉDIÉ`, `LIVRÉ`, `RETOURNÉ`, `ANNULÉ`), par ville marocaine (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir...), et recherche globale instantanée.

### 3. 🚚 Expédition & Suivi GPS en Temps Réel
- **Intégration Transporteurs / Livreurs** : Attribution des colis aux livreurs partenaires (Cathedis, Ameex, Ozone, Colis Privé...).
- **Suivi GPS OpenStreetMap** : Visualisation cartographique de la localisation du colis et des coordonnées de destination.
- **Bordereaux de livraison** : Suivi des statuts d'acheminement et gestion des motifs de non-livraison ou de retour.

### 4. 🧾 Facturation Légale A4 & Tickets Thermiques 80mm
- **Facture Standard A4** : Conforme aux obligations légales marocaines avec mentions obligatoires (**ICE**, **Identifiant Fiscal IF**, **Taxe Professionnelle / Patente**).
- **Ticket Thermique (Format 80mm POS)** : Format compact adapté aux imprimantes thermiques de caisse et livreurs (coordonnées en grand, articles, montant exact à encaisser en espèces).
- **QR Code Vectoriel Intégré (100% Hors-Ligne)** : Générateur QR Code SVG natif sans dépendance externe. Le scan avec un smartphone (iOS / Android) ouvre directement la page de suivi et les détails de la commande.
- **Impression optimisée (@media print)** : Masquage automatique de la navigation, des en-têtes et des boutons lors de l'impression physique.

### 5. 🏷️ Inventaire, Marges & Fournisseurs
- **Gestion des produits & SKU** : Références uniques, prix d'achat (coût), prix de vente conseillé et calcul automatique de la marge brute.
- **Alertes de stock** : Notification visuelle dès qu'un produit passe sous le seuil critique (≤ 5 unités).
- **Gestion des Fournisseurs** : Suivi des dettes fournisseurs (*Balance Due*), bons de commande d'approvisionnement et réassort.

---

## 🛠️ Architecture & Technologies

```
                  ┌────────────────────────────────────────┐
                  │          Frontend (Next.js 14)         │
                  │   App Router • Tailwind CSS • Lucide   │
                  │       TanStack Table v8 • SVG QR       │
                  └───────────────────┬────────────────────┘
                                      │ REST API / Server Actions
                                      ▼
                  ┌────────────────────────────────────────┐
                  │          Backend (Next.js 14)          │
                  │    API Routes • Zod Validations        │
                  │       Prisma ORM • BcryptJS            │
                  └───────────────────┬────────────────────┘
                                      │ Connection Pool
                                      ▼
                  ┌────────────────────────────────────────┐
                  │             MySQL Database             │
                  │ Orders • Invoices • Products • Stores  │
                  └────────────────────────────────────────┘
```

| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | Interface utilisateur réactive et Server Components |
| **Styling** | Tailwind CSS | Système de design moderne avec support dark mode & print |
| **Composants UI** | Radix UI + Lucide Icons | Composants accessibles (Dialogs, Dropdowns, Badges) |
| **Tableaux** | TanStack Table v8 | Tri, filtres, sélection et pagination haute performance |
| **Backend** | Next.js 14 Route Handlers | API REST sécurisée avec validation Zod |
| **ORM** | Prisma 5.20 | Modélisation et requêtage typé de la base de données |
| **Base de Données** | MySQL 8.0 | Stockage relationnel robuste avec relations et index |

---

## 📁 Structure du Projet

```bash
cod-manager/
├── backend/
│   ├── app/
│   │   └── api/                # Endpoints API REST
│   │       ├── auth/           # Authentification & sessions
│   │       ├── dashboard/      # Métriques & KPI
│   │       ├── inventory/      # Produits & stocks
│   │       ├── invoices/       # Génération factures & tickets
│   │       ├── orders/         # Gestion & tracking commandes
│   │       └── suppliers/      # Fournisseurs & réapprovisionnement
│   ├── lib/
│   │   ├── db.ts               # Instance Prisma Client
│   │   ├── validations/        # Schémas de validation Zod
│   │   └── api-response.ts     # Helpers de réponse JSON
│   ├── prisma/
│   │   └── schema.prisma       # Schéma de base de données MySQL
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── actions/            # Server Actions & clients API
│   │   ├── app/
│   │   │   ├── inventory/      # Page Gestion d'inventaire
│   │   │   ├── orders/         # Page Commandes, Factures & Tracking
│   │   │   │   └── [id]/
│   │   │   │       ├── invoice/  # Vue Facture A4 & Ticket 80mm
│   │   │   │       └── tracking/ # Vue Suivi GPS & Livreur
│   │   │   ├── settings/       # Paramètres boutique (ICE, Patente...)
│   │   │   ├── suppliers/      # Page Fournisseurs
│   │   │   ├── globals.css     # Styles globaux & règles @media print
│   │   │   └── layout.tsx      # Layout principal (Sidebar + Navbar)
│   │   ├── components/
│   │   │   ├── inventory/      # Modals ajout produit & catégorie
│   │   │   ├── invoices/       # InvoiceView & actions d'impression
│   │   │   ├── layout/         # Navbar & Sidebar réactives
│   │   │   ├── orders/         # OrderDataTable, colonnes & filtres
│   │   │   └── ui/             # Composants réutilisables & QRCodeImage
│   │   └── lib/
│   │       ├── moroccan-data.ts# Villes marocaines & indicatifs
│   │       ├── qr-generator.ts # Moteur QR Code vectoriel pur
│   │       └── utils.ts        # Formatage prix (MAD), téléphones & dates
│   └── package.json
│
└── README.md
```

---

## ⚡ Prérequis & Installation

### Prérequis
- **Node.js** : version `18.17.0` ou supérieure
- **MySQL** : version `8.0` ou compatible (MariaDB)
- **Gestionnaire de paquets** : `npm` ou `yarn`

### 1. Cloner le Répertoire
```bash
git clone https://github.com/votre-nom/cod-manager.git
cd cod-manager
```

### 2. Configuration du Backend
```bash
cd backend
npm install
```

Configurez votre fichier `.env` dans le dossier `backend/` :
```env
DATABASE_URL="mysql://root:motdepasse@localhost:3306/cod_manager_db"
JWT_SECRET="votre_secret_jwt_super_securise"
PORT=3001
```

Exécutez les migrations Prisma pour créer les tables :
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Lancez le serveur backend :
```bash
npm run dev
# Le backend démarre sur http://localhost:3001
```

### 3. Configuration du Frontend
Dans un nouveau terminal :
```bash
cd frontend
npm install
```

Configurez le fichier `.env.local` dans le dossier `frontend/` :
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Lancez le serveur frontend :
```bash
npm run dev
# Le frontend démarre sur http://localhost:3000
```

---

## 🖨️ Module d'Impression & QR Code

Le système intègre un moteur d'impression professionnel sans aucune dépendance cloud :

1. **Format Facture A4** :
   - Mise en page aérée conforme aux standards administratifs marocains.
   - Intègre le logo, l'ICE, l'IF, le numéro de patente et les coordonnées complètes du client.
   - QR code haute définition dans l'en-tête.

2. **Format Ticket Thermique 80mm** :
   - Largeur fixe `80mm` pour imprimantes POS (Epson, Xprinter, ZJ-80, etc.).
   - Téléphone client mis en avant pour les livreurs.
   - Encadré du montant exact **COD à encaisser en espèces**.

3. **QR Code Vectoriel Autonome** :
   - Moteur mathématique pur TypeScript ([qr-generator.ts](frontend/src/lib/qr-generator.ts)).
   - Rendu en `<svg>` vectoriel net (pas de pixellisation à l'impression).
   - Fonctionne 100% hors-ligne.
   - Le scan dirige vers la page de suivi en direct `/orders/[id]/tracking`.

---

## 🇲🇦 Mentions Légales Marocaines

Conformément à la législation fiscale et commerciale au Maroc (Code Général des Impôts et réglementation du commerce électronique) :
- **ICE** (Identifiant Commun de l'Entreprise) à 15 chiffres.
- **IF** (Identifiant Fiscal).
- **Patente** (Taxe Professionnelle).
- Mention expresse du mode de règlement : **Espèces à la livraison (Cash on Delivery)**.

Les paramètres de la boutique peuvent être modifiés à tout moment depuis la page `/settings`.

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<p align="center">
  Développé pour l'écosystème E-commerce & COD au Maroc 🇲🇦
</p>
