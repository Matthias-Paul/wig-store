import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./adminCategoriesApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("adminCategoriesApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("createCategory returns category on success", async () => {
    const category = { id: "c1", name: "Lace", image: "img.png" };
    apiFetchMock.mockResolvedValue(jsonRes(category));

    await expect(
      createCategory({ name: "Lace", image: "img.png" }),
    ).resolves.toEqual(category);
  });

  it("createCategory throws server message on error", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Duplicate" }, false));
    await expect(createCategory({ name: "Lace", image: "x" })).rejects.toThrow(
      "Duplicate",
    );
  });

  it("updateCategory returns updated category on success", async () => {
    const category = { id: "c1", name: "New", image: "img.png" };
    apiFetchMock.mockResolvedValue(jsonRes(category));

    await expect(updateCategory("c1", { name: "New" })).resolves.toEqual(category);
  });

  it("updateCategory throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Not found" }, false));
    await expect(updateCategory("c1", { name: "New" })).rejects.toThrow("Not found");
  });

  it("deleteCategory resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(deleteCategory("c1")).resolves.toBeUndefined();
  });

  it("deleteCategory throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "In use" }, false));
    await expect(deleteCategory("c1")).rejects.toThrow("In use");
  });
});
