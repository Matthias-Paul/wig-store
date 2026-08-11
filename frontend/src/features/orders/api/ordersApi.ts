import { apiFetch } from "@/src/lib/apiClient";
import type { Order, CreateOrderPayload } from "@/src/types/order";

export async function checkout(
  payload: CreateOrderPayload,
): Promise<{ message: string; order: Order }> {
  const res = await apiFetch("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to place order");
  }
  return res.json();
}
