import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  accent?: "brand" | "gold" | "success" | "warning" | "error";
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  brand: "bg-brand-tint text-brand",
  gold: "bg-gold-tint text-gold",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "brand",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-heading text-2xl text-gray-900 mt-1.5">{value}</p>
        </div>
        <span
          className={clsx(
            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
            ACCENT_STYLES[accent],
          )}
        >
          <Icon size={18} />
        </span>
      </div>

      {trend && (
        <p
          className={clsx(
            "text-xs mt-3 font-medium",
            trend.direction === "up" ? "text-success" : "text-error",
          )}
        >
          {trend.direction === "up" ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}
