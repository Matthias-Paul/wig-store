import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductBySlug } from "../api/productsApi";

function normalizeSlugParam(slug: string | string[] | undefined): string {
  if (!slug) return "";
  const value = Array.isArray(slug) ? slug[0] : slug;
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

export function useProductDetail(slug: string | string[] | undefined) {
  const normalized = normalizeSlugParam(slug);
  return useQuery({
    queryKey: ["product", normalized],
    queryFn: () => getProductBySlug(normalized),
    enabled: !!normalized,
  });
}


export function useProductDetailById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
