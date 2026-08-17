import { apiFetch } from "@/src/lib/apiClient";
import type { Order } from "@/src/types/order";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export interface AdminOrdersQuery {
  page?: number;
  status?: string;
  search?: string;
}

export interface PaginatedAdminOrders {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export async function getAdminOrders(
  params: AdminOrdersQuery,
): Promise<PaginatedAdminOrders> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const res = await apiFetch(`/orders?${query.toString()}`);
  return handleResponse(res);
}

export async function getAdminOrderById(id: string): Promise<Order> {
  const res = await apiFetch(`/orders/${id}`);
  return handleResponse(res);
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await apiFetch(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}
