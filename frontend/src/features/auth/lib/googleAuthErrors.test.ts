import { describe, expect, it } from "vitest";
import { FirebaseError } from "firebase/app";
import {
  GOOGLE_NETWORK_TOAST,
  isGoogleNetworkError,
} from "./googleAuthErrors";

describe("isGoogleNetworkError", () => {
  it("detects Firebase network-request-failed", () => {
    const error = new FirebaseError(
      "auth/network-request-failed",
      "Network request failed",
    );
    expect(isGoogleNetworkError(error)).toBe(true);
  });

  it("detects common network message fragments", () => {
    expect(isGoogleNetworkError(new Error("ERR_CONNECTION_CLOSED"))).toBe(true);
    expect(isGoogleNetworkError(new Error("Failed to fetch"))).toBe(true);
    expect(isGoogleNetworkError(new Error("NetworkError"))).toBe(true);
    expect(isGoogleNetworkError("network-request-failed")).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isGoogleNetworkError(new Error("popup closed"))).toBe(false);
    expect(isGoogleNetworkError({ code: "auth/popup-closed-by-user" })).toBe(
      false,
    );
  });

  it("exports a network toast message", () => {
    expect(GOOGLE_NETWORK_TOAST).toContain("Can't reach Google");
  });
});
