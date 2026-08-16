import { useQuery } from "@tanstack/react-query";
import { getRevenueChart } from "../api/adminApi";

export function useRevenueChart(groupBy: "day" | "month", days: number) {
  return useQuery({
    queryKey: ["admin-revenue-chart", groupBy, days],
    queryFn: () => getRevenueChart(groupBy, days),
  });
}
