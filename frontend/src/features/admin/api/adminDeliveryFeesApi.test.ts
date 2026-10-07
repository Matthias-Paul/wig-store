import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getAllDeliveryFees, updateDeliveryFee } from "./adminDeliveryFeesApi";

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

describe("adminDeliveryFeesApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getAllDeliveryFees returns list on success", async () => {
    const fees = [{ id: "f1", state: "Lagos", fee: 1000, isActive: true }];
    apiFetchMock.mockResolvedValue(jsonRes(fees));

    await expect(getAllDeliveryFees()).resolves.toEqual(fees);
    expect(apiFetchMock).toHaveBeenCalledWith("/delivery-fee/admin/all");
  });

  it("getAllDeliveryFees throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Denied" }, false));
    await expect(getAllDeliveryFees()).rejects.toThrow("Denied");
  });

  it("updateDeliveryFee returns updated fee on success", async () => {
    const fee = { id: "f1", state: "Lagos", fee: 2000, isActive: true };
    apiFetchMock.mockResolvedValue(jsonRes(fee));

    await expect(updateDeliveryFee("f1", { fee: 2000 })).resolves.toEqual(fee);
  });

  it("updateDeliveryFee throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Invalid" }, false));
    await expect(updateDeliveryFee("f1", { fee: -1 })).rejects.toThrow("Invalid");
  });
});
