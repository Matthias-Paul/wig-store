"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, MapPin, Phone, User } from "lucide-react";
import { useRequireAuth } from "@/src/features/auth/hooks/useRequireAuth";
import { useOrderDetail } from "@/src/features/orders/hooks/useOrderDetail";
import { useRetryPayment } from "@/src/features/orders/hooks/useRetryPayment";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { parseProductImages } from "@/src/lib/parseProductImages";
import { formatVariantLength } from "@/src/lib/formatVariantLength";

const RETRYABLE_STATUSES = ["pending_payment", "payment_failed"];

const TIMELINE_STEPS = [
  { key: "paid", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function getTimelineIndex(status: string): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? -1 : idx;
}

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
  const isTerminalIssue = ["cancelled", "refunded"].includes(order.status);
  const activeStep = getTimelineIndex(order.status);

  const deliveryFee = order.deliveryFee ?? 0;
  const subtotal = order.totalAmount - deliveryFee;

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      <button
        onClick={() => router.push("/orders")}
        className="flex items-center gap-1 cursor-pointer text-sm mb-4"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Order
            </p>
            <h1 className="font-heading text-2xl text-gray-900 mt-0.5">
              {order.orderNumber}
            </h1>
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

        {/* Status timeline — only shown for orders past payment, not cancelled/refunded */}
        {!canRetryPayment && !isTerminalIssue && (
          <div className="mt-7">
            <div className="flex items-center">
              {TIMELINE_STEPS.map((step, i) => {
                const isDone = i <= activeStep;
                const isLast = i === TIMELINE_STEPS.length - 1;
                return (
                  <div
                    key={step.key}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          isDone
                            ? "bg-brand text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isDone ? <Check size={13} /> : i + 1}
                      </div>
                      <span
                        className={`text-[11px] mt-1.5 text-center whitespace-nowrap ${
                          isDone ? "text-gray-900 font-medium" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`h-0.5 flex-1 mx-1 -mt-4 transition-colors ${
                          i < activeStep ? "bg-brand" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Retry payment banner */}
      {canRetryPayment && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mt-4 flex items-center justify-between gap-4 flex-wrap">
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

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-200 mt-4 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-heading text-base text-gray-900">
            {order.items.length} Item{order.items.length > 1 ? "s" : ""}
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => {
            const images = parseProductImages(item.variant.product.images);
            return (
              <div key={item.id} className="flex gap-3 p-4">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-black/5">
                  <Image
                    src={images[0]}
                    alt={item.variant.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {item.variant.product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatVariantLength(item.variant.length)} ·{" "}
                    {item.variant.color}
                    {item.variant.closureSize &&
                      ` · ${item.variant.closureSize}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm text-gray-900">
                  ₦{(item.priceAtPurchase * item.quantity).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Price breakdown */}
        <div className="px-5 py-4 bg-gray-50/60 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-base pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-brand">
              ₦{order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mt-4">
        <h2 className="font-heading text-base text-gray-900 mb-4">
          Delivery Details
        </h2>
        <div className="space-y-3.5">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-tint text-brand flex-shrink-0">
              <User size={14} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Recipient</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {order.recipientName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-tint text-brand flex-shrink-0">
              <Phone size={14} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {order.recipientPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-tint text-brand flex-shrink-0">
              <MapPin size={14} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {order.shippingAddress}, {order.shippingCity},{" "}
                {order.shippingState}
                {order.landmark && ` (${order.landmark})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
