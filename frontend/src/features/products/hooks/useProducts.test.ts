import { describe, expect, it, vi, beforeEach } from "vitest";
import { getProducts } from "../api/productsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useProducts } from "./useProducts";

vi.mock("../api/productsApi", () => ({
  getProducts: vi.fn(),
}));

describe("useProducts", () => {
  beforeEach(() => {
    vi.mocked(getProducts).mockReset();
  });

  it("fetches products with params", async () => {
    const payload = { data: [], meta: { total: 0, page: 1, limit: 12 } };
    vi.mocked(getProducts).mockResolvedValue(payload as never);

    const params = { page: 2, search: "bob" };
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProducts(params), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProducts).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(payload);
  });
});
