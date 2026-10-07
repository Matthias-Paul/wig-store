import { describe, expect, it, vi, beforeEach } from "vitest";
import { getProductBySlug } from "../api/productsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useProductDetail } from "./useProductDetail";

vi.mock("../api/productsApi", () => ({
  getProductBySlug: vi.fn(),
  getProductById: vi.fn(),
}));

describe("useProductDetail", () => {
  beforeEach(() => {
    vi.mocked(getProductBySlug).mockReset();
  });

  it("does not fetch when slug is empty", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useProductDetail(""), { wrapper: Wrapper });

    expect(getProductBySlug).not.toHaveBeenCalled();
  });

  it("loads product by slug", async () => {
    const product = { id: "p1", slug: "silk-bob", name: "Silk Bob" };
    vi.mocked(getProductBySlug).mockResolvedValue(product as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductDetail("silk-bob"), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductBySlug).toHaveBeenCalledWith("silk-bob");
    expect(result.current.data).toEqual(product);
  });
});
