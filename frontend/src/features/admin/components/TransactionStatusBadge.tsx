import { Badge } from "@/src/components/ui/Badge";

const VARIANTS: Record<string, "success" | "error" | "warning"> = {
  success: "success",
  failed: "error",
  pending: "warning",
};

const LABELS: Record<string, string> = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

export function TransactionStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={VARIANTS[status] ?? "neutral"}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
