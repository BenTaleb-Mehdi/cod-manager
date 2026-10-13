import blogPostsData from "@/data/blog-posts.json";
import { BlogPost } from "@/types/blog";

export function getBlogPosts(): BlogPost[] {
  return blogPostsData as BlogPost[];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return (blogPostsData as BlogPost[]).find((p) => p.slug === slug);
}

export function getFeaturedBlogPost(): BlogPost {
  const posts = getBlogPosts();
  return posts.find((p) => p.featured) || posts[0];
}

export function getBlogCategories(): string[] {
  const posts = getBlogPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 2): BlogPost[] {
  const posts = getBlogPosts();
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
