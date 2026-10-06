export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or structured HTML text
  category: "Conseils & Entretien" | "Guides d'Achat" | "Tendances" | "Savoir-Faire";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  featured?: boolean;
  tags: string[];
  relatedProductSlugs?: string[];
}
