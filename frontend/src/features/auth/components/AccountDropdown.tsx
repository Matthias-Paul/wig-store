"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Package, Bell, LogOut } from "lucide-react";
import { useSession } from "../hooks/useSession";
import { useLogout } from "../hooks/useLogout";
import { Avatar } from "@/src/components/ui/Avatar";

export function AccountDropdown() {
  const { user } = useSession();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        className="cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Account menu"
      >
        <Avatar src={user.profileImage} name={user.name} size="sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-40">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Package size={16} /> My Orders
          </Link>
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Bell size={16} /> Notifications
          </Link>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout.mutate();
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-50"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
