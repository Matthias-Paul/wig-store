"use client";

import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminStats } from "@/src/features/admin/hooks/useAdminStats";
import { StatCard } from "@/src/components/ui/StatCard";
import { RevenueChart } from "@/src/features/admin/components/RevenueChart";
import { OrdersByStatusChart } from "@/src/features/admin/components/OrdersByStatusChart";
import { RecentActivityFeed } from "@/src/features/admin/components/RecentActivityFeed";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useSession } from "@/src/features/auth/hooks/useSession";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();
  const { user } = useSession();

  return (
    <AdminLayout title="Dashboard">
      <div className="text-lg text-brand font-bold">Hello, {user?.name}</div>
      <p className="text-sm text-brand mb-4">
        Here’s a quick overview of your store’s performance and latest
        updates.{" "}
      </p>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 mb-4">
          Could not load dashboard stats
          {error instanceof Error ? `: ${error.message}` : "."} Check Network
          for <code className="text-xs">/api/v1/admin/stats</code>.
        </p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Revenue"
            value={`₦${Number(stats.totalRevenue ?? 0).toLocaleString()}`}
            icon={DollarSign}
            accent="brand"
          />
          <StatCard
            label="Total Orders"
            value={String(stats.totalOrders ?? 0)}
            icon={ShoppingBag}
            accent="success"
          />
          <StatCard
            label="Paid Orders"
            value={String(stats.totalPaidOrders ?? 0)}
            icon={ShoppingBag}
            accent="success"
          />
          <StatCard
            label="Total Products"
            value={String(stats.totalProducts ?? 0)}
            icon={Package}
            accent="gold"
          />
          <StatCard
            label="Total Customers"
            value={String(stats.totalCustomers ?? 0)}
            icon={Users}
            accent="brand"
          />
          <StatCard
            label="Low Stock Alerts"
            value={String(stats.lowStockCount ?? 0)}
            icon={AlertTriangle}
            accent={(stats.lowStockCount ?? 0) > 0 ? "error" : "success"}
          />
        </div>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <OrdersByStatusChart />
      </div>

      <div className="mt-5">
        <RecentActivityFeed />
      </div>
    </AdminLayout>
  );
}
