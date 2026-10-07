import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  getAdminStats,
  getOrdersByStatus,
  getRecentActivity,
  getRevenueChart,
} from "./adminApi";

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

describe("adminApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getAdminStats returns stats on success", async () => {
    const stats = { totalOrders: 10 };
    apiFetchMock.mockResolvedValue(jsonRes(stats));

    await expect(getAdminStats()).resolves.toEqual(stats);
    expect(apiFetchMock).toHaveBeenCalledWith("/admin/stats");
  });

  it("getAdminStats throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getAdminStats()).rejects.toThrow("Failed to load stats");
  });

  it("getRecentActivity returns activities on success", async () => {
    const data = { activities: [] };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getRecentActivity()).resolves.toEqual(data);
  });

  it("getRecentActivity throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getRecentActivity()).rejects.toThrow("Failed to load recent activity");
  });

  it("getRevenueChart returns chart data on success", async () => {
    const data = { chart: [] };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getRevenueChart("day", 30)).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/admin/charts/revenue?groupBy=day&days=30",
    );
  });

  it("getRevenueChart throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getRevenueChart("month", 7)).rejects.toThrow(
      "Failed to load revenue chart",
    );
  });

  it("getOrdersByStatus returns breakdown on success", async () => {
    const data = { breakdown: [] };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getOrdersByStatus()).resolves.toEqual(data);
  });

  it("getOrdersByStatus throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getOrdersByStatus()).rejects.toThrow("Failed to load order breakdown");
  });
});
