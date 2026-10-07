import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getCategories } from "./categoriesApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("categoriesApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getCategories returns parsed list on success", async () => {
    const categories = [{ id: "1", name: "Lace" }];
    apiFetchMock.mockResolvedValue(jsonRes(categories));

    await expect(getCategories()).resolves.toEqual(categories);
    expect(apiFetchMock).toHaveBeenCalledWith("/categories");
  });

  it("getCategories throws when the request fails", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getCategories()).rejects.toThrow("Failed to load categories");
  });
});
