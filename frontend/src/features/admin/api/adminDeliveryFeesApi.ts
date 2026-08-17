import { apiFetch } from "@/src/lib/apiClient";
import type { DeliveryFee } from "@/src/types/deliveryFee";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getAllDeliveryFees(): Promise<DeliveryFee[]> {
  const res = await apiFetch("/delivery-fee/admin/all");
  return handleResponse(res);
}

export async function updateDeliveryFee(
  id: string,
  payload: { fee: number; isActive?: boolean },
) {
  const res = await apiFetch(`/delivery-fee/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
