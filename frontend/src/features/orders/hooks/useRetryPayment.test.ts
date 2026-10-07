import { describe, expect, it, vi, beforeEach } from "vitest";
import { initializePayment } from "../api/paymentsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useRetryPayment } from "./useRetryPayment";

vi.mock("../api/paymentsApi", () => ({
  initializePayment: vi.fn(),
}));

describe("useRetryPayment", () => {
  beforeEach(() => {
    vi.mocked(initializePayment).mockReset();
    sessionStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });
  });

  it("stores pending order and redirects to Paystack", async () => {
    vi.mocked(initializePayment).mockResolvedValue({
      authorizationUrl: "https://pay.test/retry",
    } as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useRetryPayment(), { wrapper: Wrapper });

    result.current.mutate("o99");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(initializePayment).toHaveBeenCalledWith("o99");
    expect(sessionStorage.getItem("pendingOrderId")).toBe("o99");
    expect(window.location.href).toBe("https://pay.test/retry");
  });
});
