import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/src/lib/firebase";
import { getGuestId, clearGuestId } from "@/src/lib/guestId";
import { apiFetch } from "@/src/lib/apiClient";
import { toast } from "sonner";

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
    },
    onError: () => {
      toast.error("Sign-in failed. Please try again.");
    },
  });
}
