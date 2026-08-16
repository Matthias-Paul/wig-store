"use client";

import Link from "next/link";
import { ShoppingBag, UserPlus } from "lucide-react";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { Skeleton } from "@/src/components/ui/Skeleton";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RecentActivityFeed() {
  const { data, isLoading } = useRecentActivity();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading text-base text-gray-900 mb-4">
        Recent Activity
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : !data || data.activities.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No recent activity
        </p>
      ) : (
        <div className="space-y-1">
          {data.activities.slice(0, 8).map((activity, i) => {
            const Icon = activity.type === "order" ? ShoppingBag : UserPlus;
            const content = (
              <div className="flex items-start gap-3 py-2.5">
                <span className="shrink-0 h-8 w-8 rounded-full bg-brand-tint text-brand flex items-center justify-center mt-0.5">
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {timeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            );

            return activity.type === "order" && activity.metadata.orderId ? (
              <Link
                key={i}
                href={`/admin/orders/${activity.metadata.orderId}`}
                className="block hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
