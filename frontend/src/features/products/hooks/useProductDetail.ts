
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductBySlug } from "../api/productsApi";

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}


export function useProductDetailById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
