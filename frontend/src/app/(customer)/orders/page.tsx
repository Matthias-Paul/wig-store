"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";
import { useRequireAuth } from "@/src/features/auth/hooks/useRequireAuth";
import { useMyOrders } from "@/src/features/orders/hooks/useMyOrders";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/src/components/ui/Table";
import { Pagination } from "@/src/components/ui/Pagination";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { Select } from "@/src/components/ui/Select";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";
import { parseProductImages } from "@/src/lib/parseProductImages";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Payment Failed", value: "payment_failed" },
  { label: "Refunded", value: "refunded" },
];

export default function OrdersPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useMyOrders({
    page,
    search: search || undefined,
    status: status || undefined,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <div className="max-w-5xl mx-auto p-4 pb-16">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading text-2xl text-gray-900">My Orders</h1>
        {data && (
          <span className="text-sm text-gray-400">
            {data.pagination.total} order
            {data.pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Track and manage everything you've ordered.
      </p>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 sm:max-w-xs">
          <SearchInput
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
          />
        </div>
        <div className="sm:w-52">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetToFirstPage();
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !data || data.orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title={search || status ? "No matching orders" : "No orders yet"}
          description={
            search || status
              ? "Try adjusting your search or filter."
              : "Your past orders will show up here once you place one."
          }
          action={
            !search && !status ? (
              <Link href="/products">
                <Button variant="primary">Browse Products</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>{''}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.orders.map((order) => {
                const firstItem = order.items[0];
                const images = firstItem
                  ? parseProductImages(firstItem.variant.product.images)
                  : [];
                const extraCount = order.items.length - 1;

                return (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-medium text-gray-900">
                      {order.orderNumber}
                    </TableCell>

                    <TableCell>
                      {firstItem && (
                        <div className="flex items-center gap-2">
                          <div className="relative h-9 w-9 rounded-md overflow-hidden bg-gray-100 ring-1 ring-black/5 flex-shrink-0">
                            <Image
                              src={images[0]}
                              alt={firstItem.variant.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {firstItem.variant.product.name}
                            {extraCount > 0 && ` +${extraCount} more`}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                      ₦{order.totalAmount.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-1 text-brand text-sm font-medium group-hover:gap-1.5 transition-all whitespace-nowrap"
                      >
                        View <ArrowRight size={13} />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-5">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
