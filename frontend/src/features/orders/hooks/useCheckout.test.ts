import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import { checkout } from "../api/ordersApi";
import { initializePayment } from "../api/paymentsApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useCheckout } from "./useCheckout";

vi.mock("../api/ordersApi", () => ({
  checkout: vi.fn(),
}));

vi.mock("../api/paymentsApi", () => ({
  initializePayment: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useCheckout", () => {
  beforeEach(() => {
    vi.mocked(checkout).mockReset();
    vi.mocked(initializePayment).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
    sessionStorage.clear();
  });

  it("checks out, initializes payment, and invalidates cart", async () => {
    const order = { id: "o1" };
    vi.mocked(checkout).mockResolvedValue({
      order,
      message: "Order placed",
    } as never);
    vi.mocked(initializePayment).mockResolvedValue({
      authorizationUrl: "https://pay.test",
    } as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCheckout(), { wrapper: Wrapper });

    const payload = { shippingAddress: "Lagos" } as never;
    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(checkout).toHaveBeenCalledWith(payload);
    expect(initializePayment).toHaveBeenCalledWith("o1");
    expect(result.current.data?.authorizationUrl).toBe("https://pay.test");
    expect(sessionStorage.getItem("pendingOrderId")).toBe("o1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart"] });
    expect(toast.success).toHaveBeenCalledWith("Order placed");
  });

  it("toasts checkout errors", async () => {
    vi.mocked(checkout).mockRejectedValue(new Error("Empty cart"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCheckout(), { wrapper: Wrapper });

    result.current.mutate({} as never);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Empty cart");
  });
});
