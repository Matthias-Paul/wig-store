import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import { addToCart } from "../api/cartApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useAddToCart } from "./useAddToCart";

vi.mock("../api/cartApi", () => ({
  addToCart: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useAddToCart", () => {
  beforeEach(() => {
    vi.mocked(addToCart).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  it("updates cart cache and toasts on success", async () => {
    const cart = { id: "c1", items: [{ id: "i1" }], subtotal: 100 };
    vi.mocked(addToCart).mockResolvedValue({ cart } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const { result } = renderHook(() => useAddToCart(), { wrapper: Wrapper });

    result.current.mutate({ variantId: "v1", quantity: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addToCart).toHaveBeenCalledWith("v1", 2);
    expect(queryClient.getQueryData(["cart"])).toEqual(cart);
    expect(toast.success).toHaveBeenCalledWith("Added to cart");
  });

  it("toasts error message on failure", async () => {
    vi.mocked(addToCart).mockRejectedValue(new Error("Out of stock"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAddToCart(), { wrapper: Wrapper });

    result.current.mutate({ variantId: "v1", quantity: 1 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Out of stock");
  });
});
