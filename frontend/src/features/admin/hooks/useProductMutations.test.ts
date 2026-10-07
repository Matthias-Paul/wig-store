import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import {
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../api/adminProductsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import {
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "./useProductMutations";

vi.mock("../api/adminProductsApi", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  updateProductStatus: vi.fn(),
  createVariant: vi.fn(),
  updateVariant: vi.fn(),
  deleteVariant: vi.fn(),
  setDiscount: vi.fn(),
  removeDiscount: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useProductMutations", () => {
  beforeEach(() => {
    vi.mocked(updateProduct).mockReset();
    vi.mocked(deleteProduct).mockReset();
    vi.mocked(updateProductStatus).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  it("useUpdateProduct invalidates product queries on success", async () => {
    vi.mocked(updateProduct).mockResolvedValue({ id: "p1" } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProduct("p1"), {
      wrapper: Wrapper,
    });

    result.current.mutate({ name: "Updated" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateProduct).toHaveBeenCalledWith("p1", { name: "Updated" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-products"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-product", "p1"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] });
    expect(toast.success).toHaveBeenCalledWith("Product updated");
  });

  it("useDeleteProduct invalidates lists on success", async () => {
    vi.mocked(deleteProduct).mockResolvedValue(undefined as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteProduct(), { wrapper: Wrapper });

    result.current.mutate("p2");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteProduct).toHaveBeenCalledWith("p2");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-products"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] });
  });

  it("useUpdateProductStatus publishes and invalidates", async () => {
    vi.mocked(updateProductStatus).mockResolvedValue(undefined as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProductStatus(), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: "p3", status: "published" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateProductStatus).toHaveBeenCalledWith("p3", "published");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-products"] });
    expect(toast.success).toHaveBeenCalledWith("Product published");
  });
});
