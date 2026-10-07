import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  getAdminOrderById,
  getAdminOrders,
  updateOrderStatus,
} from "./adminOrdersApi";

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

describe("adminOrdersApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getAdminOrders returns paginated orders on success", async () => {
    const data = { orders: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getAdminOrders({ page: 1 })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/orders?page=1");
  });

  it("getAdminOrders throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Forbidden" }, false));
    await expect(getAdminOrders({})).rejects.toThrow("Forbidden");
  });

  it("getAdminOrderById returns order on success", async () => {
    const order = { id: "o1" };
    apiFetchMock.mockResolvedValue(jsonRes(order));

    await expect(getAdminOrderById("o1")).resolves.toEqual(order);
  });

  it("getAdminOrderById throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Missing" }, false));
    await expect(getAdminOrderById("o1")).rejects.toThrow("Missing");
  });

  it("updateOrderStatus returns updated order on success", async () => {
    const order = { id: "o1", status: "shipped" };
    apiFetchMock.mockResolvedValue(jsonRes(order));

    await expect(updateOrderStatus("o1", "shipped")).resolves.toEqual(order);
    expect(apiFetchMock).toHaveBeenCalledWith("/orders/o1/status", {
      method: "PATCH",
      body: JSON.stringify({ status: "shipped" }),
    });
  });

  it("updateOrderStatus throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Bad status" }, false));
    await expect(updateOrderStatus("o1", "bad")).rejects.toThrow("Bad status");
  });
});
