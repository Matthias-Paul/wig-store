import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateCartItem } from "../api/cartApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useUpdateCartItem } from "./useUpdateCartItem";

vi.mock("../api/cartApi", () => ({
  updateCartItem: vi.fn(),
}));

describe("useUpdateCartItem", () => {
  beforeEach(() => {
    vi.mocked(updateCartItem).mockReset();
  });

  it("calls API and updates cart cache", async () => {
    const cart = { id: "c1", items: [], subtotal: 50 };
    vi.mocked(updateCartItem).mockResolvedValue({ cart } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const { result } = renderHook(() => useUpdateCartItem(), {
      wrapper: Wrapper,
    });

    result.current.mutate({ itemId: "i1", quantity: 3 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateCartItem).toHaveBeenCalledWith("i1", 3);
    expect(queryClient.getQueryData(["cart"])).toEqual(cart);
  });
});
