import { clsx } from "clsx";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "brand" | "gold" | "neutral";
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block px-2.5 py-1 text-center rounded-full text-xs font-semibold",
        {
          "bg-success/10 text-success": variant === "success",
          "bg-error/10 text-error": variant === "error",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-brand/10 text-brand": variant === "brand",
          "bg-gold/10 text-gold": variant === "gold",
          "bg-gray-100 text-gray-600": variant === "neutral",
        },
      )}
    >
      {children}
    </span>
  );
}
