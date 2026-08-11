import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../api/ordersApi";
import { initializePayment } from "../api/paymentsApi";
import type { CreateOrderPayload } from "@/src/types/order";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { order } = await checkout(payload);
      const { authorizationUrl } = await initializePayment(order.id);
      return { order, authorizationUrl };
    },
    onSuccess: ({ order }) => {
      sessionStorage.setItem('pendingOrderId', order.id);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}