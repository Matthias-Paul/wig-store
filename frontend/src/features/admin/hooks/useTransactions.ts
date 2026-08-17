import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  type TransactionsQuery,
} from "../api/adminTransactionsApi";

export function useTransactions(params: TransactionsQuery) {
  return useQuery({
    queryKey: ["admin-transactions", params],
    queryFn: () => getTransactions(params),
    placeholderData: (prev) => prev,
  });
}
