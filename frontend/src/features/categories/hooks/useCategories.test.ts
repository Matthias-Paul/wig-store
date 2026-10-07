import { describe, expect, it, vi, beforeEach } from "vitest";
import { getCategories } from "../api/categoriesApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useCategories } from "./useCategories";

vi.mock("../api/categoriesApi", () => ({
  getCategories: vi.fn(),
}));

describe("useCategories", () => {
  beforeEach(() => {
    vi.mocked(getCategories).mockReset();
  });

  it("loads categories", async () => {
    const categories = [{ id: "cat1", name: "Bob" }];
    vi.mocked(getCategories).mockResolvedValue(categories as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCategories(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getCategories).toHaveBeenCalled();
    expect(result.current.data).toEqual(categories);
  });
});
