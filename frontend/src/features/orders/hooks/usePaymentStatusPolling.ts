import { useQuery } from "@tanstack/react-query";
import { checkPaymentStatus } from "../api/paymentsApi";

const TERMINAL_STATUSES = ["paid", "payment_failed", "cancelled", "refunded"];

export function usePaymentStatusPolling(orderId: string | null) {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => checkPaymentStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) {
        return false; // stop polling — we have a final answer
      }
      return 2000; // otherwise, check again in 2 seconds
    },
  });
}
