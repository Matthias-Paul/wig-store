import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMyNotifications } from "../api/notificationsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useMyNotifications } from "./useMyNotifications";

vi.mock("../api/notificationsApi", () => ({
  getMyNotifications: vi.fn(),
}));

describe("useMyNotifications", () => {
  beforeEach(() => {
    vi.mocked(getMyNotifications).mockReset();
  });

  it("loads notifications for page", async () => {
    const pageData = { data: [], meta: { page: 2, total: 0 } };
    vi.mocked(getMyNotifications).mockResolvedValue(pageData as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMyNotifications(2), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMyNotifications).toHaveBeenCalledWith(2);
    expect(result.current.data).toEqual(pageData);
  });
});
