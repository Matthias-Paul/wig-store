"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { clsx } from "clsx";
import { useRevenueChart } from "../hooks/useRevenueChart";
import { Skeleton } from "@/src/components/ui/Skeleton";

export function RevenueChart() {
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const days = groupBy === "day" ? 30 : 365;
  const { data, isLoading } = useRevenueChart(groupBy, days);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-base text-gray-900">Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {groupBy === "day" ? "Last 30 days" : "Last 12 months"}
          </p>
        </div>
        <div className="flex bg-gray-50 rounded-lg p-1">
          {(["day", "month"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setGroupBy(option)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                groupBy === option
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {option}ly
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data?.chart ?? []}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7E297E" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#7E297E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f1f1"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [
                `₦${Number(value ?? 0).toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #f1f1f1",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7E297E"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
