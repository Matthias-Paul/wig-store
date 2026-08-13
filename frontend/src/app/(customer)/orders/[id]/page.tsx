"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRequireAuth } from "@/src/features/auth/hooks/useRequireAuth";
import { useOrderDetail } from "@/src/features/orders/hooks/useOrderDetail";
import { useRetryPayment } from "@/src/features/orders/hooks/useRetryPayment";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { parseProductImages } from "@/src/lib/parseProductImages";

const RETRYABLE_STATUSES = ["pending_payment", "payment_failed"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const { data: order, isLoading } = useOrderDetail(id);
  const retryPayment = useRetryPayment();

  if (authLoading || !isAuthenticated || isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order doesn't exist or you don't have access to it."
      />
    );
  }

  const canRetryPayment = RETRYABLE_STATUSES.includes(order.status);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => router.push("/orders")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {canRetryPayment && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Payment not completed
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Complete your payment to confirm this order before items go back
              in stock.
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() => retryPayment.mutate(order.id)}
            disabled={retryPayment.isPending}
          >
            {retryPayment.isPending ? "Redirecting..." : "Retry Payment"}
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {order.items.map((item) => {
          const images = parseProductImages(item.variant.product.images);
          return (
            <div key={item.id} className="flex gap-3 p-4">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={images[0]}
                  alt={item.variant.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {item.variant.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.variant.length}" · {item.variant.color}
                  {item.variant.closureSize && ` · ${item.variant.closureSize}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm">
                ₦{(item.priceAtPurchase * item.quantity).toLocaleString()}
              </p>
            </div>
          );
        })}

        <div className="p-4 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span className="text-brand">
            ₦{order.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <h2 className="font-heading text-base mb-3">Delivery Details</h2>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Recipient</dt>
            <dd className="text-gray-900">{order.recipientName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Phone</dt>
            <dd className="text-gray-900">{order.recipientPhone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Address</dt>
            <dd className="text-gray-900 text-right max-w-[60%]">
              {order.shippingAddress}, {order.shippingCity},{" "}
              {order.shippingState}
              {order.landmark && ` (${order.landmark})`}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
