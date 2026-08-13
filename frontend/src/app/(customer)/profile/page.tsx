"use client";

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
      <div className="max-w-md mx-auto p-4">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="font-heading text-2xl mb-6 text-center">My Profile</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Avatar src={user.profileImage} name={user.name} size="lg" />
        <h2 className="font-heading text-lg mt-4">{user.name}</h2>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>

        <div className="mt-3">
          <Badge variant={user.role === "admin" ? "gold" : "brand"}>
            {user.role === "admin" ? "Administrator" : "Customer"}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Profile editing is coming soon.
      </p>
    </div>
  );
}
