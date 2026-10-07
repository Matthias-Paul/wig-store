import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useRequireAdmin } from "./useRequireAdmin";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
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

function mockSession(role: string) {
  vi.mocked(apiFetch).mockResolvedValue({
    ok: true,
    json: async () => ({
      id: "u1",
      name: "Ada",
      email: "a@b.com",
      role,
      profileImage: null,
    }),
  } as Response);
}

describe("useRequireAdmin", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
    mockReplace.mockReset();
  });

  it("redirects non-admin users to home", async () => {
    mockSession("customer");

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useRequireAdmin(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(result.current.isAuthorized).toBe(false);
  });

  it("allows admin users", async () => {
    mockSession("admin");

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useRequireAdmin(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isAuthorized).toBe(true));

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects when not authenticated", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ ok: false } as Response);

    const { Wrapper } = createQueryWrapper();
    renderHook(() => useRequireAdmin(), { wrapper: Wrapper });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });
});
