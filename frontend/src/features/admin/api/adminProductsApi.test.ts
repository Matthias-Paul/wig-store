import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getAdminProducts,
  removeDiscount,
  setDiscount,
  updateProduct,
  updateProductStatus,
  updateVariant,
  uploadImage,
} from "./adminProductsApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);
const fetchMock = vi.fn();

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("adminProductsApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getAdminProducts returns paginated products on success", async () => {
    const data = { products: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getAdminProducts({ page: 1 })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/products/admin/all?page=1");
  });

  it("getAdminProducts throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Denied" }, false));
    await expect(getAdminProducts()).rejects.toThrow("Denied");
  });

  it("createProduct returns product on success", async () => {
    const product = { id: "p1", name: "Wig" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(createProduct({} as never)).resolves.toEqual(product);
  });

  it("createProduct throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Invalid" }, false));
    await expect(createProduct({} as never)).rejects.toThrow("Invalid");
  });

  it("updateProduct returns product on success", async () => {
    const product = { id: "p1", name: "Updated" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(updateProduct("p1", { name: "Updated" } as never)).resolves.toEqual(
      product,
    );
  });

  it("updateProduct throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Not found" }, false));
    await expect(updateProduct("p1", {} as never)).rejects.toThrow("Not found");
  });

  it("deleteProduct resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(deleteProduct("p1")).resolves.toBeUndefined();
  });

  it("deleteProduct throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(deleteProduct("p1")).rejects.toThrow("Failed to delete product");
  });

  it("updateProductStatus returns product on success", async () => {
    const product = { id: "p1", status: "published" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(updateProductStatus("p1", "published")).resolves.toEqual(product);
  });

  it("updateProductStatus throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Bad" }, false));
    await expect(updateProductStatus("p1", "draft")).rejects.toThrow("Bad");
  });

  it("createVariant returns variant on success", async () => {
    const variant = { id: "v1" };
    apiFetchMock.mockResolvedValue(jsonRes(variant));

    await expect(createVariant("p1", {} as never)).resolves.toEqual(variant);
  });

  it("createVariant throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Fail" }, false));
    await expect(createVariant("p1", {} as never)).rejects.toThrow("Fail");
  });

  it("updateVariant returns variant on success", async () => {
    const variant = { id: "v1", price: 100 };
    apiFetchMock.mockResolvedValue(jsonRes(variant));

    await expect(updateVariant("p1", "v1", {} as never)).resolves.toEqual(variant);
  });

  it("updateVariant throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Fail" }, false));
    await expect(updateVariant("p1", "v1", {} as never)).rejects.toThrow("Fail");
  });

  it("deleteVariant resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(deleteVariant("p1", "v1")).resolves.toBeUndefined();
  });

  it("deleteVariant throws server message on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "In use" }, false));
    await expect(deleteVariant("p1", "v1")).rejects.toThrow("In use");
  });

  it("uploadImage returns image URL on success", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://api.test";
    const payload = { imageUrl: "https://cdn.test/img.png" };
    fetchMock.mockResolvedValue(jsonRes(payload));

    const file = new File(["x"], "photo.png", { type: "image/png" });
    await expect(uploadImage(file)).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/uploads/image",
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  });

  it("uploadImage throws on failure", async () => {
    fetchMock.mockResolvedValue(jsonRes({ message: "Upload failed" }, false));
    const file = new File(["x"], "photo.png", { type: "image/png" });
    await expect(uploadImage(file)).rejects.toThrow("Upload failed");
  });

  it("setDiscount returns product on success", async () => {
    const product = { id: "p1" };
    apiFetchMock.mockResolvedValue(jsonRes(product));

    await expect(
      setDiscount("p1", {
        discountPercentage: 10,
        startDate: "2026-01-01",
        endDate: "2026-02-01",
      }),
    ).resolves.toEqual(product);
  });

  it("setDiscount throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Bad dates" }, false));
    await expect(
      setDiscount("p1", {
        discountPercentage: 10,
        startDate: "2026-01-01",
        endDate: "2026-02-01",
      }),
    ).rejects.toThrow("Bad dates");
  });

  it("removeDiscount resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(removeDiscount("p1")).resolves.toBeUndefined();
  });

  it("removeDiscount throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(removeDiscount("p1")).rejects.toThrow("Failed to remove discount");
  });
});
