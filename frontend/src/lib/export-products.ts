import { Product } from "@/types";

/**
 * Nettoie une chaîne de caractères pour le XML
 */
function escapeXML(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Nettoie une valeur pour le format CSV
 */
function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val).replace(/"/g, '""');
  if (str.includes(";") || str.includes("\n") || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

/**
 * Déclenche le téléchargement d'un fichier dans le navigateur
 */
function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporte la liste des produits au format Excel XML (.xls / .xlsx compatible)
 * avec mise en page stylisée, couleurs professionnelles et calculs automatiques.
 */
export function exportProductsToExcel(
  products: Product[],
  customFilename?: string
) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = customFilename || `catalogue_produits_${dateStr}.xls`;

  // Calcul des totaux
  let totalStock = 0;
  let totalCostValuation = 0;
  let totalRevenueValuation = 0;

  products.forEach((p) => {
    const cost = Number(p.costPrice) || 0;
    const sale = Number(p.salePrice) || 0;
    const stock = Number(p.stock) || 0;
    totalStock += stock;
    totalCostValuation += cost * stock;
    totalRevenueValuation += sale * stock;
  });

  const xmlRows = products.map((p, idx) => {
    const cost = Number(p.costPrice) || 0;
    const sale = Number(p.salePrice) || 0;
    const stock = Number(p.stock) || 0;
    const threshold = p.lowStockThreshold ?? 5;
    const margin = sale - cost;
    const marginPct = sale > 0 ? (margin / sale) * 100 : 0;
    const isActive = p.isActive !== false;
    const stockValuation = cost * stock;
    const potentialRevenue = sale * stock;

    let stockStatus = "En Stock";
    if (stock <= 0) stockStatus = "Rupture";
    else if (stock <= threshold) stockStatus = `Stock Faible (≤ ${threshold})`;

    const rowStyle = idx % 2 === 1 ? ' ss:StyleID="RowEven"' : "";

    return `
    <Row${rowStyle} ss:Height="22">
      <Cell ss:StyleID="CenterText"><Data ss:Type="String">${escapeXML(p.sku)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXML(p.name)}</Data></Cell>
      <Cell ss:StyleID="CenterText"><Data ss:Type="String">${escapeXML(p.category?.name || "Général")}</Data></Cell>
      <Cell ss:StyleID="${isActive ? "StatusActive" : "StatusInactive"}"><Data ss:Type="String">${isActive ? "Actif" : "Inactif"}</Data></Cell>
      <Cell ss:StyleID="Price"><Data ss:Type="Number">${cost.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="Price"><Data ss:Type="Number">${sale.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="Price"><Data ss:Type="Number">${margin.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="Percent"><Data ss:Type="Number">${(marginPct / 100).toFixed(3)}</Data></Cell>
      <Cell ss:StyleID="Integer"><Data ss:Type="Number">${stock}</Data></Cell>
      <Cell ss:StyleID="Integer"><Data ss:Type="Number">${threshold}</Data></Cell>
      <Cell ss:StyleID="CenterText"><Data ss:Type="String">${escapeXML(stockStatus)}</Data></Cell>
      <Cell ss:StyleID="Price"><Data ss:Type="Number">${stockValuation.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="Price"><Data ss:Type="Number">${potentialRevenue.toFixed(2)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXML(p.description || "")}</Data></Cell>
      <Cell ss:StyleID="CenterText"><Data ss:Type="String">${escapeXML(p.createdAt ? new Date(p.createdAt).toLocaleDateString("fr-FR") : "")}</Data></Cell>
    </Row>`;
  }).join("");

  const spreadsheetXML = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Catalogue Produits &amp; Inventaire</Title>
  <Author>COD Manager</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F172A"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F172A"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#15803D" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CenterText">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="RowEven">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Price">
   <NumberFormat ss:Format="#,##0.00\ &quot;DH&quot;"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Percent">
   <NumberFormat ss:Format="0.0%"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Integer">
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="StatusActive">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#166534" ss:Bold="1"/>
   <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="StatusInactive">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#64748B"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TotalStyle">
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#15803D"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#15803D"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TotalPrice">
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#15803D"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#15803D"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#15803D" ss:Bold="1"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0.00\ &quot;DH&quot;"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TotalInteger">
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#15803D"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#15803D"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Inventaire &amp; Rentabilité">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="110"/> <!-- SKU -->
   <Column ss:Width="280"/> <!-- Nom -->
   <Column ss:Width="110"/> <!-- Catégorie -->
   <Column ss:Width="70"/>  <!-- Statut -->
   <Column ss:Width="90"/>  <!-- Prix Achat -->
   <Column ss:Width="90"/>  <!-- Prix Vente -->
   <Column ss:Width="90"/>  <!-- Marge -->
   <Column ss:Width="75"/>  <!-- Marge % -->
   <Column ss:Width="75"/>  <!-- Stock -->
   <Column ss:Width="80"/>  <!-- Seuil -->
   <Column ss:Width="110"/> <!-- État Stock -->
   <Column ss:Width="120"/> <!-- Capital Stock -->
   <Column ss:Width="120"/> <!-- CA Potentiel -->
   <Column ss:Width="180"/> <!-- Description -->
   <Column ss:Width="90"/>  <!-- Date Création -->

   <!-- En-tête des colonnes -->
   <Row ss:Height="28">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Code SKU</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Nom du Produit</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Catégorie</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Statut</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Prix Achat (DH)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Prix Vente (DH)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Marge Brute (DH)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Marge (%)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Stock Actuel</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Seuil Alerte</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">État Stock</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Valeur Stock (DH)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">CA Potentiel (DH)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Description</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date Ajout</Data></Cell>
   </Row>

   <!-- Données des produits -->
   ${xmlRows}

   <!-- Ligne de totalisation -->
   <Row ss:Height="26">
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String">TOTAL (${products.length} réf.)</Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalInteger"><Data ss:Type="Number">${totalStock}</Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalPrice"><Data ss:Type="Number">${totalCostValuation.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="TotalPrice"><Data ss:Type="Number">${totalRevenueValuation.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
    <Cell ss:StyleID="TotalStyle"><Data ss:Type="String"></Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  triggerDownload(
    spreadsheetXML,
    filename,
    "application/vnd.ms-excel;charset=utf-8"
  );
}

/**
 * Exporte la liste des produits au format CSV avec séparateur point-virgule
 * et encodage UTF-8 BOM pour une ouverture sans problème d'accents sous Excel.
 */
export function exportProductsToCSV(
  products: Product[],
  customFilename?: string
) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = customFilename || `catalogue_produits_${dateStr}.csv`;

  const headers = [
    "Code SKU",
    "Nom du Produit",
    "Catégorie",
    "Statut",
    "Prix Achat (DH)",
    "Prix Vente (DH)",
    "Marge Brute (DH)",
    "Marge (%)",
    "Stock Actuel",
    "Seuil Alerte Stock",
    "État Stock",
    "Valeur Stock Achat (DH)",
    "CA Potentiel Vente (DH)",
    "Description",
    "Date Création",
  ];

  const rows = products.map((p) => {
    const cost = Number(p.costPrice) || 0;
    const sale = Number(p.salePrice) || 0;
    const stock = Number(p.stock) || 0;
    const threshold = p.lowStockThreshold ?? 5;
    const margin = sale - cost;
    const marginPct = sale > 0 ? ((margin / sale) * 100).toFixed(1) : "0";
    const isActive = p.isActive !== false;
    const stockValuation = (cost * stock).toFixed(2);
    const potentialRevenue = (sale * stock).toFixed(2);

    let stockStatus = "En Stock";
    if (stock <= 0) stockStatus = "Rupture";
    else if (stock <= threshold) stockStatus = `Stock Faible (≤ ${threshold})`;

    return [
      p.sku,
      p.name,
      p.category?.name || "Général",
      isActive ? "Actif" : "Inactif",
      cost.toFixed(2),
      sale.toFixed(2),
      margin.toFixed(2),
      `${marginPct}%`,
      stock,
      threshold,
      stockStatus,
      stockValuation,
      potentialRevenue,
      p.description || "",
      p.createdAt ? new Date(p.createdAt).toLocaleDateString("fr-FR") : "",
    ];
  });

  const BOM = "\uFEFF";
  const csvContent =
    BOM +
    [
      headers.map(escapeCSV).join(";"),
      ...rows.map((row) => row.map(escapeCSV).join(";")),
    ].join("\r\n");

  triggerDownload(csvContent, filename, "text/csv;charset=utf-8;");
}
