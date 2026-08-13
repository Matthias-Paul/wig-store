"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
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
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";

export default function OrdersPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useMyOrders({
    page,
    search: search || undefined,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="font-heading text-2xl mb-4">My Orders</h1>

      <div className="mb-4 max-w-xs">
        <SearchInput
          placeholder="Search by order number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 whenever the search changes
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !data || data.orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No orders yet"
          description="Your past orders will show up here once you place one."
          action={
            <Link href="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>{""} </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>₦{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-brand text-sm hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
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
