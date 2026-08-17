import { apiFetch } from "@/src/lib/apiClient";
import type { PaginatedTransactions } from "@/src/types/transaction";

export interface TransactionsQuery {
  page?: number;
  status?: string;
  search?: string;
}

export async function getTransactions(
  params: TransactionsQuery,
): Promise<PaginatedTransactions> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const res = await apiFetch(`/admin/transactions?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to load transactions");
  return res.json();
}
