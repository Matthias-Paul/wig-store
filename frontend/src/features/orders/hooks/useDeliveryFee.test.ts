import { describe, expect, it, vi, beforeEach } from "vitest";
import { getDeliveryFee } from "../api/deliveryFeeApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useDeliveryFee } from "./useDeliveryFee";

vi.mock("../api/deliveryFeeApi", () => ({
  getDeliveryFee: vi.fn(),
}));

describe("useDeliveryFee", () => {
  beforeEach(() => {
    vi.mocked(getDeliveryFee).mockReset();
  });

  it("does not fetch without state", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useDeliveryFee(undefined), { wrapper: Wrapper });

    expect(getDeliveryFee).not.toHaveBeenCalled();
  });

  it("loads fee for state", async () => {
    vi.mocked(getDeliveryFee).mockResolvedValue({ amount: 1500 } as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeliveryFee("Lagos"), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getDeliveryFee).toHaveBeenCalledWith("Lagos");
    expect(result.current.data).toEqual({ amount: 1500 });
  });
});
