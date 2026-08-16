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

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <AdminLayout title="Dashboard">
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Revenue"
            value={`₦${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            accent="brand"
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toString()}
            icon={ShoppingBag}
            accent="success"
          />
          <StatCard
            label="Paid Orders"
            value={stats.totalPaidOrders.toString()}
            icon={ShoppingBag}
            accent="success"
          />
          {/* <StatCard
            label="Pending Payment"
            value={stats.pendingOrdersCount.toString()}
            icon={Clock}
            accent="warning"
          /> */}
          <StatCard
            label="Total Products"
            value={stats.totalProducts.toString()}
            icon={Package}
            accent="gold"
          />
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers.toString()}
            icon={Users}
            accent="brand"
          />
          <StatCard
            label="Low Stock Alerts"
            value={stats.lowStockCount.toString()}
            icon={AlertTriangle}
            accent={stats.lowStockCount > 0 ? "error" : "success"}
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
