// src/features/admin/api/adminUsersApi.ts
import { apiFetch } from "@/src/lib/apiClient";
import type { PaginatedUsers } from "@/src/types/adminUser";

export interface AdminUsersQuery {
  page?: number;
  role?: string;
  search?:string;
}

export async function getAdminUsers(
  params: AdminUsersQuery,
): Promise<PaginatedUsers> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const res = await apiFetch(`/users?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}
