"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ADMIN_NAV_ITEMS } from "../adminNavConfig";

const LOGO_URL =
  "https://res.cloudinary.com/drkxtuaeg/image/upload/v1787745248/jflicf1ob69wl42freyd.jpg";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-gray-900 text-gray-300 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
        <Image
          src={LOGO_URL}
          alt="Rockshairmpire"
          width={30}
          height={30}
          className="rounded-full"
        />
        <div>
          <p className="font-heading text-sm text-white leading-none">
            Rockshairmpire
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-brand text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}
