import { apiFetch } from "./api";
import type { Category } from "@/lib/data";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}

export async function getCategoryById(id: string): Promise<Category> {
  return apiFetch<Category>(`/api/categories/${id}`);
}
