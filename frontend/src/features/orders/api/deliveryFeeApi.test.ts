import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getDeliveryFee } from "./deliveryFeeApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 404,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("deliveryFeeApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getDeliveryFee returns fee for a state on success", async () => {
    const fee = { id: "f1", state: "Lagos", fee: 1500, isActive: true };
    apiFetchMock.mockResolvedValue(jsonRes(fee));

    await expect(getDeliveryFee("Lagos")).resolves.toEqual(fee);
    expect(apiFetchMock).toHaveBeenCalledWith("/delivery-fee?state=Lagos");
  });

  it("getDeliveryFee throws server message on error", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "No fee" }, false));
    await expect(getDeliveryFee("Unknown")).rejects.toThrow("No fee");
  });
});
