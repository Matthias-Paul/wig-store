"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useTransactions } from "@/src/features/admin/hooks/useTransactions";
import { TransactionStatusBadge } from "@/src/features/admin/components/TransactionStatusBadge";
import { TransactionsSummary } from "@/src/features/admin/components/TransactionsSummary";
import { CopyableReference } from "@/src/features/admin/components/CopyableReference";
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
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Pending", value: "pending" },
];

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useTransactions({
    page,
    search: search || undefined,
    status: status || undefined,
  });

  function resetPage() {
    setPage(1);
  }

  return (
    <AdminLayout title="Transactions">
      <p className="text-sm text-gray-500 mb-5">
        {data
          ? `${data.pagination.total} transaction${data.pagination.total !== 1 ? "s" : ""}`
          : ""}
      </p>

      {/* {data && data.transactions.length > 0 && (
        <TransactionsSummary
          transactions={data.transactions}
          total={data.pagination.total}
        />
      )} */}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by reference, order number, or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="sm:w-48">
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
      ) : !data || data.transactions.length === 0 ? (
        <EmptyState
          icon={<CreditCard size={44} />}
          title={
            search || status
              ? "No matching transactions"
              : "No transactions yet"
          }
          description={
            search || status
              ? "Try adjusting your search or filter."
              : "Payment attempts will appear here once customers start checking out."
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Reference</TableHeaderCell>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>{""}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <CopyableReference value={tx.reference} />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                    {tx.order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900 whitespace-nowrap">
                      {tx.order.recipientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {tx.order.recipientEmail}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500">
                    {new Date(tx.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                    ₦{tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${tx.order.id}`}
                      className="flex items-center gap-1 text-brand text-sm font-medium whitespace-nowrap"
                    >
                      View Order <ArrowRight size={13} />
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
