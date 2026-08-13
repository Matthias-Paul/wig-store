import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../api/ordersApi";

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
}
