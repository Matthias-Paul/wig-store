import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAdminStats } from "../api/adminApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useAdminStats } from "./useAdminStats";

vi.mock("../api/adminApi", () => ({
  getAdminStats: vi.fn(),
}));

describe("useAdminStats", () => {
  beforeEach(() => {
    vi.mocked(getAdminStats).mockReset();
  });

  it("loads admin stats", async () => {
    const stats = { revenue: 100, orders: 5 };
    vi.mocked(getAdminStats).mockResolvedValue(stats as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAdminStats(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAdminStats).toHaveBeenCalled();
    expect(result.current.data).toEqual(stats);
  });
});
