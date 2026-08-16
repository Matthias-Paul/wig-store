import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { Product } from "@/src/types/product";

export function useAdminProductDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const res = await apiFetch(`/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json() as Promise<Product>;
    },
    enabled: !!id,
  });
}
