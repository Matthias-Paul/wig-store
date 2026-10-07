import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getProductById, getProductBySlug, getProducts } from "./productsApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 404,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("productsApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("getProducts returns paginated data on success", async () => {
    const data = { products: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getProducts({ page: 1 })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/products?page=1");
  });

  it("getProducts throws when the request fails", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getProducts()).rejects.toThrow("Failed to load products");
  });

  it("getProductBySlug returns a product on success", async () => {
    const product = { id: "p1", slug: "wig-a" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(getProductBySlug("wig-a")).resolves.toEqual(product);
  });

  it("getProductBySlug throws when not found", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getProductBySlug("missing")).rejects.toThrow("Product not found");
  });

  it("getProductById returns a product on success", async () => {
    const product = { id: "p1" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(getProductById("p1")).resolves.toEqual(product);
  });

  it("getProductById throws when not found", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getProductById("p1")).rejects.toThrow("Product not found");
  });
});
