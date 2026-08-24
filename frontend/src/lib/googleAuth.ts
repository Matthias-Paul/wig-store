import { getRedirectResult, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "./firebase";
import { getGuestId, clearGuestId } from "./guestId";
import { apiFetch } from "./apiClient";

export const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";
export const GOOGLE_AUTH_PENDING_KEY = "google_auth_pending";

export type GoogleAuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string | null;
  };
};

// getRedirectResult can only be consumed once. Cache the promise so React
// Strict Mode (dev double-mount) does not swallow the credential.
let redirectResultPromise: ReturnType<typeof getRedirectResult> | null = null;

export function getGoogleRedirectResult() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!redirectResultPromise) {
    redirectResultPromise = getRedirectResult(auth);
  }
  return redirectResultPromise;
}

export async function exchangeGoogleIdToken(
  idToken: string,
): Promise<GoogleAuthSession> {
  const guestId = getGuestId();
  const res = await apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken, guestId }),
  });

  if (!res.ok) throw new Error("Sign-in failed");

  const data = (await res.json()) as GoogleAuthSession;
  clearGuestId();
  return data;
}

let sessionExchangePromise: Promise<GoogleAuthSession> | null = null;
let welcomeToastShown = false;

function showWelcomeOnce(name: string) {
  if (welcomeToastShown) return;
  welcomeToastShown = true;
  toast.success(`Welcome, ${name}!`);
}

/** Finishes shop login after Firebase Google sign-in. */
export async function completeGoogleSessionFromUser(
  user: User,
): Promise<GoogleAuthSession> {
  if (!sessionExchangePromise) {
    sessionExchangePromise = user
      .getIdToken()
      .then(exchangeGoogleIdToken)
      .then((data) => {
        showWelcomeOnce(data.user.name);
        return data;
      })
      .catch((error) => {
        sessionExchangePromise = null;
        throw error;
      });
  }

  return sessionExchangePromise;
}

export function resetGoogleLoginState() {
  sessionExchangePromise = null;
  welcomeToastShown = false;
}
