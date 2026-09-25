import { apiFetch } from './api';

export interface SearchResult {
  packages: Array<{ id: string; slug: string; title: string; state: string; location: string; image: string; discountPrice: number }>;
  blog: Array<{ slug: string; title: string; excerpt: string; category: string; image: string; date: string }>;
}
export async function globalSearch(q: string): Promise<SearchResult> {
  const params = new URLSearchParams({ q });
  return apiFetch<SearchResult>(`/api/search?${params.toString()}`);
}
