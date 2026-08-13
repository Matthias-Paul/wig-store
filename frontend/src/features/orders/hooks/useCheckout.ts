import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../api/ordersApi";
import { initializePayment } from "../api/paymentsApi";
import type { CreateOrderPayload } from "@/src/types/order";
import { toast } from "sonner";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { order, message } = await checkout(payload);
      const { authorizationUrl } = await initializePayment(order.id);
      return { order, message, authorizationUrl };
    },
    onSuccess: ({ order, message }) => {
      sessionStorage.setItem("pendingOrderId", order.id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}