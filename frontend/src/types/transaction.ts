export interface Transaction {
  id: string;
  reference: string;
  status: "pending" | "success" | "failed";
  amount: number;
  date: string;
  order: {
    id: string;
    orderNumber: string;
    recipientName: string;
    recipientEmail: string;
  };
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
