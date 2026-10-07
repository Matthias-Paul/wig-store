import { describe, expect, it, vi, beforeEach } from "vitest";
import { markNotificationRead } from "../api/notificationsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useMarkNotificationRead } from "./useMarkNotificationRead";

vi.mock("../api/notificationsApi", () => ({
  markNotificationRead: vi.fn(),
}));

describe("useMarkNotificationRead", () => {
  beforeEach(() => {
    vi.mocked(markNotificationRead).mockReset();
  });

  it("marks notification read and invalidates list", async () => {
    vi.mocked(markNotificationRead).mockResolvedValue(undefined as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkNotificationRead(), {
      wrapper: Wrapper,
    });

    result.current.mutate("n1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(markNotificationRead).toHaveBeenCalledWith(
      "n1",
      expect.objectContaining({ client: expect.anything() }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["notifications"] });
  });
});
