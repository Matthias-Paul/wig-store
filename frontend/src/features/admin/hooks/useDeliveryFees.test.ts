import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAllDeliveryFees } from "../api/adminDeliveryFeesApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useDeliveryFees } from "./useDeliveryFees";

vi.mock("../api/adminDeliveryFeesApi", () => ({
  getAllDeliveryFees: vi.fn(),
}));

describe("useDeliveryFees", () => {
  beforeEach(() => {
    vi.mocked(getAllDeliveryFees).mockReset();
  });

  it("loads all delivery fees", async () => {
    const fees = [{ state: "Lagos", amount: 1500 }];
    vi.mocked(getAllDeliveryFees).mockResolvedValue(fees as never);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useDeliveryFees(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAllDeliveryFees).toHaveBeenCalled();
    expect(result.current.data).toEqual(fees);
  });
});
