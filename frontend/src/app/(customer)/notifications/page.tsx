"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useRequireAuth } from "@/src/features/auth/hooks/useRequireAuth";
import { useMyNotifications } from "@/src/features/notifications/hooks/useMyNotifications";
import { useMarkNotificationRead } from "@/src/features/notifications/hooks/useMarkNotificationRead";
import { NotificationItem } from "@/src/features/notifications/components/NotificationItem";
import { Pagination } from "@/src/components/ui/Pagination";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function NotificationsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyNotifications(page);
  const markRead = useMarkNotificationRead();

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl">Notifications</h1>
        {data && data.unreadCount > 0 && (
          <span className="text-xs bg-brand text-white rounded-full px-2 py-1">
            {data.unreadCount} unread
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !data || data.notifications.length === 0 ? (
        <EmptyState icon={<Bell size={48} />} title="No notifications yet" />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {data.notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={(id) => markRead.mutate(id)}
              />
            ))}
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
