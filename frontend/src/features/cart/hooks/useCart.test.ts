import { describe, expect, it, vi, beforeEach } from "vitest";
import { getCart } from "../api/cartApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useCart } from "./useCart";

vi.mock("../api/cartApi", () => ({
  getCart: vi.fn(),
}));

const mockCart = { id: "c1", items: [], subtotal: 0 };

describe("useCart", () => {
  beforeEach(() => {
    vi.mocked(getCart).mockReset();
  });

  it("loads cart data", async () => {
    vi.mocked(getCart).mockResolvedValue(mockCart as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCart);
    expect(getCart).toHaveBeenCalled();
  });

  it("surfaces errors from getCart", async () => {
    vi.mocked(getCart).mockRejectedValue(new Error("Cart unavailable"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Cart unavailable");
  });
});
