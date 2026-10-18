import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cartApi";

vi.mock("@/src/lib/apiClient", async () => {
  const actual = await vi.importActual<typeof import("@/src/lib/apiClient")>(
    "@/src/lib/apiClient",
  );
  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

vi.mock("@/src/lib/guestId", () => ({
  getGuestId: vi.fn(() => "guest-123"),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  const body = JSON.stringify(data);
  return {
    ok,
    status: ok ? 200 : 400,
    text: vi.fn().mockResolvedValue(body),
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("cartApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getCart returns parsed cart on success", async () => {
    const cart = { id: "c1", items: [] };
    apiFetchMock.mockResolvedValue(jsonRes(cart));

    await expect(getCart()).resolves.toEqual(cart);
    expect(apiFetchMock).toHaveBeenCalledWith("/cart", {
      headers: { "X-Guest-Id": "guest-123" },
    });
  });

  it("getCart throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({}, false));
    await expect(getCart()).rejects.toThrow("Failed to load cart");
  });

  it("addToCart returns parsed response on success", async () => {
    const payload = { cart: { id: "c1", items: [] } };
    apiFetchMock.mockResolvedValue(jsonRes(payload));

    await expect(addToCart("v1", 2)).resolves.toEqual(payload);
  });

  it("addToCart throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Out of stock" }, false));
    await expect(addToCart("v1", 1)).rejects.toThrow("Out of stock");
  });

  it("updateCartItem returns parsed response on success", async () => {
    const payload = { cart: { id: "c1", items: [] } };
    apiFetchMock.mockResolvedValue(jsonRes(payload));

    await expect(updateCartItem("item-1", 3)).resolves.toEqual(payload);
  });

  it("updateCartItem throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Bad qty" }, false));
    await expect(updateCartItem("item-1", 0)).rejects.toThrow("Bad qty");
  });

  it("removeCartItem returns parsed response on success", async () => {
    const payload = { cart: { id: "c1", items: [] } };
    apiFetchMock.mockResolvedValue(jsonRes(payload));

    await expect(removeCartItem("item-1")).resolves.toEqual(payload);
  });
});
