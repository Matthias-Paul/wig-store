
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../api/productsApi";

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}
