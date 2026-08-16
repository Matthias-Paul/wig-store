export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalPaidOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
//   pendingOrdersCount: number;
}

export interface RevenueChartPoint {
  period: string;
  revenue: number;
  orderCount: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface ActivityItem {
  type: "order" | "signup";
  message: string;
  timestamp: string;
  metadata: Record<string, string>;
}
