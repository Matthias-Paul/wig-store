import { Suspense } from "react";
import OrderConfirmationContent from "@/src/features/orders/components/OrderConfirmationContent";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
