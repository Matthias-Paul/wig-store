import { Suspense } from "react";
import OrderConfirmationContent from "@/src/features/orders/components/OrderConfirmationContent";
import { Spinner } from "@/src/components/ui/Spinner";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      {" "}
      <OrderConfirmationContent />
    </Suspense>
  );
}
