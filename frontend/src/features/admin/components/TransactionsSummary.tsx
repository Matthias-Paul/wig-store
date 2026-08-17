import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { Transaction } from "@/src/types/transaction";

export function TransactionsSummary({
  transactions,
  total,
}: {
  transactions: Transaction[];
  total: number;
}) {
  const successCount = transactions.filter(
    (t) => t.status === "success",
  ).length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const pendingCount = transactions.filter(
    (t) => t.status === "pending",
  ).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white rounded-lg border border-gray-200 p-3.5 flex items-center gap-2.5">
        <span className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={15} />
        </span>
        <div>
          <p className="text-xs text-gray-400">Successful</p>
          <p className="text-sm font-semibold text-gray-900">{successCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-3.5 flex items-center gap-2.5">
        <span className="h-8 w-8 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0">
          <XCircle size={15} />
        </span>
        <div>
          <p className="text-xs text-gray-400">Failed</p>
          <p className="text-sm font-semibold text-gray-900">{failedCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-3.5 flex items-center gap-2.5">
        <span className="h-8 w-8 rounded-full bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
          <Clock size={15} />
        </span>
        <div>
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-sm font-semibold text-gray-900">{pendingCount}</p>
        </div>
      </div>
    </div>
  );
}
