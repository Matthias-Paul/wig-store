"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth, googleProvider } from "@/src/lib/firebase";
import { apiFetch } from "@/src/lib/apiClient";
import { getGuestId, clearGuestId } from "@/src/lib/guestId";
import { requestPushToken } from "@/src/lib/fcm";
import { registerDeviceToken } from "@/src/features/notifications/api/notificationsApi";
import {
  GOOGLE_NETWORK_TOAST,
  isGoogleNetworkError,
} from "@/src/features/auth/lib/googleAuthErrors";

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function triggerSignIn(redirectTo: string = "/") {
    setIsPending(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const guestId = getGuestId();

      const res = await apiFetch("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken, guestId }),
      });

      if (!res.ok) {
        let detail = `Sign-in failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.message) detail = String(body.message);
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }

      const data = await res.json();

      await queryClient.cancelQueries({ queryKey: ["session"] });
      queryClient.setQueryData(["session"], data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      clearGuestId();
      toast.success(`Welcome, ${data.user.name}!`);

      requestPushToken()
        .then((token) => (token ? registerDeviceToken(token) : undefined))
        .catch(() => {});

      router.replace(redirectTo);
    } catch (error) {
      console.error("Google sign-in failed", error);

      // User closed the popup — not an error worth toasting
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "auth/popup-closed-by-user"
      ) {
        return;
      }

      toast.error(
        isGoogleNetworkError(error)
          ? GOOGLE_NETWORK_TOAST
          : error instanceof Error
            ? error.message
            : "Sign-in failed. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return { triggerSignIn, isPending };
}
