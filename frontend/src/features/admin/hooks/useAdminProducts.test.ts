import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAdminProducts } from "../api/adminProductsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useAdminProducts } from "./useAdminProducts";

vi.mock("../api/adminProductsApi", () => ({
  getAdminProducts: vi.fn(),
}));

describe("useAdminProducts", () => {
  beforeEach(() => {
    vi.mocked(getAdminProducts).mockReset();
  });

  it("loads admin products", async () => {
    const products = { data: [], meta: { total: 0, page: 1 } };
    vi.mocked(getAdminProducts).mockResolvedValue(products as never);

    const params = { page: 1 };
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAdminProducts(params), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAdminProducts).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(products);
  });
});
