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

export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export async function getMyOrders(params: { page?: number; status?: string; search?: string } = {}): Promise<PaginatedOrders> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  const res = await apiFetch(`/orders/my?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await apiFetch(`/orders/${id}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}