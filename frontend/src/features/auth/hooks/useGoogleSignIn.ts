import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth, googleProvider } from "@/src/lib/firebase";
import {
  completeGoogleSessionFromUser,
  GOOGLE_AUTH_PENDING_KEY,
  POST_LOGIN_REDIRECT_KEY,
} from "@/src/lib/googleAuth";

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function startGoogleSignIn(redirectTo?: string) {
    const next =
      redirectTo || window.location.pathname + window.location.search;

    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, next);
    sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
    setIsPending(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const data = await completeGoogleSessionFromUser(credential.user);

      queryClient.setQueryData(["session"], data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      router.replace(next);
    } catch (error) {
      console.error("Google sign-in failed", error);
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return { startGoogleSignIn, isPending };
}
