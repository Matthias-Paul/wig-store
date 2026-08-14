"use client";

import Link from "next/link";
import { Package, Bell, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useRequireAuth } from "@/src/features/auth/hooks/useRequireAuth";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import { Skeleton } from "@/src/components/ui/Skeleton";

export default function ProfilePage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const { user } = useSession();

  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="flex justify-center -mt-12">
          <Skeleton className="h-24 w-24 rounded-full ring-4 ring-white" />
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="max-w-2xl mx-auto p-4 pb-16">
      {/* Cover + overlapping avatar */}
      <div className="relative">
        <div className="h-32 md:h-40 rounded-2xl bg-gradient-to-br from-brand via-brand to-gold overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="flex justify-center">
          <div className="-mt-12 ring-4 ring-white rounded-full">
            <Avatar src={user.profileImage} name={user.name} size="lg" />
          </div>
        </div>
      </div>

      {/* Name, email, role */}
      <div className="text-center mt-3">
        <h1 className="font-heading text-2xl text-gray-500">{user.name}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
        <div className="mt-2.5">
          <Badge variant={isAdmin ? "gold" : "brand"}>
            {isAdmin ? "Administrator" : "Customer"}
          </Badge>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <Link
          href="/orders"
          className="group flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-brand/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-tint text-brand">
              <Package size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">My Orders</p>
              <p className="text-xs text-gray-500">Track & view</p>
            </div>
          </div>
          <ArrowRight
            size={15}
            className="text-gray-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all"
          />
        </Link>

        <Link
          href="/notifications"
          className="group flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-brand/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-tint text-brand">
              <Bell size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">Recent updates</p>
            </div>
          </div>
          <ArrowRight
            size={15}
            className="text-gray-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      </div>

      {/* Account details */}
      <div className="bg-white rounded-xl border border-gray-200 mt-6 divide-y divide-gray-100">
        <div className="flex items-center gap-3 p-4">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-50 text-gray-400 flex-shrink-0">
            <Mail size={16} />
          </span>
          <div>
            <p className="text-xs text-gray-400">Email Address</p>
            <p className="text-sm text-gray-900 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-50 text-gray-400 flex-shrink-0">
            <ShieldCheck size={16} />
          </span>
          <div>
            <p className="text-xs text-gray-400">Account Type</p>
            <p className="text-sm text-gray-900 mt-0.5">
              {isAdmin ? "Administrator" : "Customer"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Profile editing is coming soon.
      </p>
    </div>
  );
}
