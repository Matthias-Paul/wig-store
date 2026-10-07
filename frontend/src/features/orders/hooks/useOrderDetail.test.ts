import { describe, expect, it, vi, beforeEach } from "vitest";
import { getOrderById } from "../api/ordersApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useOrderDetail } from "./useOrderDetail";

vi.mock("../api/ordersApi", () => ({
  getOrderById: vi.fn(),
}));

describe("useOrderDetail", () => {
  beforeEach(() => {
    vi.mocked(getOrderById).mockReset();
  });

  it("skips fetch when orderId is missing", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useOrderDetail(""), { wrapper: Wrapper });

    expect(getOrderById).not.toHaveBeenCalled();
  });

  it("loads order by id", async () => {
    const order = { id: "o1", status: "pending" };
    vi.mocked(getOrderById).mockResolvedValue(order as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderDetail("o1"), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getOrderById).toHaveBeenCalledWith("o1");
    expect(result.current.data).toEqual(order);
  });
});
