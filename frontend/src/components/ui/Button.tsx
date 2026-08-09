import { clsx } from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-brand text-white hover:bg-brand-dark": variant === "primary",
          "bg-gold text-white hover:opacity-90": variant === "gold",
          "border border-brand text-brand hover:bg-brand-tint":
            variant === "outline",
          "text-brand hover:bg-brand-tint": variant === "ghost",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
