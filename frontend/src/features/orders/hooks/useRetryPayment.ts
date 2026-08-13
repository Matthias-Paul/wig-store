import { useMutation } from "@tanstack/react-query";
import { initializePayment } from "../api/paymentsApi";

export function useRetryPayment() {
  return useMutation({
    mutationFn: (orderId: string) => initializePayment(orderId),
    onSuccess: ({ authorizationUrl }, orderId) => {
      sessionStorage.setItem("pendingOrderId", orderId);
      window.location.href = authorizationUrl;
    },
  });
}
