
import { apiFetch } from "@/src/lib/apiClient";
import type {
  PaginatedProducts,
  Product,
  ProductQueryParams,
} from "@/src/types/product";

export async function getProducts(
  params: ProductQueryParams = {},
): Promise<PaginatedProducts> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  const res = await apiFetch(`/products?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await apiFetch(`/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}
