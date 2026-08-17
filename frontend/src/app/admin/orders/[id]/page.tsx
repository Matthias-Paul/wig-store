"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, User, Phone, MapPin, Mail } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminOrderDetail } from "@/src/features/admin/hooks/useAdminOrderDetail";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import { OrderStatusSelect } from "@/src/features/admin/components/OrderStatusSelect";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { parseProductImages } from "@/src/lib/parseProductImages";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: order, isLoading } = useAdminOrderDetail(id);

  return (
    <AdminLayout title="Order Details">
      <button
        onClick={() => router.push("/admin/orders")}
        className="flex items-center cursor-pointer gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft size={15} /> Back to Orders
      </button>

      {isLoading ? (
        <Skeleton className="h-96 w-full max-w-3xl" />
      ) : !order ? (
        <EmptyState title="Order not found" />
      ) : (
        <div className="max-w-3xl space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Order
              </p>
              <h2 className="font-heading text-xl text-gray-900 mt-0.5">
                {order.orderNumber}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h3 className="font-heading text-base text-gray-900">
                {order.items.length} Item{order.items.length > 1 ? "s" : ""}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const images = parseProductImages(item.variant.product.images);
                return (
                  <div key={item.id} className="flex gap-3 p-4">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-black/5">
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
                        {item.variant.length}" · {item.variant.color}
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
            <div className="px-5 py-4 bg-gray-50/60 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>
                  ₦
                  {(
                    order.totalAmount - (order.deliveryFee ?? 0)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>₦{(order.deliveryFee ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-base pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-brand">
                  ₦{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-heading text-base text-gray-900 mb-4">
              Customer And Delivery
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
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
                  <Mail size={14} />
                </span>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {order.recipientEmail}
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
      )}
    </AdminLayout>
  );
}
