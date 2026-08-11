import { apiFetch } from "@/src/lib/apiClient";

export async function initializePayment(
  orderId: string,
): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await apiFetch("/payments/initialize", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to initialize payment");
  }
  return res.json();
}

export async function checkPaymentStatus(
  orderId: string,
): Promise<{ orderId: string; status: string; paystackReference: string }> {
  const res = await apiFetch(`/payments/${orderId}/status`);
  if (!res.ok) throw new Error('Failed to check payment status');
  return res.json();
}