import { useQuery } from "@tanstack/react-query";
import { getOrdersByStatus } from "../api/adminApi";

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ["admin-orders-by-status"],
    queryFn: getOrdersByStatus,
  });
}
