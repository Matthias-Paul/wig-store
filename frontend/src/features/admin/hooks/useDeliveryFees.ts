import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryFees } from "../api/adminDeliveryFeesApi";

export function useDeliveryFees() {
  return useQuery({
    queryKey: ["admin-delivery-fees"],
    queryFn: getAllDeliveryFees,
  });
}
