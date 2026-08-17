"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminOrders } from "@/src/features/admin/hooks/useAdminOrders";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import { OrderStatusSelect } from "@/src/features/admin/components/OrderStatusSelect";
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

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useAdminOrders({
    page,
    search: search || undefined,
    status: status || undefined,
  });

  function resetPage() {
    setPage(1);
  }

  return (
    <AdminLayout title="Orders">
      <p className="text-sm text-gray-500 mb-5">
        {data
          ? `${data.pagination.total} order${data.pagination.total !== 1 ? "s" : ""}`
          : ""}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by order number, name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="sm:w-56">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : !data || data.orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={44} />}
          title={search || status ? "No matching orders" : "No orders yet"}
          description={
            search || status
              ? "Try adjusting your search or filter."
              : "Orders will show up here once customers start buying."
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
                <TableHeaderCell> {""}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900 whitespace-nowrap">
                      {order.recipientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.recipientPhone}
                    </p>
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
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 text-brand text-sm font-medium whitespace-nowrap"
                    >
                      View <ArrowRight size={13} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
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
    </AdminLayout>
  );
}
