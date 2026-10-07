import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAdminOrders } from "../api/adminOrdersApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useAdminOrders } from "./useAdminOrders";

vi.mock("../api/adminOrdersApi", () => ({
  getAdminOrders: vi.fn(),
}));

describe("useAdminOrders", () => {
  beforeEach(() => {
    vi.mocked(getAdminOrders).mockReset();
  });

  it("loads admin orders with filters", async () => {
    const list = { data: [], meta: { total: 0, page: 1 } };
    vi.mocked(getAdminOrders).mockResolvedValue(list as never);

    const params = { page: 1, status: "pending" };
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAdminOrders(params), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAdminOrders).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(list);
  });
});
