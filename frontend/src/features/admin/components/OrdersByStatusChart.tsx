"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useOrdersByStatus } from "../hooks/useOrdersByStatus";
import { Skeleton } from "@/src/components/ui/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "#D97706",
  paid: "#7E297E",
  processing: "#A855A8",
  shipped: "#C9A24B",
  delivered: "#16A34A",
  cancelled: "#9CA3AF",
  payment_failed: "#DC2626",
  refunded: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Failed",
  refunded: "Refunded",
};

export function OrdersByStatusChart() {
  const { data, isLoading } = useOrdersByStatus();

  const chartData =
    data?.breakdown
      .filter((item) => item.count > 0)
      .map((item) => ({
        name: STATUS_LABELS[item.status] ?? item.status,
        value: item.count,
        color: STATUS_COLORS[item.status] ?? "#9CA3AF",
      })) ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading text-base text-gray-900 mb-4">
        Orders by Status
      </h3>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : chartData.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">No orders yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #f1f1f1",
                fontSize: 12,
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
