import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getTransactions } from "./adminTransactionsApi";

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

describe("adminTransactionsApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getTransactions returns paginated data on success", async () => {
    const data = { transactions: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getTransactions({ page: 1, status: "paid" })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/admin/transactions?page=1&status=paid");
  });

  it("getTransactions throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getTransactions({})).rejects.toThrow("Failed to load transactions");
  });
});
