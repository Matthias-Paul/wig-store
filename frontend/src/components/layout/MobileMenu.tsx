"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Package, User, Bell, LogOut, LayoutDashboard } from "lucide-react";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { useLogout } from "@/src/features/auth/hooks/useLogout";
import { Avatar } from "@/src/components/ui/Avatar";
import { GoogleIcon } from "@/src/components/ui/icons/GoogleIcon";
import { useGoogleSignIn } from "@/src/features/auth/hooks/useGoogleSignIn";
import { useRequireAdmin } from "@/src/features/auth/hooks/useRequireAdmin";

export function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useSession();
  const logout = useLogout();
  const signIn = useGoogleSignIn();
  const { isAuthorized } = useRequireAdmin();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-heading text-lg text-brand">Menu</span>
          <button
            onClick={onClose}
            className="text-brand cursor-pointer"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <Avatar src={user.profileImage} name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Shop
          </Link>

          {isAuthenticated && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <Link
                href="/orders"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Package size={18} /> My Orders
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <User size={18} /> Profile
              </Link>
              <Link
                href="/notifications"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Bell size={18} /> Notifications
              </Link>

              {isAuthorized && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          {isAuthenticated ? (
            <button
              onClick={() => {
                onClose();
                logout.mutate();
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-error hover:bg-gray-50 text-sm font-medium"
            >
              <LogOut size={18} /> Log out
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                signIn.mutate();
              }}
              className="flex text-brand items-center cursor-pointer justify-center gap-2 w-full px-3 py-2.5 rounded-md border text-sm font-medium"
            >
              <GoogleIcon size={16} /> Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
