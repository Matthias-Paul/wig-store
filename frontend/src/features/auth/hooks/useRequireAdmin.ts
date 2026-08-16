"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./useSession";

export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  return { isLoading, isAuthorized: isAuthenticated && user?.role === "admin" };
}
