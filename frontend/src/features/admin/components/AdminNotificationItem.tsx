import Link from "next/link";
import { clsx } from "clsx";
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import type { Notification } from "@/src/types/notification";

interface AdminNotification extends Notification {
  user?: { name: string; email: string } | null;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  order_placed: Package,
  order_paid: CreditCard,
  payment_failed: XCircle,
  order_processing: Package,
  order_shipped: Truck,
  order_delivered: CheckCircle,
  product_created: Sparkles,
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AdminNotificationItem({
  notification,
}: {
  notification: AdminNotification;
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Package;
  const isSystemWide = !notification.user;

  const href = notification.relatedOrderId
    ? `/admin/orders/${notification.relatedOrderId}`
    : notification.relatedProductId
      ? `/admin/products/${notification.relatedProductId}/edit`
      : undefined;

  const content = (
    <div className="flex items-start gap-3 py-3">
      <span
        className={clsx(
          "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mt-0.5",
          isSystemWide ? "bg-gold-tint text-gold" : "bg-brand-tint text-brand",
        )}
      >
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          {isSystemWide ? (
            <span className="text-[10px] font-medium text-gold bg-gold-tint px-1.5 py-0.5 rounded">
              System
            </span>
          ) : (
            notification.user && (
              <span className="text-[10px] text-gray-400">
                — {notification.user.name}
              </span>
            )
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="block hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
    >
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  );
}
