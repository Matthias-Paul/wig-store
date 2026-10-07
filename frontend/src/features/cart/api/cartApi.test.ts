import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cartApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/src/lib/guestId", () => ({
  getGuestId: vi.fn(() => "guest-123"),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
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

  it("getCart throws when the request fails", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getCart()).rejects.toThrow("Failed to load cart");
  });

  it("addToCart returns parsed response on success", async () => {
    const payload = { cart: { id: "c1", items: [] } };
    apiFetchMock.mockResolvedValue(jsonRes(payload));

    await expect(addToCart("v1", 2)).resolves.toEqual(payload);
    expect(apiFetchMock).toHaveBeenCalledWith("/cart/items", {
      method: "POST",
      headers: { "X-Guest-Id": "guest-123" },
      body: JSON.stringify({ variantId: "v1", quantity: 2 }),
    });
  });

  it("addToCart throws server message on error", async () => {
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

  it("removeCartItem throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(removeCartItem("item-1")).rejects.toThrow("Failed to remove item");
  });
});
