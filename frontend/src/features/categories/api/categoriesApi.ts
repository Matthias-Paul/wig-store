import { apiFetch } from "@/src/lib/apiClient";
import type { Category } from "@/src/types/product";

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch("/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}
