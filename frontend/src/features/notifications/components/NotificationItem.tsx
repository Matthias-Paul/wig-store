import Link from "next/link";
import { clsx } from "clsx";
import { Package, CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";
import type { Notification } from "@/src/types/notification";

const TYPE_ICONS: Record<string, React.ElementType> = {
  order_placed: Package,
  order_paid: CreditCard,
  payment_failed: XCircle,
  order_processing: Package,
  order_shipped: Truck,
  order_delivered: CheckCircle,
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Package;
  const href = notification.relatedOrderId
    ? `/orders/${notification.relatedOrderId}`
    : undefined;

  const content = (
    <div
      className={clsx(
        "flex gap-3 p-4 hover:bg-gray-50 transition-colors",
        !notification.isRead && "bg-brand-tint/40",
      )}
      onClick={() => !notification.isRead && onRead(notification.id)}
    >
      <div
        className={clsx(
          "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center",
          notification.isRead
            ? "bg-gray-100 text-gray-400"
            : "bg-brand-tint text-brand",
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "text-sm",
            !notification.isRead
              ? "font-semibold text-gray-900"
              : "text-gray-700",
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <div className="h-2 w-2 rounded-full bg-brand flex-shrink-0 mt-1.5" />
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
