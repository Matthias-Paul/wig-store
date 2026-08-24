"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth } from "@/src/lib/firebase";
import {
  completeGoogleSessionFromUser,
  getGoogleRedirectResult,
  GOOGLE_AUTH_PENDING_KEY,
  POST_LOGIN_REDIRECT_KEY,
} from "@/src/lib/googleAuth";
import type { User as FirebaseUser } from "firebase/auth";

export function GoogleRedirectHandler() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let finished = false;

    async function finishLogin(user: FirebaseUser) {
      if (finished) return;
      finished = true;

      const data = await completeGoogleSessionFromUser(user);

      queryClient.setQueryData(["session"], data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      const next =
        sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) ||
        window.location.pathname + window.location.search;
      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);

      router.replace(next);
    }

    getGoogleRedirectResult()
      .then(async (result) => {
        if (result?.user) {
          await finishLogin(result.user);
        }
      })
      .catch((error) => {
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        console.error("Google redirect sign-in failed", error);
        toast.error("Sign-in failed. Please try again.");
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const pending = sessionStorage.getItem(GOOGLE_AUTH_PENDING_KEY);
      if (!pending || !user || finished) return;

      try {
        await finishLogin(user);
      } catch (error) {
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        console.error("Google redirect sign-in failed", error);
        toast.error("Sign-in failed. Please try again.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, router]);

  return null;
}
