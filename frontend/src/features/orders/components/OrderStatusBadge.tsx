import { Badge } from "@/src/components/ui/Badge";

const STATUS_VARIANTS: Record<
  string,
  "success" | "error" | "warning" | "brand" | "neutral"
> = {
  pending_payment: "warning",
  paid: "brand",
  processing: "brand",
  shipped: "brand",
  delivered: "success",
  cancelled: "neutral",
  payment_failed: "error",
  refunded: "neutral",
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment Failed",
  refunded: "Refunded",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "neutral"}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
