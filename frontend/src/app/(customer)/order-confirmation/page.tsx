import { Suspense } from "react";
import OrderConfirmationContent from "@/src/features/orders/components/OrderConfirmationContent";
import { Skeleton } from "@/src/components/ui/Skeleton";

function OrderConfirmationFallback() {
  return (
    <div className="max-w-md mx-auto p-8 space-y-4">
      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
      <Skeleton className="h-7 w-2/3 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
      <div className="flex gap-3 justify-center pt-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
