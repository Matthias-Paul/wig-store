import { useQuery } from "@tanstack/react-query";
import { getDeliveryFee } from "../api/deliveryFeeApi";

export function useDeliveryFee(state: string | undefined) {
  return useQuery({
    queryKey: ["delivery-fee", state],
    queryFn: () => getDeliveryFee(state!),
    enabled: !!state,
    retry: false, 
  });
}
