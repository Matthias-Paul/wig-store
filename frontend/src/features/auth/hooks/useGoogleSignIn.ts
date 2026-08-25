import { signInWithRedirect } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/src/lib/firebase";
import {
  GOOGLE_NETWORK_TOAST,
  isGoogleNetworkError,
} from "@/src/features/auth/lib/googleAuthErrors";

export function useGoogleSignIn() {
  function triggerSignIn(redirectTo: string = "/") {
    // Persist where the user was trying to go, since the whole page will navigate away
    sessionStorage.setItem("postLoginRedirect", redirectTo);
    signInWithRedirect(auth, googleProvider).catch((error) => {
      console.error("Google sign-in failed", error);
      toast.error(
        isGoogleNetworkError(error)
          ? GOOGLE_NETWORK_TOAST
          : "Sign-in failed. Please try again.",
      );
    });
  }

  return { triggerSignIn };
}
