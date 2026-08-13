import { apiFetch } from "@/src/lib/apiClient";
import type { PaginatedNotifications } from "@/src/types/notification";

export async function getMyNotifications(
  page = 1,
): Promise<PaginatedNotifications> {
  const res = await apiFetch(`/notifications/my?page=${page}`);
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to mark as read");
}
