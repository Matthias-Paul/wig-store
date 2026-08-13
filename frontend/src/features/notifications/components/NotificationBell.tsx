"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useMyNotifications } from "../hooks/useMyNotifications";

export function NotificationBell() {
  const { data } = useMyNotifications(1);
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Link
      href="/notifications"
      className="relative text-brand p-2"
      aria-label="Notifications"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
