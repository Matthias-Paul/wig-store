import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { requestPushToken } from "@/src/lib/fcm";
import { registerDeviceToken } from "../../notifications/api/notificationsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useSession } from "./useSession";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/src/lib/fcm", () => ({
  requestPushToken: vi.fn(),
}));

vi.mock("../../notifications/api/notificationsApi", () => ({
  registerDeviceToken: vi.fn(),
}));

const mockUser = {
  id: "u1",
  name: "Ada",
  email: "ada@test.com",
  role: "customer",
  profileImage: null,
};

describe("useSession", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
    vi.mocked(requestPushToken).mockResolvedValue(null);
    vi.mocked(registerDeviceToken).mockReset();
  });

  it("returns user when /auth/me succeeds", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    } as Response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSession(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(apiFetch).toHaveBeenCalledWith("/auth/me");
  });

  it("returns unauthenticated when /auth/me is not ok", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ ok: false } as Response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSession(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
