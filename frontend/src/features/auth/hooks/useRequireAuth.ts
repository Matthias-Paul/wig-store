"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "./useSession";

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  return { isLoading, isAuthenticated };
}
