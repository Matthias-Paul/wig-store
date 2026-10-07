import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMyOrders } from "../api/ordersApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useMyOrders } from "./useMyOrders";

vi.mock("../api/ordersApi", () => ({
  getMyOrders: vi.fn(),
}));

describe("useMyOrders", () => {
  beforeEach(() => {
    vi.mocked(getMyOrders).mockReset();
  });

  it("loads orders for the current user", async () => {
    const orders = { data: [], meta: { total: 0, page: 1 } };
    vi.mocked(getMyOrders).mockResolvedValue(orders as never);

    const params = { page: 1, status: "pending" };
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMyOrders(params), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMyOrders).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(orders);
  });
});
