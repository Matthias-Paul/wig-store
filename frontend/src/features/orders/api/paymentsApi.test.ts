import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { checkPaymentStatus, initializePayment } from "./paymentsApi";

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

describe("paymentsApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("initializePayment returns authorization details on success", async () => {
    const data = { authorizationUrl: "https://pay", reference: "ref-1" };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(initializePayment("order-1")).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({ orderId: "order-1" }),
    });
  });

  it("initializePayment throws server message on error", async () => {
    apiFetchMock.mockResolvedValue(jsonRes({ message: "Cannot pay" }, false));
    await expect(initializePayment("order-1")).rejects.toThrow("Cannot pay");
  });

  it("checkPaymentStatus returns status payload on success", async () => {
    const data = {
      orderId: "order-1",
      status: "paid",
      paystackReference: "ref-1",
    };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(checkPaymentStatus("order-1")).resolves.toEqual(data);
  });

  it("checkPaymentStatus throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(checkPaymentStatus("order-1")).rejects.toThrow(
      "Failed to check payment status",
    );
  });
});
