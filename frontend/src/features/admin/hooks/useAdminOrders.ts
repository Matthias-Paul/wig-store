import { useQuery } from "@tanstack/react-query";
import { getAdminOrders, type AdminOrdersQuery } from "../api/adminOrdersApi";

export function useAdminOrders(params: AdminOrdersQuery) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAdminOrders(params),
    placeholderData: (prev) => prev,
  });
}
