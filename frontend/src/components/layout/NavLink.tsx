"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "relative text-sm font-medium transition-colors pb-1",
        isActive ? "text-brand" : "text-gray-600 hover:text-gray-900",
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-brand rounded-full" />
      )}
    </Link>
  );
}
