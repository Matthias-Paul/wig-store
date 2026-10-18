import { apiFetch, parseApiJson } from "@/src/lib/apiClient";
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
    if (value !== undefined && value !== "") query.set(key, String(value));
  });

  const qs = query.toString();
  const res = await apiFetch(qs ? `/products?${qs}` : "/products");
  if (!res.ok) throw new Error("Failed to load products");
  return parseApiJson<PaginatedProducts>(res);
}

/** Encode only characters that are unsafe in a path segment; keep hyphens intact. */
function toPathSegment(value: string): string {
  return encodeURIComponent(value.trim());
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const trimmed = slug.trim();
  if (!trimmed) throw new Error("Product not found");

  const res = await apiFetch(`/products/${toPathSegment(trimmed)}`);
  if (!res.ok) throw new Error("Product not found");
  return parseApiJson<Product>(res);
}

export async function getProductById(id: string): Promise<Product> {
  const res = await apiFetch(`/products/get/${toPathSegment(id)}`);
  if (!res.ok) throw new Error("Product not found");
  return parseApiJson<Product>(res);
}
