"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { usePaymentStatusPolling } from "@/src/features/orders/hooks/usePaymentStatusPolling";
import { Button } from "@/src/components/ui/Button";
import { useEffect, useState } from "react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  // Paystack's callback includes the reference, but we need the orderId for our own status endpoint.
  // We stored orderId in sessionStorage right before redirecting to Paystack (set in the checkout flow).
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("pendingOrderId");
    setOrderId(storedOrderId);
  }, []);

  const { data, isLoading } = usePaymentStatusPolling(orderId);

  const status = data?.status;

  if (!orderId || isLoading || !status || status === "pending_payment") {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <Loader2 className="animate-spin mx-auto text-brand" size={40} />
        <h1 className="font-heading text-xl mt-4">
          Confirming your payment...
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          This usually only takes a few seconds.
        </p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <CheckCircle2 className="mx-auto text-success" size={48} />
        <h1 className="font-heading text-xl mt-4">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mt-2">
          Your order has been confirmed. We have sent a confirmation email with
          the details.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="outline" onClick={() => router.push("/orders")}>
            View My Orders
          </Button>
          <Button variant="primary" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // payment_failed, cancelled, or anything unexpected
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <XCircle className="mx-auto text-error" size={48} />
      <h1 className="font-heading text-xl mt-4">Payment Not Successful</h1>
      <p className="text-gray-500 text-sm mt-2">
        Your payment did not go through. Your order is still saved — you can try
        again from your orders page.
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <Button variant="primary" onClick={() => router.push("/orders")}>
          View My Orders
        </Button>
      </div>
    </div>
  );
}
