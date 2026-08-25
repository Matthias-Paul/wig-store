"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth } from "@/src/lib/firebase";
import { apiFetch } from "@/src/lib/apiClient";
import { getGuestId, clearGuestId } from "@/src/lib/guestId";
import { requestPushToken } from "@/src/lib/fcm";
import { registerDeviceToken } from "@/src/features/notifications/api/notificationsApi";
import {
  GOOGLE_NETWORK_TOAST,
  isGoogleNetworkError,
} from "@/src/features/auth/lib/googleAuthErrors";

export function useGoogleRedirectResult() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    getRedirectResult(auth)
      .then(async (result) => {
        const pendingRedirect = sessionStorage.getItem("postLoginRedirect");
        // Prefer redirect credential; fall back if Firebase restored the user
        // but dropped getRedirectResult (common with cross-domain authDomain).
        const firebaseUser = result?.user ?? (pendingRedirect ? auth.currentUser : null);

        if (!firebaseUser) return;

        const idToken = await firebaseUser.getIdToken();
        const guestId = getGuestId();

        const res = await apiFetch("/auth/google", {
          method: "POST",
          body: JSON.stringify({ idToken, guestId }),
        });

        if (!res.ok) throw new Error("Sign-in failed");
        const data = await res.json();

        // Stop an in-flight /auth/me (started with no cookies) from wiping the session
        await queryClient.cancelQueries({ queryKey: ["session"] });
        queryClient.setQueryData(["session"], data.user);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        clearGuestId();
        toast.success(`Welcome, ${data.user.name}!`);

        requestPushToken()
          .then((token) => (token ? registerDeviceToken(token) : undefined))
          .catch(() => {});

        const redirectTo = pendingRedirect ?? "/";
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(redirectTo);
      })
      .catch((error) => {
        console.error("Redirect sign-in failed", error);
        toast.error(
          isGoogleNetworkError(error)
            ? GOOGLE_NETWORK_TOAST
            : "Sign-in failed. Please try again.",
        );
      });
  }, [router, queryClient]);
}
