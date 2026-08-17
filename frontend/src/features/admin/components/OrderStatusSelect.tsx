"use client";

import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";

// Mirrors the backend's ADMIN_ALLOWED_STATUSES exactly — paid/pending_payment/
// payment_failed are system-only and never offered here.
const ADMIN_STATUS_OPTIONS = [
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

// Matches ALLOWED_TRANSITIONS on the backend, so the dropdown only ever offers
// options that would actually be accepted — avoids a confusing failed request.
const NEXT_ALLOWED: Record<string, string[]> = {
  paid: ["processing", "refunded"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  payment_failed: [],
  pending_payment: [],
  refunded: [],
};

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const updateStatus = useUpdateOrderStatus();
  const allowedNext = NEXT_ALLOWED[currentStatus] ?? [];
  const options = ADMIN_STATUS_OPTIONS.filter((o) =>
    allowedNext.includes(o.value),
  );

  if (options.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">No actions available</span>
    );
  }

  return (
    <select
      defaultValue=""
      disabled={updateStatus.isPending}
      onChange={(e) => {
        if (e.target.value) {
          updateStatus.mutate({ id: orderId, status: e.target.value });
        }
      }}
      className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-brand focus:border-brand bg-white cursor-pointer disabled:opacity-50"
    >
      <option value="" disabled>
        Update status...
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Mark as {opt.label}
        </option>
      ))}
    </select>
  );
}
