
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productsApi";
import type { ProductQueryParams } from "@/src/types/product";

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    // // Always fetch when this component mounts
    // refetchOnMount: "always",
    // staleTime: 0,
    placeholderData: (previousData) => previousData, // keep old page visible while new page loads
  });
}
