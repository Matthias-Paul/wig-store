import { apiFetch } from "@/src/lib/apiClient";

export interface DeliveryFee {
  id: string;
  state: string;
  fee: number;
  isActive: boolean;
}

export async function getDeliveryFee(state: string): Promise<DeliveryFee> {
  const res = await apiFetch(
    `/delivery-fee?state=${encodeURIComponent(state)}`,
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || "Could not get delivery fee for this state",
    );
  }
  return res.json();
}
