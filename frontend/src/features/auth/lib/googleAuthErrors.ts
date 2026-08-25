import { FirebaseError } from "firebase/app";

export const GOOGLE_NETWORK_TOAST =
  "Can't reach Google — check network/VPN";

export function isGoogleNetworkError(error: unknown): boolean {
  if (
    error instanceof FirebaseError &&
    error.code === "auth/network-request-failed"
  ) {
    return true;
  }

  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : String(error);

  return (
    message.includes("ERR_CONNECTION_CLOSED") ||
    message.includes("network-request-failed") ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Network request failed")
  );
}
