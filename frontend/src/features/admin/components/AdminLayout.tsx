"use client";

import { useRequireAdmin } from "@/src/features/auth/hooks/useRequireAdmin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { Skeleton } from "@/src/components/ui/Skeleton";

export function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useRequireAdmin();

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 bg-gray-900" />
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar title={title} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
