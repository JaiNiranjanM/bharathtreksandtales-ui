import { apiFetch } from './api';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author: string;
  published: number;
}

export async function getBlogPosts(filters?: { category?: string; query?: string }): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.query) params.set('query', filters.query);
  const qs = params.toString();
  return apiFetch<BlogPost[]>(`/api/blog${qs ? `?${qs}` : ''}`);
}
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/api/blog/${slug}`);
}
