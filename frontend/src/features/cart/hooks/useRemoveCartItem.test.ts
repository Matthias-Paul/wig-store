import { describe, expect, it, vi, beforeEach } from "vitest";
import { removeCartItem } from "../api/cartApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useRemoveCartItem } from "./useRemoveCartItem";

vi.mock("../api/cartApi", () => ({
  removeCartItem: vi.fn(),
}));

describe("useRemoveCartItem", () => {
  beforeEach(() => {
    vi.mocked(removeCartItem).mockReset();
  });

  it("calls API and updates cart cache", async () => {
    const cart = { id: "c1", items: [], subtotal: 0 };
    vi.mocked(removeCartItem).mockResolvedValue({ cart } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const { result } = renderHook(() => useRemoveCartItem(), {
      wrapper: Wrapper,
    });

    result.current.mutate("i1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(removeCartItem).toHaveBeenCalledWith("i1");
    expect(queryClient.getQueryData(["cart"])).toEqual(cart);
  });
});
