import { describe, expect, it, vi, beforeEach } from "vitest";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { apiFetch } from "@/src/lib/apiClient";
import { getGuestId, clearGuestId } from "@/src/lib/guestId";
import { requestPushToken } from "@/src/lib/fcm";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useGoogleSignIn } from "./useGoogleSignIn";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
}));

vi.mock("@/src/lib/firebase", () => ({
  auth: {},
  googleProvider: {},
}));

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/src/lib/guestId", () => ({
  getGuestId: vi.fn(),
  clearGuestId: vi.fn(),
}));

vi.mock("@/src/lib/fcm", () => ({
  requestPushToken: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/src/features/notifications/api/notificationsApi", () => ({
  registerDeviceToken: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUser = {
  id: "u1",
  name: "Ada",
  email: "ada@test.com",
  role: "customer",
  profileImage: null,
};

describe("useGoogleSignIn", () => {
  beforeEach(() => {
    vi.mocked(signInWithPopup).mockReset();
    vi.mocked(apiFetch).mockReset();
    vi.mocked(getGuestId).mockReturnValue("guest-1");
    vi.mocked(clearGuestId).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
    mockReplace.mockReset();
    vi.mocked(requestPushToken).mockResolvedValue(null);
  });

  it("signs in, updates session cache, and navigates", async () => {
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: { getIdToken: vi.fn().mockResolvedValue("id-token") },
    } as never);
    vi.mocked(apiFetch).mockResolvedValue({
      ok: true,
      json: async () => ({ user: mockUser }),
    } as Response);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: Wrapper,
    });

    await result.current.triggerSignIn("/shop");

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(apiFetch).toHaveBeenCalledWith("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken: "id-token", guestId: "guest-1" }),
    });
    expect(queryClient.getQueryData(["session"])).toEqual(mockUser);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart"] });
    expect(clearGuestId).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Welcome, Ada!");
    expect(mockReplace).toHaveBeenCalledWith("/shop");
  });

  it("shows error toast when backend rejects sign-in", async () => {
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: { getIdToken: vi.fn().mockResolvedValue("id-token") },
    } as never);
    vi.mocked(apiFetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid token" }),
    } as Response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: Wrapper,
    });

    await result.current.triggerSignIn();

    expect(toast.error).toHaveBeenCalledWith("Invalid token");
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("does not toast when user closes popup", async () => {
    vi.mocked(signInWithPopup).mockRejectedValue({
      code: "auth/popup-closed-by-user",
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: Wrapper,
    });

    await result.current.triggerSignIn();

    expect(toast.error).not.toHaveBeenCalled();
  });
});
