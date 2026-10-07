import { describe, expect, it, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import { updateOrderStatus } from "../api/adminOrdersApi";
import {
  createQueryWrapper,
  renderHook,
  waitFor,
} from "@/src/test/reactQuery";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";

vi.mock("../api/adminOrdersApi", () => ({
  updateOrderStatus: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useUpdateOrderStatus", () => {
  beforeEach(() => {
    vi.mocked(updateOrderStatus).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  it("updates status and invalidates admin order queries", async () => {
    vi.mocked(updateOrderStatus).mockResolvedValue(undefined as never);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateOrderStatus(), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: "o1", status: "shipped" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateOrderStatus).toHaveBeenCalledWith("o1", "shipped");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-orders"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-order", "o1"] });
    expect(toast.success).toHaveBeenCalled();
  });

  it("surfaces API errors via toast", async () => {
    vi.mocked(updateOrderStatus).mockRejectedValue(new Error("Invalid status"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useUpdateOrderStatus(), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: "o1", status: "bad" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Invalid status");
  });
});
