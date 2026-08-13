import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/ordersApi";

export function useMyOrders(
  params: { page?: number; status?: string; search?: string } = {},
) {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => getMyOrders(params),
    placeholderData: (previousData) => previousData,
  });
}
