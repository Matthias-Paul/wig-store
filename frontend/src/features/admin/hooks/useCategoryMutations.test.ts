import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/adminCategoriesApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategoryMutations";

vi.mock("../api/adminCategoriesApi", () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useCategoryMutations", () => {
  beforeEach(() => {
    vi.mocked(createCategory).mockReset();
    vi.mocked(updateCategory).mockReset();
    vi.mocked(deleteCategory).mockReset();
    vi.mocked(toast.success).mockReset();
  });

  it("useCreateCategory invalidates categories cache", async () => {
    vi.mocked(createCategory).mockResolvedValue({ id: "c1" } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCategory(), { wrapper: Wrapper });

    result.current.mutate({ name: "Lace", slug: "lace" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(createCategory).toHaveBeenCalledWith({ name: "Lace", slug: "lace" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
    expect(toast.success).toHaveBeenCalledWith("Category created");
  });

  it("useUpdateCategory invalidates categories cache", async () => {
    vi.mocked(updateCategory).mockResolvedValue({ id: "c1" } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateCategory("c1"), {
      wrapper: Wrapper,
    });

    result.current.mutate({ name: "Bob" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateCategory).toHaveBeenCalledWith("c1", { name: "Bob" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
  });

  it("useDeleteCategory invalidates categories cache", async () => {
    vi.mocked(deleteCategory).mockResolvedValue(undefined as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: Wrapper });

    result.current.mutate("c9");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteCategory).toHaveBeenCalledWith("c9");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
  });
});
