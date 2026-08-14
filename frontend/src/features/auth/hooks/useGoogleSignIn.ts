import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { getGuestId, clearGuestId } from "@/src/lib/guestId";
import { apiFetch } from "@/src/lib/apiClient";
import { toast } from "sonner";
import { registerDeviceToken } from "../../notifications/api/notificationsApi";
import { requestPushToken } from "@/src/lib/fcm";
import { auth, googleProvider } from "@/src/lib/googleAuthFirebase";

export function useGoogleSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const guestId = getGuestId();

      const res = await apiFetch("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken, guestId }),
      });

      if (!res.ok) throw new Error("Sign-in failed");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // cart just got merged server-side
      clearGuestId();
      toast.success(`Welcome, ${data.user.name}!`);

      // Register for push notifications — non-blocking, failures are silent
      requestPushToken()
        .then((token) => {
          if (token) return registerDeviceToken(token);
        })
        .catch((err) => console.error("Push registration failed", err));
    },
    onError: () => {
      toast.error("Sign-in failed. Please try again.");
    },
  });
}
