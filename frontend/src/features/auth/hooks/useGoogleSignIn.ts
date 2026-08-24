import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth, googleProvider } from "@/src/lib/firebase";
import {
  completeGoogleSessionFromUser,
  GOOGLE_AUTH_PENDING_KEY,
  POST_LOGIN_REDIRECT_KEY,
} from "@/src/lib/googleAuth";

function canUseRedirectSignIn() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function startGoogleSignIn(redirectTo?: string) {
    const next =
      redirectTo ||
      window.location.pathname + window.location.search;

    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, next);
    setIsPending(true);

    try {
      // Local Next is HTTP. Firebase's redirect handler is HTTPS-only, which
      // produces ERR_SSL_PROTOCOL_ERROR on https://localhost:3000.
      if (!canUseRedirectSignIn()) {
        const credential = await signInWithPopup(auth, googleProvider);
        const data = await completeGoogleSessionFromUser(credential.user);

        queryClient.setQueryData(["session"], data.user);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        router.replace(next);
        return;
      }

      sessionStorage.setItem(GOOGLE_AUTH_PENDING_KEY, "1");
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
      console.error("Google sign-in failed", error);
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return { startGoogleSignIn, isPending };
}
