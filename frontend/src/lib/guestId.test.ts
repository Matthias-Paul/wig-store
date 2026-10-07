import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearGuestId, getGuestId } from "./guestId";

describe("guestId", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("creates and stores a guest id when missing", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "11111111-1111-1111-1111-111111111111",
    );

    const id = getGuestId();

    expect(id).toBe("11111111-1111-1111-1111-111111111111");
    expect(localStorage.getItem("guestId")).toBe(id);
  });

  it("reuses an existing guest id", () => {
    localStorage.setItem("guestId", "existing-guest");
    expect(getGuestId()).toBe("existing-guest");
  });

  it("clears the stored guest id", () => {
    localStorage.setItem("guestId", "existing-guest");
    clearGuestId();
    expect(localStorage.getItem("guestId")).toBeNull();
  });
});
