import { describe, expect, it, vi, beforeEach } from "vitest";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { apiFetch } from "@/src/lib/apiClient";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useLogout } from "./useLogout";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/src/lib/firebase", () => ({
  auth: {},
}));

vi.mock("sonner", () => ({
  toast: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
}));

describe("useLogout", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
    vi.mocked(signOut).mockResolvedValue(undefined);
    vi.mocked(toast.info).mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });
  });

  it("calls logout API, clears cache, and redirects on success", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ ok: true } as Response);

    const { Wrapper, queryClient } = createQueryWrapper();
    queryClient.setQueryData(["session"], { id: "u1" });

    const { result } = renderHook(() => useLogout(), { wrapper: Wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiFetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
    expect(signOut).toHaveBeenCalled();
    expect(queryClient.getQueryData(["session"])).toBeUndefined();
    expect(toast.info).toHaveBeenCalledWith("Logged out successfully");
    expect(window.location.href).toBe("/");
  });

  it("throws when logout API fails", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ ok: false } as Response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useLogout(), { wrapper: Wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Logout failed");
  });
});
