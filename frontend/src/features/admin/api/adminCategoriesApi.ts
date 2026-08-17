import { apiFetch } from "@/src/lib/apiClient";
import type { Category } from "@/src/types/product";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export interface CategoryPayload {
  name: string;
  image: string;
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<Category> {
  const res = await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
): Promise<Category> {
  const res = await apiFetch(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await apiFetch(`/categories/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete category");
  }
}
