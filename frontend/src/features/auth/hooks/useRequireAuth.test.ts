import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useRequireAuth } from "./useRequireAuth";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/account",
}));

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/src/lib/fcm", () => ({
  requestPushToken: vi.fn().mockResolvedValue(null),
}));

vi.mock("../../notifications/api/notificationsApi", () => ({
  registerDeviceToken: vi.fn(),
}));

describe("useRequireAuth", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
    mockReplace.mockReset();
  });

  it("redirects to login when session is empty", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ ok: false } as Response);

    const { Wrapper } = createQueryWrapper();
    renderHook(() => useRequireAuth(), { wrapper: Wrapper });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/login?redirect=/account"),
    );
  });

  it("does not redirect when authenticated", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "u1",
        name: "Ada",
        email: "a@b.com",
        role: "customer",
        profileImage: null,
      }),
    } as Response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useRequireAuth(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
