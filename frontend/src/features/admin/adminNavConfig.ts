import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { label: "Delivery Fees", href: "/admin/delivery-fees", icon: Truck },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];
