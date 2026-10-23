import { Product } from "@/types";
import { formatPriceMAD, formatMoroccanPhone } from "./utils";
import { getStoreSettingsAction } from "@/actions/settings";

export interface GenerateCatalogOptions {
  storeName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

/**
 * Génère le code HTML complet et optimisé pour l'impression A4 / PDF
 * du catalogue des produits actifs avec leurs images.
 */
export function generateCatalogHTML(
  products: Product[],
  options: GenerateCatalogOptions = {}
): string {
  const storeName = options.storeName || "Maison MÉRAF";
  const phone = options.phone || "0661000000";
  const formattedPhone = formatMoroccanPhone(phone);
  const email = options.email || "contact@maisonmeraf.ma";
  const address = options.address || "Casablanca, Maroc";
  const website = options.website || "meraf.store";
  const websiteUrl = website.startsWith("http") ? website : `https://${website}`;

  // Ne garder STRICTEMENT que les produits actifs
  const activeProducts = products.filter((p) => p.isActive !== false);

  // Grouper les produits par catégorie
  const categoriesMap = new Map<string, Product[]>();
  activeProducts.forEach((p) => {
    const catName = p.category?.name || "Articles Générales";
    if (!categoriesMap.has(catName)) {
      categoriesMap.set(catName, []);
    }
    categoriesMap.get(catName)!.push(p);
  });

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calcul des totaux actifs
  let totalActiveStock = 0;
  let totalActiveCost = 0;

  activeProducts.forEach((p) => {
    const stock = Number(p.stock) || 0;
    const cost = Number(p.costPrice) || 0;

    totalActiveStock += stock;
    totalActiveCost += cost * stock;
  });

  // Construction des sections par catégorie
  let categoriesHTML = "";

  categoriesMap.forEach((items, catName) => {
    const itemsHTML = items
      .map((p) => {
        // Résoudre l'URL de l'image (si chemin relatif, préfixer avec l'origine actuelle)
        let imgUrl = p.imageUrl || "";
        if (imgUrl.startsWith("/") && typeof window !== "undefined") {
          imgUrl = window.location.origin + imgUrl;
        }

        const cost = Number(p.costPrice) || 0;
        const costPriceFormatted = formatPriceMAD(cost);
        const inStock = p.stock > 0;

        return `
        <div class="product-card">
          <div class="image-wrapper">
            ${
              imgUrl
                ? `<img src="${imgUrl}" alt="${p.name}" class="product-img" loading="eager" />`
                : `<div class="placeholder-img"><span>Aucune image</span></div>`
            }
            <div class="sku-badge">${p.sku}</div>
          </div>
          <div class="product-info">
            <h3 class="product-title" title="${p.name}">${p.name}</h3>
            ${
              p.description
                ? `<p class="product-desc">${p.description}</p>`
                : ""
            }
            <div class="product-pricing">
              <div class="price-row">
                <div class="price-box cost-box">
                  <span class="price-tag">Prix Achat</span>
                  <span class="price-val cost-val">${costPriceFormatted}</span>
                </div>
                <div class="price-box quantity-box ${inStock ? "in-stock" : "out-of-stock"}">
                  <span class="price-tag">Quantité</span>
                  <span class="price-val quantity-val">${p.stock}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    categoriesHTML += `
      <section class="category-section">
        <div class="category-header">
          <h2 class="category-title">${catName}</h2>
          <span class="category-count">${items.length} article${items.length > 1 ? "s" : ""}</span>
        </div>
        <div class="products-grid">
          ${itemsHTML}
        </div>
      </section>
    `;
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Catalogue Produits Actifs - ${storeName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 10mm;
      @bottom-right {
        content: counter(page) "/" counter(pages);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #0f172a;
      line-height: 1.35;
      font-size: 11px;
    }

    /* En-tête officiel du catalogue */
    .catalog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 2px solid #0f172a;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-website-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .catalog-subtitle {
      font-size: 11px;
      font-weight: 600;
      color: #15803d;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .header-meta {
      text-align: right;
      font-size: 10px;
      color: #64748b;
    }

    .header-meta strong {
      color: #0f172a;
      font-size: 11px;
    }

    .site-link {
      color: #15803d;
      font-weight: 700;
      text-decoration: none;
    }

    .footer-link {
      color: #15803d;
      text-decoration: none;
      font-weight: 600;
    }

    /* Section Catégorie */
    .category-section {
      margin-bottom: 20px;
      break-inside: auto;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f1f5f9;
      border-left: 4px solid #15803d;
      padding: 6px 10px;
      margin-bottom: 10px;
      border-radius: 0 4px 4px 0;
      break-after: avoid;
    }

    .category-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: #0f172a;
    }

    .category-count {
      font-size: 10px;
      font-weight: 600;
      color: #15803d;
      background: #dcfce7;
      padding: 2px 8px;
      border-radius: 999px;
    }

    /* Grille Produits (3 par ligne sur A4) */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .product-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      display: flex;
      flex-direction: column;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 140px;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .placeholder-img {
      color: #94a3b8;
      font-size: 10px;
      font-weight: 500;
    }

    .sku-badge {
      position: absolute;
      top: 6px;
      left: 6px;
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }

    .product-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 28px;
    }

    .product-desc {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.2;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-pricing {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px dashed #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }

    .price-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 3px 6px;
      border-radius: 4px;
    }

    .cost-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .quantity-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      text-align: right;
    }

    .quantity-box.in-stock {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }

    .quantity-box.out-of-stock {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .quantity-box .price-tag {
      color: #64748b;
    }

    .quantity-box.in-stock .price-tag {
      color: #15803d;
    }

    .quantity-box.out-of-stock .price-tag {
      color: #b91c1c;
    }

    .price-tag {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: #64748b;
    }

    .price-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.2;
    }

    .cost-val {
      color: #334155;
    }

    .quantity-val {
      color: #0f172a;
      font-weight: 800;
    }

    .quantity-box.in-stock .quantity-val {
      color: #15803d;
    }

    .quantity-box.out-of-stock .quantity-val {
      color: #b91c1c;
    }

    /* Pied de page du document */
    .catalog-footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #64748b;
      break-inside: avoid;
    }

    /* Bouton d'action à l'écran (masqué à l'impression) */
    .screen-actions {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
    }

    .screen-actions button {
      background: #15803d;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }

    .screen-actions button:hover {
      background: #166534;
    }

    @media print {
      .screen-actions {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Barre d'action à l'écran avant impression -->
  <div class="screen-actions">
    <div>
      <div style="font-size: 13px; font-weight: 800;">${storeName} &bull; Catalogue Produits Actifs (${activeProducts.length} articles)</div>
      <div style="opacity: 0.9; margin-top: 3px; font-size: 11px;">
        <span>🌐 <a href="${websiteUrl}" target="_blank" style="color: #86efac; text-decoration: underline; font-weight: 700;">${website}</a></span>
        <span style="margin: 0 6px;">&bull;</span>
        <span>📞 Contact: <strong>${formattedPhone}</strong></span>
        <span style="margin: 0 6px;">&bull;</span>
        <span>Valeur Stock (Achat): <strong>${formatPriceMAD(totalActiveCost)}</strong></span>
      </div>
    </div>
    <button onclick="window.print()">
      🖨️ Télécharger en PDF / Imprimer
    </button>
  </div>

  <div style="padding: 0 10px;">
    <!-- En-tête -->
    <header class="catalog-header">
      <div>
        <div class="brand-row">
          <h1 class="brand-title">${storeName}</h1>
          <a href="${websiteUrl}" target="_blank" class="brand-website-badge" title="Visiter notre boutique en ligne">
            🌐 ${website}
          </a>
        </div>
        <p class="catalog-subtitle">Catalogue Officiel des Produits Actifs</p>
      </div>
      <div class="header-meta">
        <div><strong>Date :</strong> ${currentDate}</div>
        <div><strong>Contact :</strong> ${formattedPhone}</div>
        <div><strong>Site Web :</strong> <a href="${websiteUrl}" target="_blank" class="site-link">${website}</a></div>
        <div><strong>Total :</strong> ${activeProducts.length} références (${totalActiveStock} unités)</div>
        <div><strong>Valeur Stock (Achat) :</strong> ${formatPriceMAD(totalActiveCost)}</div>
      </div>
    </header>

    <!-- Contenu des catégories et produits -->
    ${categoriesHTML}

    <!-- Pied de page -->
    <footer class="catalog-footer">
      <div>
        <strong>${storeName}</strong> &bull; 
        <a href="${websiteUrl}" target="_blank" class="footer-link">🌐 ${website}</a> &bull; 
        📞 Tél: ${formattedPhone} &bull; ${address}
      </div>
      <div>
        Valable selon stock &bull; Commandes en ligne sur <a href="${websiteUrl}" target="_blank" class="footer-link">${website}</a> &bull; Document généré le ${currentDate}
      </div>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Ouvre le catalogue PDF dans un onglet dédié et déclenche directement
 * la boîte de dialogue d'enregistrement en PDF du navigateur.
 * Récupère dynamiquement le numéro de téléphone et les coordonnées depuis la BDD.
 */
export async function printActiveProductsCatalog(
  products: Product[],
  options: GenerateCatalogOptions = {}
) {
  const activeProducts = products.filter((p) => p.isActive !== false);

  if (activeProducts.length === 0) {
    alert("Aucun produit actif à afficher dans le catalogue.");
    return;
  }

  // Ouvrir immédiatement la fenêtre pour contourner le bloqueur de pop-up du navigateur
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert(
      "Veuillez autoriser les fenêtres pop-up dans votre navigateur pour télécharger le catalogue PDF."
    );
    return;
  }

  // Écran d'attente soigné le temps de récupérer les paramètres BDD
  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Préparation du Catalogue PDF...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
    }
    .box {
      text-align: center;
      background: #ffffff;
      padding: 28px 36px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      max-width: 360px;
    }
    .spin {
      display: inline-block;
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #15803d;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="box">
    <div class="spin"></div>
    <div style="font-weight: 700; font-size: 14px;">Génération du catalogue PDF...</div>
    <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
      Récupération du téléphone depuis la base de données &amp; chargement des photos
    </div>
  </div>
</body>
</html>`);
  printWindow.document.close();

  // Récupérer le numéro de téléphone et les coordonnées réelles depuis la base de données
  let phone = options.phone;
  let storeName = options.storeName;
  let address = options.address;
  const website = options.website || "meraf.store";

  if (!phone || !storeName) {
    try {
      const res = await getStoreSettingsAction();
      if (res && res.success && res.data) {
        if (!phone && res.data.phone) phone = res.data.phone;
        if (!storeName && res.data.storeName) storeName = res.data.storeName;
        if (!address && res.data.address) address = res.data.address;
      }
    } catch (err) {
      console.warn("Échec de récupération des paramètres en BDD, utilisation des valeurs par défaut :", err);
    }
  }

  const finalOptions: GenerateCatalogOptions = {
    storeName: storeName || "Maison MÉRAF",
    phone: phone || "0661000000",
    address: address || "Casablanca, Maroc",
    website: website || "meraf.store",
  };

  const html = generateCatalogHTML(activeProducts, finalOptions);

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Attendre le chargement complet des images avant de lancer l'impression automatique
  const triggerPrintWhenReady = () => {
    const images = printWindow.document.images;
    let loaded = 0;
    const total = images.length;

    if (total === 0) {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
      return;
    }

    const checkAllLoaded = () => {
      loaded++;
      if (loaded >= total) {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 350);
      }
    };

    for (let i = 0; i < total; i++) {
      if (images[i].complete) {
        loaded++;
      } else {
        images[i].addEventListener("load", checkAllLoaded);
        images[i].addEventListener("error", checkAllLoaded);
      }
    }

    if (loaded >= total) {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    }
  };

  if (printWindow.document.readyState === "complete") {
    triggerPrintWhenReady();
  } else {
    printWindow.addEventListener("load", triggerPrintWhenReady);
  }
}
