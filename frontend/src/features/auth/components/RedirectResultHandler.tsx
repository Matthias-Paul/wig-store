"use client";

import { useGoogleRedirectResult } from "@/src/features/auth/hooks/useGoogleRedirectResult";

export function RedirectResultHandler() {
  useGoogleRedirectResult();
  return null;
}
