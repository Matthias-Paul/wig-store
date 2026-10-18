import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productsApi";
import type { ProductQueryParams } from "@/src/types/product";

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });
}
