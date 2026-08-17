import { useQuery } from "@tanstack/react-query";
import { getAdminOrderById } from "../api/adminOrdersApi";

export function useAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrderById(id),
    enabled: !!id,
  });
}
