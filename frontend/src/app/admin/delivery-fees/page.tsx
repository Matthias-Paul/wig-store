"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useDeliveryFees } from "@/src/features/admin/hooks/useDeliveryFees";
import { DeliveryFeeRow } from "@/src/features/admin/components/DeliveryFeeRow";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
} from "@/src/components/ui/Table";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function AdminDeliveryFeesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useDeliveryFees();

  const filtered =
    data?.filter((f) => f.state.toLowerCase().includes(search.toLowerCase())) ??
    [];
  const activeCount = data?.filter((f) => f.isActive).length ?? 0;

  return (
    <AdminLayout title="Delivery Fees">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          {data && `${activeCount} of ${data.length} states active`}
        </p>
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<Truck size={44} />}
          title="No delivery fees configured"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching states"
          description="Try a different search term."
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>State</TableHeaderCell>
              <TableHeaderCell>Fee</TableHeaderCell>
              <TableHeaderCell>Active</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((fee) => (
              <DeliveryFeeRow key={fee.id} deliveryFee={fee} />
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
}
