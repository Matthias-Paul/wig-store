import { apiFetch } from "@/src/lib/apiClient";
import type {
  AdminStats,
  RevenueChartPoint,
  OrderStatusCount,
  ActivityItem,
} from "@/src/types/admin";

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiFetch("/admin/stats");
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export async function getRecentActivity(): Promise<{
  activities: ActivityItem[];
}> {
  const res = await apiFetch("/admin/recent-activity");
  if (!res.ok) throw new Error("Failed to load recent activity");
  return res.json();
}

export async function getRevenueChart(
  groupBy: "day" | "month",
  days: number,
): Promise<{ chart: RevenueChartPoint[] }> {
  const res = await apiFetch(
    `/admin/charts/revenue?groupBy=${groupBy}&days=${days}`,
  );
  if (!res.ok) throw new Error("Failed to load revenue chart");
  return res.json();
}

export async function getOrdersByStatus(): Promise<{
  breakdown: OrderStatusCount[];
}> {
  const res = await apiFetch("/admin/charts/orders-by-status");
  if (!res.ok) throw new Error("Failed to load order breakdown");
  return res.json();
}
