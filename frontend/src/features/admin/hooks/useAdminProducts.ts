import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/adminProductsApi";
import type { ProductQueryParams } from "@/src/types/product";

export function useAdminProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => getAdminProducts(params),
    placeholderData: (prev) => prev,
  });
}
