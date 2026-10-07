import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { checkout, getMyOrders, getOrderById } from "./ordersApi";

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

describe("ordersApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("checkout returns order payload on success", async () => {
    const body = { message: "ok", order: { id: "o1" } };
    apiFetchMock.mockResolvedValue(jsonRes(body));

    await expect(checkout({} as never)).resolves.toEqual(body);
    expect(apiFetchMock).toHaveBeenCalledWith("/orders/checkout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  });

  it("checkout throws server message on error", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Cart empty" }, false));
    await expect(checkout({} as never)).rejects.toThrow("Cart empty");
  });

  it("getMyOrders returns paginated orders on success", async () => {
    const data = { orders: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getMyOrders({ page: 2 })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/orders/my?page=2");
  });

  it("getMyOrders throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getMyOrders()).rejects.toThrow("Failed to load orders");
  });

  it("getOrderById returns order on success", async () => {
    const order = { id: "o1" };
    apiFetchMock.mockResolvedValue(jsonRes(order));

    await expect(getOrderById("o1")).resolves.toEqual(order);
  });

  it("getOrderById throws when not found", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getOrderById("o1")).rejects.toThrow("Order not found");
  });
});
